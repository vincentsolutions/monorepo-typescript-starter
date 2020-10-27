import {BaseStore, container} from "../internal";
import {action, makeObservable, observable} from "mobx";
import {injectable} from "inversify";

export type AvailableLocales = "fr" | "en";

@injectable()
export class LocalizationStore extends BaseStore {
    @observable public currentLocale: AvailableLocales = (navigator.language.includes('-') ? navigator.language.split('-')[0] : navigator.language) as AvailableLocales;

    constructor() {
        super();

        setTimeout(() => {
            this.currentLocale = 'fr';
        }, 2000)
    }

    @action updateCurrentLocale(locale: AvailableLocales) {
        this.currentLocale = locale;
    }

    protected makeObservable(): void {
        makeObservable(this);
    }
}

container.bind(LocalizationStore).toSelf().inSingletonScope();