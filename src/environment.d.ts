// TypeScript IntelliSense for VITE_ .env variables.
// VITE_ prefixed variables are exposed to the client while non-VITE_ variables aren't
// https://vitejs.dev/guide/env-and-mode.html

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_ENVIRONMENT: "production" | "development";
	readonly VITE_APP_WEB_HOSTNAME: string;
	readonly VITE_APP_ADMIN_HOSTNAME: string;
	readonly VITE_APP_LOCALHOST: "admin" | "web" | "mobile";
	readonly VITE_IS_OFFLINE_DEV: boolean;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
