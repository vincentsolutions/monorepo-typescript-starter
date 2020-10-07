import {BaseStore, container} from "../internal";
import {action, makeObservable, observable} from "mobx";
import {injectable} from "inversify";

export type CurrentLocales = "fr" | "en";

@injectable()
export class LocalizationStore extends BaseStore {
    @observable public currentLocale: CurrentLocales = (navigator.language.includes('-') ? navigator.language.split('-')[0] : navigator.language) as CurrentLocales;

    constructor() {
        super();

        makeObservable(this);

        setTimeout(() => {
            this.currentLocale = 'fr';
        }, 2000)
    }

    @action updateCurrentLocale(currentLocale: CurrentLocales) {
        this.currentLocale = currentLocale;
    }
}

container.bind(LocalizationStore).toSelf().inSingletonScope();