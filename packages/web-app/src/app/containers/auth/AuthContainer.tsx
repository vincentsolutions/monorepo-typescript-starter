import * as React from 'react';
import './AuthContainer.less';
import {observer} from "mobx-react";
import {AuthStore, lazyInject, UserStore} from "@monorepo/core";
import {Trans} from "@lingui/macro";
import AccountPage from "./views/account/AccountPage";
import {Redirect, Route, Switch} from "react-router";

export interface IAuthContainerProps {

}

@observer
export class AuthContainer extends React.Component<IAuthContainerProps> {
    @lazyInject(AuthStore) private readonly _authStore: AuthStore;
    @lazyInject(UserStore) private readonly _userStore: UserStore;

    componentDidMount() {
        this._authStore.requestAccessToken();
    }

    render() {
        const {} = this.props;

        return (
            <div id="AuthContainer">
                <h1><Trans>Hello {this._userStore.ownUser?.firstName}!</Trans></h1>
                {
                    this._authStore.isAuthenticated && (
                        <Switch>
                            <Route path={'/auth/account'} component={AccountPage} />
                            <Redirect to={'/auth/account'} />
                        </Switch>
                    )
                }
            </div>
        )
    }
}

export default AuthContainer;