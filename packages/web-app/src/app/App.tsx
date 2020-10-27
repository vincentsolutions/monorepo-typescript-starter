import * as React from 'react';
import './App.less';
import {observer} from "mobx-react";
import AuthContainer from "./containers/auth/AuthContainer";
import UnauthContainer from "./containers/unauth/UnauthContainer";
import {Redirect, Route, Switch} from "react-router";

export interface IAppProps {

}

@observer
export class App extends React.Component<IAppProps, { }> {
    render() {

        return (
            <div id="App">
                <Switch>
                    <Route path={'/unauth'} component={UnauthContainer} />
                    <Route path={'/auth'} component={AuthContainer} />
                    <Redirect to={'/unauth'} />
                </Switch>
            </div>
        )
    }
}