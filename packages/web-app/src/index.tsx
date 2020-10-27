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
import {container} from "@monorepo/core";

export const history = createBrowserHistory();
container.bind(Symbol.for(History.name)).toConstantValue(history);

ReactDOM.render(
    <Router history={history}>
            <WebAppI18nLoader>
                <App />
            </WebAppI18nLoader>
    </Router>,
    document.getElementById('root')
)