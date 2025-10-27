import { useParams } from "@tanstack/react-router";

export const useParamsTyped = () => {
	const params: {
		contactId?: string;
		organizationId?: string;
		activityId?: string;
		activeTreeNodeId?: string;
		formId?: string;
		cycleId?: string;
		planId?: string;
		employeeId?: string;
		panelId?: string;
	} = useParams({
		strict: false,
	});

	//
	return params;
};
