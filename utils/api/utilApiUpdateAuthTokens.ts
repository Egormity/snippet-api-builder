import { apiAuthAuth, axiosWithAuth } from "@api";

import { utilGetAppInfo, utilLocalStorage, utilReplaceToAuth } from "@utils";

let refreshTokenPromise: Promise<
	typeof apiAuthAuth.methods.postRefreshToken.mutationResponseDTO.data.data | null
> | null = null;

export const utilApiUpdateAuthTokens = () => {
	if (utilGetAppInfo().isOfflineDev) {
		utilLocalStorage.setItem("ACCESS_TOKEN", "offline");
		utilLocalStorage.setItem("REFRESH_TOKEN", "offline");
		return { accessToken: "offline", refreshToken: "offline" };
	}

	// Если обновление уже запущено — ждём его завершения
	if (!refreshTokenPromise)
		// Создаем новый промис обновления токена
		refreshTokenPromise = axiosWithAuth<
			any,
			typeof apiAuthAuth.methods.postRefreshToken.mutationResponseDTO
		>({
			url: "/auth/refresh-token",
			method: "POST",
			data: { ...utilGetAppInfo() },
		})
			.then(response => {
				const data = response?.data?.data;
				if (!data) throw new Error("Refresh response не содержит accessToken");
				utilLocalStorage.setItem("ACCESS_TOKEN", data.accessToken);
				utilLocalStorage.setItem("REFRESH_TOKEN", data.refreshToken);
				return data;
			})
			.catch(() => {
				utilReplaceToAuth();
				return null;
			})
			.finally(() => (refreshTokenPromise = null));

	//
	return refreshTokenPromise;
};
