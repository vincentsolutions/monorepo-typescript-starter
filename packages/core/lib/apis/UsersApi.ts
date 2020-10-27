import {BaseApi, container, IBaseApi, IUserDto, IUserInput} from "../internal";
import {injectable} from "inversify";

export interface IUsersApi extends IBaseApi {
    getUsers(): Promise<IUserDto[]>;
    getUser(id: string): Promise<IUserDto | undefined>;
    addUser(user: IUserDto): Promise<void>;
    updateUser(id: string, user: IUserInput): Promise<void>;
    updateUserFirstName(id: string, firstName: string): Promise<void>;
    updateUserLastName(id: string, lastName: string): Promise<void>;
    deleteUser(id: string): Promise<void>;
}

@injectable()
export class UsersApi extends BaseApi implements IUsersApi {
    getUsers(): Promise<IUserDto[]> {
        // return new Promise<IUserDto[]>(resolve => {
        //     resolve([
        //         {
        //             firstName: "John",
        //             lastName: 'Doe',
        //             email: "john.doe@acme.com",
        //             id: v4(),
        //             permissions: [],
        //             createdAt: new Date().toISOString()
        //         }
        //     ])
        // })
        return this._apiClient.get('/Users');
    }

    getUser(id: string): Promise<IUserDto | undefined> {
        return this._apiClient.get(`/Users/${id}`);
    }

    addUser(dto: IUserDto): Promise<void> {
        return this._apiClient.post('/Users', dto);
    }

    updateUser(id: string, input: IUserInput): Promise<void> {
        return this._apiClient.put(`/Users/${id}`, input);
    }

    updateUserFirstName(id: string, firstName: string): Promise<void> {
        return this._apiClient.put(`/Users/${id}/FirstName`, { firstName });
    }

    updateUserLastName(id: string, lastName: string): Promise<void> {
        return this._apiClient.put(`/Users/${id}/LastName`, { lastName });
    }

    deleteUser(id: string): Promise<void> {
        return this._apiClient.delete(`/Users/${id}`);
    }

}

container.bind<IUsersApi>(Symbol.for(`I${UsersApi.name}`)).to(UsersApi).inSingletonScope();