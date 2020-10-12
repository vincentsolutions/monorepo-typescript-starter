import * as React from 'react';
import './App.less';
import {Trans} from "@lingui/macro";
import {observer} from "mobx-react";
import {container, UserStore} from "@monorepo/core";

export interface IAppProps {

}

// @observer
// export class App extends React.Component<IAppProps, { }> {
//     @lazyInject(UserStore) private readonly _userStore: UserStore;
//
//     render() {
//         return (
//             <div id="App">
//                 <Trans>Hello World, I have {this._userStore.items.length} user{this._userStore.items.length > 1 ? 's' : ''}. The first user is called {this._userStore.items.firstOrDefault()?.displayName}.</Trans>
//             </div>
//         )
//     }
// }

export const App: React.FunctionComponent<IAppProps> = observer((props) => {
    const {} = props;

    const userStore = container.get(UserStore);

    return (
        <div id="App">
            <Trans>Hello World, I have {userStore.items.length} user{userStore.items.length > 1 ? 's' : ''}. The first user is called {userStore.items.firstOrDefault()?.displayName}.</Trans>
        </div>
    )
});