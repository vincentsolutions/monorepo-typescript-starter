export enum Environment {
    LOCAL,
    QA,
    PROD
}

export function getCurrEnv(): Environment {
    const envValue = process.env.ENVIRONMENT as string;

    try {
        return Environment[envValue.toUpperCase()];
    }
    catch (e) {
        throw new Error(`Could not get current environment\n Inner Error Message: ${e.message}`);
    }
}