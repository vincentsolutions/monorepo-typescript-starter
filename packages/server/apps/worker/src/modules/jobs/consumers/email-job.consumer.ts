import {Processor} from "@nestjs/bull";
import {EmailJob, QUEUE_NAMES} from "@server/job";
import {BaseJobConsumer} from "../../core/base/base-job.consumer";
import {Job} from "bull";
import {EmailService} from "@server/core";

@Processor(QUEUE_NAMES.EMAIL)
export class EmailJobConsumer extends BaseJobConsumer<EmailJob> {

    constructor(
        private readonly emailService: EmailService
    ) {
        super();
    }

    async processDefault(job: Job<EmailJob>): Promise<any> {
        if (!this.validateJob(job)) {
            await job.moveToFailed({ message: "Invalid `EmailJob` Parameters" });
            return;
        }

        await job.progress(50);

        const { to, from, subject, content } = job.data;

        await this.emailService.sendEmail(to, subject, content, from);
        return Promise.resolve(true);
    }

    validateJob(job: Job<EmailJob>): boolean {
        return !!job.data.to
            && !!job.data.subject
            && !!job.data.content;
    }
}