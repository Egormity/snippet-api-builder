import { useSearch } from "@tanstack/react-router";
import { startOfDay } from "date-fns";

import { TAppSearchParams, TAppSearchParamsWithDefaultValues } from "../types";

export const useSearchTypedWithDefaultValues = (): TAppSearchParamsWithDefaultValues => {
	const {
		isWide = false,
		plannerCalendarType = "week",
		hideWeekends = false,
		referenceDate = startOfDay(new Date()),
		createEndDate = null,
		createStartDate = null,
		isCollapsedLeft = false,
		isCollapsedRight = false,
		sidebarAlphabeticType = "contacts",
		isTextTranslate = false,
		isSearching = false,
		search = null,
		selectedActivities = null,
		activeLetter = null,
		createContactInstitutionData = null,
		fromContactId = null,
		fromOrganizationId = null,
		isSearchingSecond = false,
		searchSecond = null,
		isDragEndErrorCreateFromOutside = false,
		createdFormId = null,
		isCollapsedLeftSections = false,
	}: TAppSearchParams = useSearch({
		strict: false,
	});

	//
	return {
		isWide,
		plannerCalendarType,
		hideWeekends,
		referenceDate,
		createEndDate,
		createStartDate,
		isCollapsedLeft,
		isCollapsedRight,
		sidebarAlphabeticType,
		isTextTranslate,
		isSearching,
		search,
		selectedActivities,
		activeLetter,
		createContactInstitutionData,
		fromContactId,
		fromOrganizationId,
		isSearchingSecond,
		searchSecond,
		isDragEndErrorCreateFromOutside,
		createdFormId,
		isCollapsedLeftSections,
	};
};
