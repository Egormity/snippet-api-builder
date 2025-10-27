import { utilLocalStorage } from "./utilLocalStorage";

export const utilReplaceToAuth = () => {
	utilLocalStorage.clear();
	if (window.location.pathname !== "/auth") window.location.replace("/auth");
};
