import * as React from 'react';
import './SignInPage.less';
import {observer} from "mobx-react";
import {AuthStore, lazyInject} from "@monorepo/core";
import {action, makeObservable, observable} from "mobx";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import {Trans} from "@lingui/macro";

export interface ISignInPageProps {

}

@observer
class SignInPage extends React.Component<ISignInPageProps, {}> {
    @lazyInject(AuthStore) private readonly _authStore: AuthStore;

    @observable private email: string = "";
    @observable private password: string = "";

    constructor(props) {
        super(props);

        makeObservable(this);
    }

    @action onEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();

        this.email = event.currentTarget.value;
    }

    @action onPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();

        this.password = event.currentTarget.value;
    }

    onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        this._authStore.signIn(this.email, this.password);
    }

    render() {
        const {} = this.props;

        return (
            <div id="SignInPage">
                <h1><Trans>Sign In</Trans></h1>
                <Form onSubmit={this.onFormSubmit}>
                    <FormGroup>
                        <Label><Trans>Email</Trans></Label>
                        <Input type={'text'} value={this.email} onChange={this.onEmailChange} placeholder={'john.doe@example.com'} />
                    </FormGroup>
                    <FormGroup>
                        <Label><Trans>Password</Trans></Label>
                        <Input type={'password'} value={this.password} onChange={this.onPasswordChange} placeholder={'********'} />
                    </FormGroup>
                    <Button type={'submit'} color={'primary'}><Trans>Sign In</Trans></Button>
                </Form>
            </div>
        )
    }
}

export default SignInPage;