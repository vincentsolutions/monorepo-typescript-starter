export const QUEUE_NAMES = {
    EMAIL: "email_processing"
}

export const jobConstants = {
    queues: {
        [QUEUE_NAMES.EMAIL]: {
            tasks: [],
            customQueueOptions: undefined
        }
    }
}