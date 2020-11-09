import {Injectable} from "@nestjs/common";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {EmailJob} from "./email-job.model";
import {QUEUE_NAMES} from "../../job.constants";
import {IEmailContent} from "@server/core";

@Injectable()
export class EmailJobService {

    constructor(
        @InjectQueue(QUEUE_NAMES.EMAIL) private readonly emailQueue: Queue<EmailJob>
    ) {
    }

    async addSendEmailJob(to: string, subject: string, content: IEmailContent, from?: string) {
        await this.emailQueue.add({
            to,
            from,
            content,
            subject
        });
    }
}