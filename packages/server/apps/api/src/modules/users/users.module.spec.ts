import {INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {UsersModule} from "./users.module";
import {CreateUserDto} from "./dtos/create-user.dto";
import { json, urlencoded } from 'body-parser';
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {CoreModule} from "../core/core.module";
import {AggregateSnapshot} from "../domain/entities/aggregate-snapshot.entity";
import * as ormConfig from "../../../../../ormconfig";

describe('Users', () => {
    let app: INestApplication;
    const mockRepository = jest.fn(() => ({
        metadata: {
            columns: [],
            relations: []
        },
        save: jest.fn(() => {})
    }))

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [UsersModule, CoreModule, TypeOrmModule.forRoot(ormConfig)]
        })
            .overrideProvider(getRepositoryToken(User))
            .useValue(mockRepository)
            .overrideProvider(getRepositoryToken(AggregateSnapshot))
            .useValue(mockRepository)
            .compile();

        app = moduleRef.createNestApplication();
        app.use(json());
        app.use(urlencoded({ extended: false }))
        await app.init();
    });

    it("should be defined", () => {
        expect(app).toBeDefined();
    });

    // it('/POST users', () => {
    //     return request(app.getHttpServer())
    //         .post('/users')
    //         .send(userCreationParams)
    //         .expect(200, (err, response) => {
    //             console.log(response.body);
    //         });
    // })

    afterAll(async () => {
        await app.close();
    })
})

const userCreationParams: CreateUserDto = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@monorepo.xyz.com",
    password: "MonoRepo1234"
};