import "reflect-metadata";
import "@babel/polyfill";
import "@monorepo/extensions";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./index.less";
import { App } from './app/App';
import WebAppI18nLoader from "./WebAppI18nLoader";
import {createBrowserHistory} from "history";
import {Router} from "react-router";
import { Provider } from 'mobx-react';
import {UserStore} from "@monorepo/core/lib/stores/UserStore";

export const history = createBrowserHistory();

ReactDOM.render(
    <Router history={history}>
        <Provider userStore={new UserStore()}>
            <WebAppI18nLoader>
                <App />
            </WebAppI18nLoader>
        </Provider>
    </Router>,
    document.getElementById('root')
)