import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as cookieParser from 'cookie-parser';
import {authConstants, coreConstants} from "./modules/auth/constants";
import {Environment} from "@sharedKernel";
import {ForbiddenException} from "@nestjs/common";
import {createNamespace} from "cls-hooked";

export const clsNamespace = createNamespace(coreConstants.transactionContextNamespace);

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');
    app.enableCors({
        credentials: true,
        origin: (requestOrigin, callback) => {
            let allowedOrigins: string[];

            switch (Environment[process.env.ENVIRONMENT ?? Environment[Environment.LOCAL]]) {
                case Environment.LOCAL:
                    allowedOrigins = [
                        undefined,
                        "http://localhost:4550",
                        "http://localhost:4551",
                        "http://localhost:4555"
                    ];
                    break;
                case Environment.QA:
                case Environment.PROD:
                    // TODO: Implement
                    allowedOrigins = [];
                    break;
            }

            if (allowedOrigins.includes(requestOrigin)) {
                callback(null, true);
            } else {
                callback(new ForbiddenException(`Origin is invalid: ${requestOrigin}`), false);
            }
        }
    });
    app.use(cookieParser(authConstants.cookie.secret));

    const options = new DocumentBuilder()
        .setTitle('Monorepo API')
        .setDescription('Monorepo API Description')
        .setVersion('1.0')
        .addTag('users')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(4551);
}
bootstrap();
