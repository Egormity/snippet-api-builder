export const utilUserGetCurrentCoordinates = (): Promise<{
	latitude: number;
	longitude: number;
}> => {
	return new Promise(resolve => {
		// Проверяем поддержку геолокации в браузере
		if (!navigator.geolocation) {
			resolve({ latitude: 0, longitude: 0 });
			return;
		}

		navigator.geolocation.getCurrentPosition(
			position => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
			},
			// В случае любой ошибки возвращаем нули
			() => {
				resolve({ latitude: 0, longitude: 0 });
			},
			{ enableHighAccuracy: true },
		);
	});
};
