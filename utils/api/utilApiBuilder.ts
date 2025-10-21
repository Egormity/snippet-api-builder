import {
	TUseApiInfiniteQueryProps,
	TUseApiMutationNewProps,
	TUseApiQueryProps,
	useApiInfiniteQuery,
	useApiMutationNew,
	useApiQuery,
} from "@hooks";

import { Nullable, RecursiveNullUndefinedPartialAble, RecursiveNullable, TMethodParams } from "@types";

type TMethodInner<TType = any> = TType extends "useApiQuery"
	? {
			type: "useApiQuery";
			queryProps: Nullable<Partial<TUseApiQueryProps>>;
			urlReplaceParamsDTO: Nullable<Record<string, unknown>>;
			paramsDTO: Nullable<TMethodParams>;
			responseDTO: unknown;
	  }
	: TType extends "useApiInfiniteQuery"
	? {
			type: "useApiInfiniteQuery";
			queryProps: Nullable<Partial<TUseApiInfiniteQueryProps>>;
			paramsDTO: Nullable<TMethodParams>;
			responseDTOInfiniteQueryArrayInner: unknown;
	  }
	: TType extends "useApiMutation"
	? {
			type: "useApiMutation";
			queryProps: Nullable<Partial<TUseApiMutationNewProps>>;
			urlReplaceParamsDTO: Nullable<Record<string, unknown>>;
			mutationResponseDTO: Nullable<unknown>;
			mutationDTO: unknown;
	  }
	: never;

type TMethodHook<T extends TMethodInner<unknown>> = T["type"] extends "useApiQuery"
	? (
			queryProps?: Partial<
				TUseApiQueryProps<RecursiveNullable<T["responseDTO"]>, T["paramsDTO"], T["urlReplaceParamsDTO"]>
			>
	  ) => ReturnType<
			typeof useApiQuery<RecursiveNullable<T["responseDTO"]>, T["paramsDTO"], T["urlReplaceParamsDTO"]>
	  >
	: T["type"] extends "useApiInfiniteQuery"
	? (
			queryProps?: Partial<
				TUseApiInfiniteQueryProps<RecursiveNullable<T["responseDTOInfiniteQueryArrayInner"]>, T["paramsDTO"]>
			>
	  ) => ReturnType<
			typeof useApiInfiniteQuery<RecursiveNullable<T["responseDTOInfiniteQueryArrayInner"]>, T["paramsDTO"]>
	  >
	: T["type"] extends "useApiMutation"
	? (
			queryProps?: Partial<
				TUseApiMutationNewProps<
					RecursiveNullUndefinedPartialAble<T["mutationDTO"]>,
					RecursiveNullable<T["mutationResponseDTO"]>,
					T["paramsDTO"],
					T["urlReplaceParamsDTO"]
				>
			>
	  ) => ReturnType<
			typeof useApiMutationNew<
				RecursiveNullUndefinedPartialAble<T["mutationDTO"]>,
				RecursiveNullable<T["mutationResponseDTO"]>,
				T["paramsDTO"],
				T["urlReplaceParamsDTO"]
			>
	  >
	: never;

type TMethodsHashSetItem<TMethod extends TMethodInner<unknown>> = TMethod & {
	method: TMethodHook<TMethod>;
	queryKey: string;
};

type TMethodsRecord = Record<string, TMethodInner>;

type TMethodsHashSet<TMethods extends TMethodsRecord> = {
	[K in keyof TMethods]: TMethodsHashSetItem<TMethods[K]>;
};

export class UtilApiBuilder<
	TMethods extends TMethodsRecord = any,
	TBaseUrl extends string = any,
	TApiName extends string = any
> {
	public readonly basUrl: TBaseUrl;
	public readonly apiName: TApiName;
	public readonly methods: TMethodsHashSet<TMethods> = {} as TMethodsHashSet<TMethods>;

	//
	public constructor({
		basUrl,
		methods,
		apiName,
	}: {
		basUrl: TBaseUrl;
		methods: TMethods;
		apiName: TApiName;
	}) {
		this.basUrl = basUrl;
		this.apiName = apiName;
		Object.entries(methods).forEach(([name, method]) => this.setMethod(name, method));
	}

	//
	private readonly setMethod = (name: keyof TMethods & string, method: TMethodInner) => {
		if (this.methods[name]) throw new Error(`Method "${name}" already exists`);

		// Get the hook
		const methodHook: TMethodsHashSetItem<typeof method, TBaseUrl> = (() => {
			const queryKey = this.apiName + "/" + name;
			switch (method.type) {
				case "useApiQuery":
					return {
						...method,
						method: (queryProps?: Parameters<TMethodHook<typeof method>>[0]) =>
							useApiQuery<ReturnType<TMethodHook<typeof method>>>({
								...method,
								...method.queryProps,
								...queryProps,
								url: this.basUrl + (method.queryProps?.url || ""),
								queryKey: [queryKey, ...(queryProps?.queryKey || [])],
							}),
						queryKey,
					};
				case "useApiInfiniteQuery":
					return {
						...method,
						method: (queryProps?: Parameters<TMethodHook<typeof method>>[0]) =>
							useApiInfiniteQuery<ReturnType<TMethodHook<typeof method>>>({
								...method,
								...method.queryProps,
								...queryProps,
								url: this.basUrl + (method.queryProps?.url || ""),
								queryKey: [queryKey, ...(queryProps?.queryKey || [])],
							}),
						queryKey,
					};
				case "useApiMutation":
					return {
						...method,
						method: (queryProps?: Parameters<TMethodHook<typeof method>>[0]) =>
							useApiMutationNew<ReturnType<TMethodHook<typeof method>>>({
								...method,
								...method.queryProps,
								...queryProps,
								url: this.basUrl + (method.queryProps?.url || ""),
								mutationKey: [queryKey, ...(queryProps?.mutationKey || [])],
								onSuccessInvalidateQueryKeys: [
									...(method.queryProps?.onSuccessInvalidateQueryKeys || []),
									...(queryProps?.onSuccessInvalidateQueryKeys || []),
								],
							}),
						queryKey,
					};
				default:
					throw new Error("Unknown method type");
			}
		})();

		// Set the method
		this.methods[name] = methodHook;
	};
}
