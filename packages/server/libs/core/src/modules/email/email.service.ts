import {Injectable} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";
import {ISendMailOptions} from "@nestjs-modules/mailer";
import {Address, Attachment} from "nodemailer/lib/mailer";

@Injectable()
export class EmailService {

    constructor(
        private readonly mailerService: MailerService
    ) {
    }

    public async sendEmail(
        to: string | Address | Array<string | Address>,
        subject: string,
        content: IEmailContent,
        from?: string,
        attachments?: Attachment[],
        additionalMailOptions: Omit<ISendMailOptions, "to" | "from" | "subject" | "text" | "html" | "template" | "context"> = {}
    ) {
        let contentProps: Partial<ISendMailOptions> = {};

        if (content.plainText) {
            contentProps = {
                text: content.plainText
            };
        } else if (content.html) {
            contentProps = {
                html: content.html
            };
        } else if (content.template) {
            contentProps = {
                template: __dirname + content.template.path,
                context: content.template.context
            };
        }

        return await this.mailerService.sendMail({
            ...additionalMailOptions,
            to,
            from,
            subject,
            ...contentProps,
            attachments: attachments as any
        })
    }
}

export interface IEmailContent {
    plainText?: string;
    html?: string;
    template?: {
        path: string;
        context: object;
    }
}