export enum Environment {
    LOCAL,
    QA,
    PROD
}

export function getCurrEnv(): Environment {
    const envValue = (process.env.ENVIRONMENT ?? process.env.REACT_APP_ENVIRONMENT) as string;

    try {
        return Environment[envValue.toUpperCase()];
    }
    catch (e) {
        throw new Error(`Could not get current environment\n Inner Error Message: ${e.message}`);
    }
}