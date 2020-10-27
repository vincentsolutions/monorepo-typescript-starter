import * as React from 'react';
import './AccountPage.less';
import {observer} from "mobx-react";
import {Button, Form, FormGroup, Input} from "reactstrap";
import {action, makeObservable, observable, when} from "mobx";
import {AuthStore, lazyInject, UserStore} from "@monorepo/core";
import {Trans} from "@lingui/macro";

export interface IAccountPageProps {

}

@observer
class AccountPage extends React.Component<IAccountPageProps, {}> {
    @lazyInject(UserStore) private readonly _userStore: UserStore;
    @lazyInject(AuthStore) private readonly _authStore: AuthStore;
    
    @observable private firstName: string = "";
    @observable private lastName: string = "";

    constructor(props) {
        super(props);

        makeObservable(this);

        when(
            () => this._authStore.isAuthenticated,
            () => this.loadAccountInfo()
        )
    }

    @action private loadAccountInfo = () => {
        this.firstName = this._authStore.identity?.firstName ?? "";
        this.lastName = this._authStore.identity?.lastName ?? "";
    }

    @action private onFirstNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        
        this.firstName = event.currentTarget.value;
    }
    
    @action private onFirstNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        this._userStore.updateUserFirstName(this._userStore.ownUser!.id, this.firstName);
    }

    @action private onLastNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        
        this.lastName = event.currentTarget.value;
    }

    @action private onLastNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        this._userStore.updateUserLastName(this._userStore.ownUser!.id, this.lastName);
    }

    render() {
        const {} = this.props;

        if (!this._userStore.ownUser) {
            return null;
        }

        return (
            <div id="AccountPage">
                <Form onSubmit={this.onFirstNameSubmit}>
                    <FormGroup>
                        <Input type={'text'} value={this.firstName} onChange={this.onFirstNameChange} />
                        <Button color={'primary'} type={'submit'}><Trans>Save</Trans></Button>
                    </FormGroup>
                </Form>
                <Form onSubmit={this.onLastNameSubmit}>
                    <FormGroup>
                        <Input type={'text'} value={this.lastName} onChange={this.onLastNameChange} />
                        <Button color={'primary'} type={'submit'}><Trans>Save</Trans></Button>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}

export default AccountPage;