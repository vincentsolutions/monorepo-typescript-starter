import "reflect-metadata";
import "@babel/polyfill";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./index.less";
import { App } from './app/App';
import WebAppI18nLoader from "./WebAppI18nLoader";
import {createBrowserHistory} from "history";
import {Router} from "react-router";
import {container} from "@monorepo/core";

console.log(container);

export const history = createBrowserHistory();

ReactDOM.render(
    <Router history={history}>
        <WebAppI18nLoader>
            <App />
        </WebAppI18nLoader>
    </Router>,
    document.getElementById('root')
)