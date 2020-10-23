import * as React from 'react';
import './App.less';
import {Trans} from "@lingui/macro";
import {observer} from "mobx-react";
import {AuthStore, container, UserStore} from "@monorepo/core";
import socketIoClient from "socket.io-client";

export interface IAppProps {

}

@observer
export class App extends React.Component<IAppProps, { }> {
    private readonly _userStore: UserStore = container.get(UserStore);
    private readonly _authStore: AuthStore = container.get(AuthStore);
    private readonly _socket = socketIoClient('http://localhost:4555');

    componentDidMount() {
        this.bootstrap();
    }

    async bootstrap() {
        await this.signIn();
        await this._userStore.loadItems();
        this.initWebsocketConnection();
    }

    async signIn() {
        await this._authStore.signIn('cvpp@icloud.com', 'MonoRepo$1234');
    }

    private initWebsocketConnection() {
        this._socket.on('UserFirstNameUpdatedEvent', data => {
            console.log('Socket Data: ', data);
        });
        this._socket
            .connect()
            .emit('authenticate', { token: this._authStore._accessToken })
            .on('authenticated', () => {
                console.log('authenticated!')
            })
            .on('unauthorized', msg => {
                console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
                throw new Error(msg.data.type);
            })
            .emit('events', 'test');
    }

    render() {
        return (
            <div id="App">
                <Trans>Hello World, I have {this._userStore.items.length} user{this._userStore.items.length > 1 ? 's' : ''}. The first user is called {this._userStore.items.firstOrDefault()?.displayName}.</Trans>
            </div>
        )
    }
}

// export const App: React.FunctionComponent<IAppProps> = observer((props) => {
//     const {} = props;
//
//     cosnt [] = useState<Respons>(null)
//
//     const userStore = container.get(UserStore);
//
//     return (
//         <div id="App">
//             <Trans>Hello World, I have {userStore.items.length} user{userStore.items.length > 1 ? 's' : ''}. The first user is called {userStore.items.firstOrDefault()?.displayName}.</Trans>
//         </div>
//     )
// });