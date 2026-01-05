declare module 'next-pwa' {
    import { NextConfig } from 'next';

    interface PWAConfig {
        dest?: string;
        disable?: boolean;
        register?: boolean;
        scope?: string;
        sw?: string;
        cacheOnFrontEndNav?: boolean;
        reloadOnOnline?: boolean;
        subdomainPrefix?: string;
        fallbacks?: {
            [key: string]: string;
        };
        cacheStartUrl?: boolean;
        dynamicStartUrl?: boolean;
        dynamicStartUrlRedirect?: string;
        publicExcludes?: string[];
        buildExcludes?: (string | RegExp | ((arg: { asset: { name: string } }) => boolean))[];
        swSrc?: string;
        runtimeCaching?: any[];
        customWorkerDir?: string;
        skipWaiting?: boolean;
    }

    function withPWAInit(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

    export default withPWAInit;
}
