export interface IDomainEvent<TParams extends {}> {
    readonly eventType: string;
    readonly aggregateRootId: string;
    readonly params: TParams;
    readonly aggregateName: string;
    byUserId: string;
    date: string;
    version: number;
}