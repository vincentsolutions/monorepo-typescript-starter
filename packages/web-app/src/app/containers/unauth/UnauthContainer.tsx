import * as React from 'react';
import './UnauthContainer.less';
import {observer} from "mobx-react";
import {Redirect, Route, Switch} from "react-router";
import LoginPage from "./views/signIn/SignInPage";

export interface IUnauthContainerProps {

}

@observer
class UnauthContainer extends React.Component<IUnauthContainerProps> {

    render() {
        const {} = this.props;

        return (
            <div id="UnauthContainer">
                <Switch>
                    <Route path={'/unauth/login'} component={LoginPage} />
                    <Redirect to={'/unauth/login'} />
                </Switch>
            </div>
        )
    }
}

export default UnauthContainer;