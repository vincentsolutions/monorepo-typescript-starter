import {observer} from "mobx-react";
import {BaseI18nLoader} from "@monorepo/core";
import {runInAction} from "mobx";

export interface IWebAppI18nLoaderProps {

}

@observer
class WebAppI18nLoader extends BaseI18nLoader<IWebAppI18nLoaderProps> {
    protected loadCatalog = async () => {
        if (!this._localizationStore) {
            console.log('LocalizationStore:', this._localizationStore);
            return;
        }

        const catalog = await import(
            /* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */
            `@lingui/loader!./locale/${this._localizationStore.currentLocale}/messages.po`);

        runInAction(() => {
            this.catalogs = {
                ...this.catalogs,
                [this._localizationStore.currentLocale]: catalog
            }
        });
    }
}

export default WebAppI18nLoader;