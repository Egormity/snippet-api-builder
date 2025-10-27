import {
	IconLibraryActivityRateFormsGray24,
	IconLibraryFormsForClientsGray20,
	IconLibraryMaterials,
	IconLibraryPolls,
} from "@assets";

export const CONSTANTS_LIBRARY: {
	sections: {
		materials: {
			id: "materials";
			sectionRelativePath: "/materials";
			folderTypeId: 1;
			name: "Материалы";
			icon: typeof IconLibraryMaterials | null;
			appTypeName: "all";
		};
		polls: {
			id: "polls";
			sectionRelativePath: "/polls";
			folderTypeId: 2;
			name: "Опросы";
			icon: typeof IconLibraryMaterials | null;
			appTypeName: "all";
		};
		formsForClients: {
			id: "formsForClients";
			sectionRelativePath: "/forms-for-clients";
			folderTypeId: 4;
			name: "Формы для клиентов";
			icon: typeof IconLibraryMaterials | null;
			appTypeName: "admin";
		};
		activityRateForms: {
			id: "activityRateForms";
			sectionRelativePath: "/activity-rate-forms";
			folderTypeId: 5;
			name: "Формы для оценки визитов";
			icon: typeof IconLibraryMaterials | null;
			appTypeName: "admin";
		};
		// pharmacyAssortment: {
		// 	id: "pharmacyAssortment";
		// 	sectionRelativePath: "/pharmacy-assortment";
		// 	folderTypeId: 6;
		// 	name: "Ассортимент аптеки";
		// 	icon: typeof IconLibraryMaterials | null;
		// 	appTypeName: "admin";
		// };
	};
} = {
	sections: {
		materials: {
			id: "materials",
			sectionRelativePath: "/materials",
			folderTypeId: 1,
			name: "Материалы",
			icon: IconLibraryMaterials,
			appTypeName: "all",
		},
		polls: {
			id: "polls",
			sectionRelativePath: "/polls",
			folderTypeId: 2,
			name: "Опросы",
			icon: IconLibraryPolls,
			appTypeName: "all",
		},
		formsForClients: {
			id: "formsForClients",
			sectionRelativePath: "/forms-for-clients",
			folderTypeId: 4,
			name: "Формы для клиентов",
			icon: IconLibraryFormsForClientsGray20,
			appTypeName: "admin",
		},
		activityRateForms: {
			id: "activityRateForms",
			sectionRelativePath: "/activity-rate-forms",
			folderTypeId: 5,
			name: "Формы для оценки визитов",
			icon: IconLibraryActivityRateFormsGray24,
			appTypeName: "admin",
		},
		// pharmacyAssortment: {
		// 	id: "pharmacyAssortment",
		// 	sectionRelativePath: "/pharmacy-assortment",
		// 	folderTypeId: 6,
		// 	name: "Ассортимент аптеки",
		// 	icon: IconLibraryPharmacyAssortment20Gray,
		// 	appTypeName: "admin",
		// },
	},
};
