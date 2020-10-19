import {UpdateUserEmailCommandHandler} from "./update-user-email.handler";
import {Test, TestingModule} from "@nestjs/testing";
import {CqrsModule} from "@nestjs/cqrs";
import {UsersModule} from "../../users.module";
import {Connection} from "typeorm/index";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

describe(UpdateUserEmailCommandHandler, () => {
    let sut: UpdateUserEmailCommandHandler;

    const existingEmails = [
        'super_admin@monorepo.xyz.com'
    ];
    const connection = {
        getRepository: (entityClass: EntityClassOrSchema) => ({
            count: ({ email }) => existingEmails.filter(x => email === x).length
        })
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CqrsModule, UsersModule],
            providers: [
                UpdateUserEmailCommandHandler
            ]
        })
            .overrideProvider(Connection)
            .useValue(connection)
            .compile();

        sut = module.get<UpdateUserEmailCommandHandler>(UpdateUserEmailCommandHandler);
    });

    it("should be defined", () => {
        expect(sut).toBeDefined();
    });
});