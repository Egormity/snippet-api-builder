import { ApiBuilder } from "../API_BUILDER";
import { RecursiveNullable } from "./types.shared";

export type TApiTypesBuilder<T extends ApiBuilder> = {
	[K in keyof T["methods"]]: T["methods"][K]["type"] extends "useApiQuery"
		? RecursiveNullable<
				T["methods"][K]["responseDTO"] extends { data: infer D }
					? D extends Array<infer A>
						? A
						: D
					: T["methods"][K]["responseDTO"] extends Array<infer A>
					? A
					: T["methods"][K]["responseDTO"]
		  >
		: T["methods"][K]["type"] extends "useApiInfiniteQuery"
		? RecursiveNullable<T["methods"][K]["responseDTOInfiniteQueryArrayInner"]>
		: T["methods"][K]["type"] extends "useApiMutation"
		? RecursiveNullable<T["methods"][K]["mutationDTO"]>
		: never;
};
