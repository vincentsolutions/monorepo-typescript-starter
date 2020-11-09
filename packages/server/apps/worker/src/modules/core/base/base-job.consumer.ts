import {BaseJob} from "@server/job";
import {Job} from "bull";
import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueError,
    OnQueueFailed,
    OnQueuePaused,
    OnQueueProgress, OnQueueResumed, OnQueueWaiting, Process
} from "@nestjs/bull";
import {Inject} from "@nestjs/common";
import {Logger} from "@server/core";
import * as moment from "moment";

export abstract class BaseJobConsumer<TJob extends BaseJob> {
    @Inject() protected readonly logger: Logger;

    public abstract async processDefault(job: Job<TJob>): Promise<any>;

    @Process()
    private async _processDefault(job: Job<TJob>) {
        job.progress();

        return this.wrapProcess(job, async () => await this.processDefault(job));
    }

    protected async wrapProcess(job: Job<TJob>, action: (job: Job<TJob>) => Promise<any>) {
        try {
            const result = await action(job);
            await job.progress(100);

            return result;
        } catch (e) {
            this.logger.error(`[UnhandledJobException] ${e.message}`);
            await job.moveToFailed(e);
        }
    }

    @OnQueueWaiting()
    onWaiting(jobId: number | string) {
        this.logger.log(`[${this.constructor.name}] Job Processing - WAITING #${jobId} @ ${moment().format('ll HH:mm:ss.SSS')}`);
        console.log('job processing');
    }

    @OnQueueActive()
    onActive(job: Job<TJob>) {
        this.logger.log(`[${this.constructor.name}] Job Processing - ACTIVE (${job.name}) #${job.id} Started @ ${moment().format('ll HH:mm:ss.SSS')}`)
    }

    @OnQueueProgress()
    onProgress(job: Job<TJob>, progress: number) {
        this.logger.log(`[${this.constructor.name}] Job Processing - PROGRESS -> ${progress}%: (${job.name}) #${job.id} @ ${moment().format('ll HH:mm:ss.SSS')}`)
    }

    @OnQueueCompleted()
    onCompleted(job: Job<TJob>, result: any) {
        this.logger.log(`[${this.constructor.name}] Job Processing - COMPLETED (${job.name}) #${job.id} Ended @ ${moment().format('ll HH:mm:ss.SSS')}`)
    }

    @OnQueueFailed()
    onFailed(job: Job<TJob>, error: Error) {
        this.logger.log(`[${this.constructor.name}] Job Processing - FAILED (${job.name}) #${job.id} Ended @ ${moment().format('ll HH:mm:ss.SSS')}`);
        this.logger.log(`Error Details: ${error.message}`);
    }

    @OnQueueError()
    onError(error: Error) {
        this.logger.error(`Error Details: ${error.message}`);
    }

    @OnQueuePaused()
    onPaused() {
        this.logger.log(`[${Object.getPrototypeOf(this).constructor.name}] Job Processing Paused @ ${moment().format('ll HH:mm:ss.SSS')}`);
    }

    @OnQueueResumed()
    onResumed(job: Job<TJob>) {
        this.logger.log(`[${Object.getPrototypeOf(this).constructor.name}] Job Processing Resumed @ ${moment().format('ll HH:mm:ss.SSS')} with Job #${job.id}`);
    }
}