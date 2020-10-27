import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import qs from 'qs';
import {injectable} from "inversify";
import {container} from "../internal";

@injectable()
export class ApiClient {
    protected _axiosInstance: AxiosInstance;

    constructor(axiosConfig: AxiosRequestConfig = {}) {
        this._axiosInstance = axios.create({
            baseURL: 'http://localhost:4551/api/v1',
            withCredentials: true,
            ...axiosConfig
        });
    }

    get<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        let paramsConfig: Partial<AxiosRequestConfig> = {};

        if (data) {
            paramsConfig = {
                params: data,
                paramsSerializer: params => qs.stringify(params)
            };
        }

        return this._axiosInstance.get<TResult>(url, {
            ...axiosConfig,
            ...paramsConfig
        }).then(result => result.data);
    };

    post<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        return this._axiosInstance.post<TResult>(url, data, axiosConfig).then(result => result.data);
    };

    put<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        return this._axiosInstance.put<TResult>(url, data, axiosConfig).then(result => result.data);
    };

    patch<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        return this._axiosInstance.patch<TResult>(url, data, axiosConfig).then(result => result.data);
    };

    delete<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        let paramsConfig: Partial<AxiosRequestConfig> = {};

        if (data) {
            paramsConfig = {
                params: data,
                paramsSerializer: params => qs.stringify(params)
            };
        }

        return this._axiosInstance.delete<TResult>(url, {
            ...axiosConfig,
            ...paramsConfig
        }).then(result => result.data);
    };

    head<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        let paramsConfig: Partial<AxiosRequestConfig> = {};

        if (data) {
            paramsConfig = {
                params: data,
                paramsSerializer: params => qs.stringify(params)
            };
        }

        return this._axiosInstance.head<TResult>(url, {
            ...axiosConfig,
            ...paramsConfig
        }).then(result => result.data);
    };

    options<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        let paramsConfig: Partial<AxiosRequestConfig> = {};

        if (data) {
            paramsConfig = {
                params: data,
                paramsSerializer: params => qs.stringify(params)
            };
        }

        return this._axiosInstance.options<TResult>(url, {
            ...axiosConfig,
            ...paramsConfig
        }).then(result => result.data);
    };

    addDefaultHeaders(headers: Record<string, any>) {
        for (const key of Object.keys(this._axiosInstance.defaults.headers)) {
            this._axiosInstance.defaults.headers[key] = {
                ...this._axiosInstance.defaults.headers[key],
                ...headers
            };
        }
    }
}

container.bind(ApiClient).toSelf().inSingletonScope();