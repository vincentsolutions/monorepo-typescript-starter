import {Injectable} from '@nestjs/common';
import {EventStore} from "./event-store.provider";
import {BaseDomainEvent} from "../domain/events/impl/base-domain.event";
import {Config} from "../core/config/config";
import * as http from "http";
import {Event} from "geteventstore-promise/index";
import {Subject} from "rxjs";
import * as xml2js from 'xml2js';
import {Logger} from "@server/core";

export type DomainEventFactoryMethod = (data: any) => BaseDomainEvent;

@Injectable()
export class EventStoreService {
    private eventFactories: Map<string, DomainEventFactoryMethod> = new Map<string, DomainEventFactoryMethod>();

    constructor(
        private readonly eventStore: EventStore,
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

    async publish<T extends BaseDomainEvent>(event: T): Promise<any> {
        const eventType = event.constructor.name;

        try {
            await this.eventStore.client.writeEvent(event.streamName, eventType, event);
            // await this.eventBus.publish(event);
        } catch (e) {
            this.logger.error(e);
        }
    }

    async getEventsForAggregate(aggregateId: string, aggregateName: string, chunkSize?: number, startPosition?: number, resolveLinkTos?: boolean): Promise<BaseDomainEvent[]> {
        const streamName = `${aggregateName}-${aggregateId}`;
        const events = await this.eventStore.client.getAllStreamEvents(streamName, chunkSize, startPosition, resolveLinkTos);

        return events.map(x => BaseDomainEvent.fromEventStore(x));
    }

    setEventFactories(eventHandlers: Array<[ string, DomainEventFactoryMethod ]>) {
        for (const [k, v] of eventHandlers) {
            this.eventFactories.set(k, v);
        }
    }

    async bridgeEventsTo<T extends BaseDomainEvent>(subject: Subject<T>, aggregateName: string): Promise<any> {
        const streamName = `$ce-${aggregateName}`;

        const onEvent = (subscription, event: Event) => {
            const eventUrl = this.eventStoreHostUrl + `${(event.metadata as any).$o}/${(event.data as any).split('@')[0]}`;
            const authString = `${this.config.EVENT_STORE_SETTINGS.credentials.username}:${this.config.EVENT_STORE_SETTINGS.credentials.password}`;

            http.get(eventUrl, { auth: authString }, res => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', chunk => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    xml2js.parseString(rawData, { explicitArray: false }, (err, result) => {
                        if (err) {
                            this.logger.error(err);
                            return;
                        }

                        const content = result['atom:entry']['atom:content'];
                        const eventType = content.eventType;
                        const data = content.data;

                        // @ts-ignore
                        event = this.eventFactories.get(eventType)?.(data);
                        subject.next(event as any);
                    })
                })
            });
        };

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
