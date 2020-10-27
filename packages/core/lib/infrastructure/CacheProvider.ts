import Cache from '@aws-amplify/cache';
import { CacheItemOptions as DefaultCacheItemOptions } from '@aws-amplify/cache/src/types/Cache'

export interface CacheItemOptions<Tvalue> extends DefaultCacheItemOptions {

}

export class CacheProvider {
    public static KEYS = {

    };

    public static setItem<TValue = any>(key: string, value: TValue, options?: CacheItemOptions<TValue>) {
        return Cache.setItem(key, value, options);
    }

    public static getItem<TValue>(key: string, options?: CacheItemOptions<TValue>) {
        return Cache.getItem(key, options);
    }

    public static removeItem(key: string) {
        return Cache.removeItem(key);
    }

    public static clear() {
        return Cache.clear();
    }

    public static getAllKeys() {
        return Cache.getAllKeys();
    }

    public static getCacheCurSize() {
        return Cache.getCacheCurSize();
    }
}