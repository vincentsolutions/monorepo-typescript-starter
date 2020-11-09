import { Module } from '@nestjs/common';
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {EmailService} from "./email.service";

const mailerImport = MailerModule.forRoot({
    transport: {
        host: 'localhost',
        port: 25,
        ignoreTLS: true,
        secure: false,
        auth: {
            user: '',
            pass: ''
        }
    },
    defaults: {
        from: '"No Reply" <noreply@monorepo.xyz.com>'
    },
    template: {
        dir: process.cwd() + '/templates/pages',
        adapter: new HandlebarsAdapter(),
        options: {
            strict: true
        }
    },
    options: {
        partials: {
            dir: process.cwd() + '/templates/partials',
            options: {
                strict: true
            }
        }
    }
});

@Module({
    imports: [
        mailerImport
    ],
    providers: [
        EmailService
    ],
    exports: [
        mailerImport,
        EmailService
    ]
})
export class EmailModule {}
