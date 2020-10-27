import {BaseDomainEvent} from "../impl/base-domain.event";
import {BaseEventHandler} from "./base.event-handler";
import {BaseRepository} from "../../../core/base/repositories/base.repository";

export abstract class BaseDomainEventHandler<TEvent extends BaseDomainEvent, TRepository extends BaseRepository> extends BaseEventHandler<TEvent, TRepository> {
    protected abstract handleInternal(event: TEvent): Promise<void>;
}