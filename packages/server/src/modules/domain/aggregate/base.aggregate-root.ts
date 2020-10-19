import {BaseDomainEvent} from "../events/impl/base-domain.event";

export type AggregateRootConstructor<TAggregate extends BaseAggregateRoot> = { new(id: string, params: Record<string, any>, version?: number): TAggregate };

export abstract class BaseAggregateRoot {
    protected abstract handlers: Map<string, (event: BaseDomainEvent) => void>;

    private readonly _changes: BaseDomainEvent[] = [];
    private _id: string;
    private _version: number;
    private _eventVersion: number;

    get id(): string {
        return this._id;
    }

    get version(): number {
        return this._version;
    }

    protected constructor(
        id: string,
        record: Record<string, any>,
        version: number = 0
    ) {
        this._id = id;
        this.buildFromRecord(record);
        this._version = version;
        this._eventVersion = this._version;
    }

    public getUncommittedChanges(): BaseDomainEvent[] {
        return this._changes;
    }

    public markChangesAsCommitted(): void {
        this._changes.length = 0;
    }

    public loadFromHistory(history: BaseDomainEvent[]) {
        if (history.length === 0) {
            return;
        }

        for (const event of history) {
            this.applyInternal(event, false);
        }

        this._id = history[0].aggregateRootId;
        this._version = history[history.length - 1].version;
        this._eventVersion = this._version;
    }

    public apply<TEvent extends BaseDomainEvent>(event: TEvent) {
        event.version = this.getEventVersion();
        this.applyInternal(event);
    }

    private getEventVersion(): number {
        return ++this._eventVersion;
    }

    private applyInternal<TEvent extends BaseDomainEvent>(event: TEvent, isNew: boolean = true) {
        if (isNew) this._changes.push(event);

        const handler = this.handlers.get(event.eventType);

        handler?.(event);
    }

    private getEventName(event: BaseDomainEvent) {
        const { constructor } = Object.getPrototypeOf(event);
        return constructor.name as string;
    }

    protected buildFromRecord(record: Record<string, any>) {
        const keysToExclude: string[] = [
            '_id',
            'id',
            'version',
            'aggregateRootId'
        ];

        const aggregateRootFunctionNames = Object.getOwnPropertyNames(this).filter(x => typeof this[x] === "function");

        for (const key of Object.keys(record)) {
            if (!aggregateRootFunctionNames.includes(key) && !keysToExclude.includes(key)) {
                this[key] = record[key];
            }
        }
    }

    public get asJson() {
        return {
            id: this.id,
            version: this.version
        }
    }
}
