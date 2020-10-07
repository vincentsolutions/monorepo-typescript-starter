import * as React from 'react';
import './App.less';
import {container, LocalizationStore} from "@monorepo/core";
import {Trans} from "@lingui/macro";

export interface IAppProps {

}

export const App: React.FunctionComponent<IAppProps> = (props) => {
    const {} = props;

    const localizationStore = container.resolve(LocalizationStore);

    return (
        <div id="App">
            <Trans>Hello World, my current language is {localizationStore.currentLocale}</Trans>
        </div>
    )
};