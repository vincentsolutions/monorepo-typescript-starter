import {injectable} from "inversify";
import {BaseModel, BaseStore, AuthStore, container} from "../internal";
import {action, computed, observable, reaction, runInAction} from "mobx";

@injectable()
export abstract class BaseCollectionStore<TModel extends BaseModel> extends BaseStore {
    protected readonly _authStore: AuthStore = container.resolve(AuthStore);

    @observable public loadingStates: Map<string, boolean> = new Map<string, boolean>();

    @observable protected _items: TModel[] = [];
    @computed public get items(): TModel[] { return this._items };

    protected constructor() {
        super();

        if (this._authStore.isAuthenticated) {
            this.loadItems();
        }

        reaction(
            () => this._authStore.isAuthenticated,
            () => this.loadItems()
        )
    }

    protected abstract _loadItems(): Promise<TModel[]>;
    @action public async loadItems() {
        this.loadingStates.set(this.loadItems.name, true);

        try {
            const result = await this._loadItems();

            runInAction(() => {
                this._items = result;
                this.loadingStates.set(this.loadItems.name, false);
            });
        } catch (e) {
            console.log(e);
            // TODO: Handle Error
        }
    }
}