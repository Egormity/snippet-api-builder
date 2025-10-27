import { ApiBuilder } from "../../_API_BUILDER";

export const apiAuth = new ApiBuilder({
	basUrl: "/auth",
	apiName: "apiAuth",
	methods: {
		postConfirmCode: {
			type: "useApiMutation",
			queryProps: {
				url: "/confirm-code",
				method: "post",
				isSuccessMessage: false,
				utilHandleServiceErrorProps: { showToastOnAuthError: true },
			},
			mutationResponseDTO: null,
			urlReplaceParamsDTO: null,
			mutationDTO: {
				tempAuthToken: "string",
				fingerPrint: "string",
				code: 0,
			},
		},
		postLogin: {
			type: "useApiMutation",
			queryProps: {
				url: "/login",
				method: "post",
				isSuccessMessage: false,
				utilHandleServiceErrorProps: { showToastOnAuthError: true },
			},
			urlReplaceParamsDTO: null,
			mutationDTO: {
				userName: "string",
				password: "string",
				fingerPrint: "string",
				endPointId: 1,
			},
			mutationResponseDTO: {
				data: { accessToken: "string", refreshToken: "string" },
				isSuccess: true,
			},
		},
		postLogout: {
			type: "useApiMutation",
			queryProps: {
				url: "/logout",
				method: "post",
				isSuccessMessage: false,
				utilHandleServiceErrorProps: { showToastOnAuthError: true },
			},
			urlReplaceParamsDTO: null,
			mutationResponseDTO: null,
			mutationDTO: {
				refreshToken: "string",
				fingerPrint: "string",
			},
		},
		postRefreshToken: {
			type: "useApiMutation",
			queryProps: {
				url: "/refresh-token",
				method: "post",
				isSuccessMessage: false,
				utilHandleServiceErrorProps: { showToastOnAuthError: true },
			},
			urlReplaceParamsDTO: null,
			mutationResponseDTO: {
				data: {
					success: true,
					data: {
						accessToken: "string",
						refreshToken: "string",
					},
				},
			},
			mutationDTO: {
				refreshToken: "string",
				fingerPrint: "string",
			},
		},
		postResendCode: {
			type: "useApiMutation",
			queryProps: {
				url: "/resend-code",
				method: "post",
				isSuccessMessage: false,
				utilHandleServiceErrorProps: { showToastOnAuthError: true },
			},
			urlReplaceParamsDTO: null,
			mutationResponseDTO: null,
			mutationDTO: {
				tempAuthToken: "string",
				fingerPrint: "string",
			},
		},
		getTest: {
			type: "useApiQuery",
			queryProps: { url: "/test" },
			responseDTO: null,
			paramsDTO: null,
			urlReplaceParamsDTO: null,
		},
	},
});
