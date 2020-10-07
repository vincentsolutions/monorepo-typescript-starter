import * as React from 'react';
import {makeObservable, observable, reaction} from "mobx";
import {Catalogs, setupI18n} from "@lingui/core";
import {I18nProvider} from "@lingui/react";
import {container, LocalizationStore} from '../internal';

export interface II18nLoaderProps {

}

export const i18n = setupI18n();

export abstract class BaseI18nLoader<TProps = {}> extends React.Component<II18nLoaderProps & TProps, {}> {
    protected readonly _localizationStore: LocalizationStore = container.get(LocalizationStore);

    @observable protected catalogs: Catalogs = {};

    currentLocaleReactionDisposer = reaction(
        () => this._localizationStore?.currentLocale,
        () => this.loadCatalog()
    );

    constructor(props) {
        super(props);

        makeObservable(this);
    }

    componentDidMount() {
        this.loadCatalog();
    }

    componentWillUnmount() {
        this.currentLocaleReactionDisposer();
    }

    protected abstract loadCatalog: () => Promise<void>;

    render() {
        const { children } = this.props;

        return (
            <I18nProvider language={this._localizationStore?.currentLocale}
                          catalogs={this.catalogs}
                          i18n={i18n}
            >
                { children }
            </I18nProvider>
        )
    }
}