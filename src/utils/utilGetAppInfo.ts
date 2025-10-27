function getAppTypeNameFromDomain(hostname?: string): "web" | "admin" {
	const host = hostname || window.location.hostname;

	//
	if (import.meta.env.VITE_APP_LOCALHOST) {
		if (import.meta.env.VITE_APP_LOCALHOST === "admin") return "admin";
		if (import.meta.env.VITE_APP_LOCALHOST === "web") return "web";
	}

	// admin
	if (host == import.meta.env.VITE_APP_ADMIN_HOSTNAME) {
		return "admin";
	}

	// web
	if (host == import.meta.env.VITE_APP_WEB_HOSTNAME) {
		return "web";
	}

	// Not specified
	throw new Error("getAppTypeNameFromDomain: unknown hostname");
}

//
export type TUtilGetAppInfoReturn = {
	fingerPrint: "1" | "3";
	appTypeName: "web" | "admin";
	isAdmin: boolean;
	isWeb: boolean;
	endPointId: 1 | 3;
	appTitle: "AlphaSales" | "Администрирование";
	isOfflineDev: boolean;
};

//
export const utilGetAppInfo = (): TUtilGetAppInfoReturn => {
	const appTypeName = getAppTypeNameFromDomain();
	if (!appTypeName) throw new Error("TUtilGetAppInfoReturn: unknown app mode");
	return {
		fingerPrint: appTypeName === "admin" ? "1" : "3",
		appTypeName,
		isAdmin: appTypeName === "admin",
		isWeb: appTypeName === "web",
		endPointId: appTypeName === "admin" ? 1 : 3,
		appTitle: appTypeName === "admin" ? "Администрирование" : "AlphaSales",
		isOfflineDev: !!import.meta.env.VITE_IS_OFFLINE_DEV,
	};
};
