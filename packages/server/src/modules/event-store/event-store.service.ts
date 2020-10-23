import {Injectable} from '@nestjs/common';
import {EventStore} from "./event-store.provider";
import {BaseDomainEvent} from "../domain/events/impl/base-domain.event";
import {Config} from "../core/config/config";
import * as http from "http";
import {Event} from "geteventstore-promise/index";
import {Subject} from "rxjs";
import xml2js from 'xml2js';
import {EventBus} from "@nestjs/cqrs";
import {BaseAggregateRoot} from "../domain/aggregate/base.aggregate-root";
import {Logger} from "../core/services/logger.service";

@Injectable()
export class EventStoreService {
    private eventHandlers: object;

    constructor(
        private readonly eventStore: EventStore,
        private readonly eventBus: EventBus,
        private readonly logger: Logger,
        private readonly config: Config
    ) {
        this.eventStore.connect({
            hostname: config.EVENT_STORE_SETTINGS.hostname,
            port: config.EVENT_STORE_SETTINGS.tcpPort,
            credentials: config.EVENT_STORE_SETTINGS.credentials,
            poolOptions: config.EVENT_STORE_SETTINGS.poolOptions
        });
    }

    get eventStoreHostUrl(): string {
        return this.config.EVENT_STORE_SETTINGS.protocol +
            `://${this.config.EVENT_STORE_SETTINGS.hostname}:${this.config.EVENT_STORE_SETTINGS.httpPort}/streams/`;
    }

    async publish<T extends BaseDomainEvent>(event: T, aggregate: BaseAggregateRoot): Promise<any> {
        const aggregateName = Object.getPrototypeOf(aggregate).constructor.name;
        const streamName = `${aggregateName}-${event.aggregateRootId}`;
        const eventType = event.constructor.name;

        try {
            await this.eventStore.client.writeEvent(streamName, eventType, event);
            await this.eventBus.publish(event);

            aggregate.updateVersion(event.version);
        } catch (e) {
            this.logger.error(e);
        }
    }

    async getEventsForAggregate(aggregateId: string, aggregateName: string, chunkSize?: number, startPosition?: number, resolveLinkTos?: boolean): Promise<BaseDomainEvent[]> {
        const streamName = `${aggregateName}-${aggregateId}`;
        const events = await this.eventStore.client.getAllStreamEvents(streamName, chunkSize, startPosition, resolveLinkTos);

        return events.map(x => BaseDomainEvent.fromEventStore(x));
    }

    setEventHandlers(eventHandlers: object) {
        this.eventHandlers = eventHandlers;
    }

    bridgeEventsTo<T extends BaseDomainEvent>(subject: Subject<T>, aggregateName: string): any {
        const streamName = `$ce-${aggregateName}`;

        const onEvent = async (subscription, event: Event) => {
            console.log('onEvent: ', subscription, event);
            const eventUrl = this.eventStoreHostUrl + `${(event.metadata as any).$O}/${(event.data as any).split('@')[0]}`;

            http.get(eventUrl, res => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', chunk => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    xml2js.parseString(rawData, (err, result) => {
                        if (err) {
                            this.logger.error(err);
                            return;
                        }

                        const content = result['atom:entry']['atom:content'][0];
                        const eventType = content.eventType[0];
                        const data = content.data[0];
                        event = this.eventHandlers[eventType](...Object.values(data));
                        subject.next(event as any);
                    })
                })
            });
            const onDropped = (subscription, reason, error) => {
                this.logger.error(subscription);
                this.logger.error(reason);
                this.logger.error(error);
            }

            try {
                await this.eventStore.client.subscribeToStream(
                    streamName,
                    onEvent,
                    onDropped,
                    false
                );
            } catch (e) {
                this.logger.error(e);
            }
        }
    }
}
