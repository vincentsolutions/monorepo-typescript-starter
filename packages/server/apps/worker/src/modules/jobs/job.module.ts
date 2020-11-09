import {Module, OnModuleInit} from '@nestjs/common';
import {BullModule, BullModuleOptions, getQueueToken} from "@nestjs/bull";
import {EmailJob, JobLibModule, QUEUE_NAMES} from "@server/job";
import {EmailJobConsumer} from "./consumers/email-job.consumer";
import {Queue} from "bull";
import {setQueues} from "bull-board";
import {ModuleRef} from "@nestjs/core";
import {EmailModule} from "@server/core/modules/email/email.module";

const queueRegistrationOptions: BullModuleOptions[] = [];

for (const key in QUEUE_NAMES) {
    queueRegistrationOptions.push({ name: QUEUE_NAMES[key] });
}

const CONSUMERS = [ EmailJobConsumer ];

@Module({
    imports: [
        JobLibModule,
        BullModule.registerQueue(...queueRegistrationOptions),
        EmailModule
    ],
    controllers: [],
    providers: [
        ...CONSUMERS
    ]
})
export class JobModule implements OnModuleInit {
    constructor(
        private readonly moduleRef: ModuleRef
    ) {

    }

    async onModuleInit() {
        const queues: Queue[] = [];

        for (const key in QUEUE_NAMES) {
            const queueRef = this.moduleRef.get<Queue>(getQueueToken(QUEUE_NAMES[key]), { strict: false });
            queues.push(queueRef);

            const emailQueue = queueRef as Queue<EmailJob>;
            await emailQueue.add({
                content: {
                    html: "<h2>Hello World<h2>"
                },
                subject: "Hello World",
                to: "cvpp@icloud.com",
                from: "john.doe@acme.com"
            })
        }

        setQueues(queues);
    }
}
