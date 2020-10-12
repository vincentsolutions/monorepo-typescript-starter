import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import qs from 'qs';

export class ApiClient {
    protected _axiosInstance: AxiosInstance;

    constructor(axiosConfig: AxiosRequestConfig = {}) {
        this._axiosInstance = axios.create(axiosConfig);
    }

    get<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        let paramsConfig: Partial<AxiosRequestConfig> = {};

        if (data) {
            paramsConfig = {
                params: data,
                paramsSerializer: params => qs.stringify(params)
            };
        }

        return this._axiosInstance.get<TResult, TResult>(url, {
            ...axiosConfig,
            ...paramsConfig
        });
    };

    post<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        return this._axiosInstance.post<TResult, TResult>(url, data, axiosConfig);
    };

    put<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        return this._axiosInstance.put<TResult, TResult>(url, data, axiosConfig);
    };

    patch<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        return this._axiosInstance.patch<TResult, TResult>(url, data, axiosConfig);
    };

    delete<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        let paramsConfig: Partial<AxiosRequestConfig> = {};

        if (data) {
            paramsConfig = {
                params: data,
                paramsSerializer: params => qs.stringify(params)
            };
        }

        return this._axiosInstance.delete<TResult, TResult>(url, {
            ...axiosConfig,
            ...paramsConfig
        });
    };

    head<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        let paramsConfig: Partial<AxiosRequestConfig> = {};

        if (data) {
            paramsConfig = {
                params: data,
                paramsSerializer: params => qs.stringify(params)
            };
        }

        return this._axiosInstance.head<TResult, TResult>(url, {
            ...axiosConfig,
            ...paramsConfig
        });
    };

    options<TResult = any, T = undefined>(url: string, data?: T, axiosConfig?: AxiosRequestConfig) {
        let paramsConfig: Partial<AxiosRequestConfig> = {};

        if (data) {
            paramsConfig = {
                params: data,
                paramsSerializer: params => qs.stringify(params)
            };
        }

        return this._axiosInstance.options<TResult, TResult>(url, {
            ...axiosConfig,
            ...paramsConfig
        });
    };

}