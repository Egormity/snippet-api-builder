import { MutationFunction, useMutation, useQueryClient } from "@tanstack/react-query";

export type TUseApiMutationProps<TData = any, TPromiseResponse = any> = {
	mutationKey?: Array<unknown>;
	mutationFn: MutationFunction<TPromiseResponse, TData>;
	onSuccessInvalidateQueryKeys?: Array<Array<string>>;
	onSuccess?: (data: TPromiseResponse, variables: TData, context: unknown) => void;
	onError?: (error: Error, variables: TData, context: unknown) => void;
};

/**
 * @deprecated Use useApiMutationInstead() instead
 */
export const useApiMutation = <TData, TPromiseResponse>({
	mutationKey,
	mutationFn,
	onSuccessInvalidateQueryKeys,
	onSuccess,
	onError,
}: TUseApiMutationProps<TData, TPromiseResponse>) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey,
		mutationFn,
		onSuccess: (data, variables, context) => {
			onSuccessInvalidateQueryKeys?.forEach(keyArr => {
				void queryClient.invalidateQueries({
					queryKey: keyArr,
				});
			});
			onSuccess?.(data, variables, context);
		},
		onError,
	});
};
