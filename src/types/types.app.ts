import { Nullable } from "./types.shared";

export type TAppSearchParams = {
	isWide?: boolean;
	plannerCalendarType?: "month" | "week" | "day";
	hideWeekends?: boolean;
	referenceDate?: string | Date | null;
	createStartDate?: Nullable<string | Date>;
	createEndDate?: Nullable<string | Date>;
	isCollapsedLeft?: boolean;
	isCollapsedRight?: boolean;
	sidebarAlphabeticType?: "contacts" | "organizations";
	isTextTranslate?: boolean;
	isSearching?: boolean;
	search?: Nullable<string>;
	selectedActivities?: Nullable<
		Array<{
			id: Nullable<string>;
			name: Nullable<string>;
			activityStatusId: Nullable<number>;
			startDatePlan: Nullable<string>;
			endDatePlan: Nullable<string>;
			splittedStartDate: Nullable<string>;
			splittedEndDate: Nullable<string>;
			utcDiff: Nullable<number>;
			isReferenceDragging?: boolean;
		}>
	>;
	createContactInstitutionData?: Nullable<{
		id: Nullable<string>;
		name: Nullable<string>;
		addressStreet: Nullable<string>;
	}>;
	fromContactId?: Nullable<string>;
	fromOrganizationId?: Nullable<string>;
	activeLetter?: Nullable<string>;
	isSearchingSecond?: boolean;
	searchSecond?: Nullable<string>;
	isDragEndErrorCreateFromOutside?: boolean;
	createdFormId?: Nullable<string>;
	isCollapsedLeftSections?: boolean;
};

export type TAppSearchParamsWithDefaultValues = Required<TAppSearchParams>;
