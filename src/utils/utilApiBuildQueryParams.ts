import { TFilter } from "../hooks";

import { NullUndefinedAble } from "../types";

export const utilApiBuildQueryParams = (filter: NullUndefinedAble<TFilter>) => {
	if (!filter) return "";
	return Object.entries(filter.applied)
		.filter(([_, value]) => Boolean(value))
		.map(([key, value]) => value?.map(item => `${key}=${item.id}`).join("&"))
		.join("&");
};
