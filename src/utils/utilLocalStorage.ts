export type TUtilLocalStorage = {
	ACCESS_TOKEN: string | null | undefined;
	REFRESH_TOKEN: string | null | undefined;
};

//
export const utilLocalStorage = {
	getItem: <T extends keyof TUtilLocalStorage>(key: T): TUtilLocalStorage[T] => {
		try {
			return JSON.parse(localStorage.getItem(key) || "") as TUtilLocalStorage[T];
		} catch {
			return null;
		}
	},
	setItem: <T extends keyof TUtilLocalStorage>(key: T, value: TUtilLocalStorage[T]): void => {
		localStorage.setItem(key, JSON.stringify(value));
	},
	removeItem: (key: keyof TUtilLocalStorage): void => {
		localStorage.removeItem(key);
	},
	clear: (): void => {
		localStorage.clear();
	},
};
