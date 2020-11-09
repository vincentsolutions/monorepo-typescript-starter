import {BaseJob} from "../../core/base/base-job.model";
import {IEmailContent} from "@server/core";
import {Address} from "nodemailer/lib/mailer";

export class EmailJob extends BaseJob {
    public readonly to: string | Address | Array<string | Address>;
    public readonly from?: string;
    public readonly subject: string;
    public readonly content: IEmailContent;
}