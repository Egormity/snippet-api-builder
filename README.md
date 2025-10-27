# Snippet API Builder

A comprehensive TypeScript-based API client builder for React applications that provides type-safe API interactions with built-in authentication, error handling, and React Query integration.

## Features

- 🛠 **Type-Safe API Definitions** - Full TypeScript support with automatic type inference
- 🔄 **React Query Integration** - Built-in support for `useQuery`, `useInfiniteQuery`, and `useMutation`
- 🔐 **Authentication Flow** - Automatic token refresh and request interception
- 🎯 **Multiple Hook Types** - Support for queries, infinite queries, and mutations
- 📝 **Error Handling** - Comprehensive error handling with toast notifications
- 🏗 **Builder Pattern** - Clean, declarative API definition
- 🔄 **Auto-Invalidation** - Smart cache invalidation on mutations
- 📱 **Offline Support** - Mock data support for development

## Installation

```bash
npm install axios @tanstack/react-query
```

## Quick Start

### 1. Define Your API

```typescript
import { ApiBuilder } from "./_API_BUILDER";

export const apiActivities = new ApiBuilder({
	basUrl: "/activities",
	apiName: "apiActivities",
	methods: {
		// Query example
		getActivity: {
			type: "useApiQuery",
			queryProps: { accessDataName: "activities" },
			paramsDTO: { id: "string" },
			responseDTO: {
				id: "string",
				name: "string",
				startDatePlan: "string",
			},
		},

		// Infinite query example
		getInfiniteActivities: {
			type: "useApiInfiniteQuery",
			queryProps: { accessDataName: "activities" },
			paramsDTO: { pageSize: 0, search: "string" },
			responseDTOInfiniteQueryArrayInner: {
				id: "string",
				name: "string",
				activityStatusId: 1,
			},
		},

		// Mutation example
		createActivity: {
			type: "useApiMutation",
			queryProps: {
				method: "post",
				successMessage: "Activity created!",
			},
			mutationDTO: {
				name: "string",
				startDatePlan: "string",
			},
			mutationResponseDTO: { data: "string" },
		},
	},
});
```

### 2. Use in Components

```typescript
import { apiActivities } from "./api";

function ActivitiesList() {
	// Use query
	const { data, isLoading } = apiActivities.methods.getActivity.method({
		queryKey: ["activity", id],
		params: { id: "123" },
	});

	// Use infinite query
	const { data, fetchNextPage } = apiActivities.methods.getInfiniteActivities.method();

	// Use mutation
	const mutation = apiActivities.methods.createActivity.method({
		onSuccess: () => {
			// Handle success
		},
	});

	const handleCreate = () => {
		mutation.mutate({
			METHOD_DATA: {
				name: "New Activity",
				startDatePlan: new Date().toISOString(),
			},
		});
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<div>
			{/* Render data */}
			<button onClick={handleCreate}>Create Activity</button>
		</div>
	);
}
```

## API Builder Configuration

### Query Methods

#### `useApiQuery`

For standard data fetching:

```typescript
getActivity: {
  type: "useApiQuery",
  queryProps: {
    url: "/:id", // Optional URL override
    accessDataName: "activities",
  },
  paramsDTO: {
    id: "string",
    search: "string"
  },
  urlReplaceParamsDTO: { id: "string" },
  responseDTO: ActivityDTO,
}
```

#### `useApiInfiniteQuery`

For paginated data:

```typescript
getInfiniteActivities: {
  type: "useApiInfiniteQuery",
  queryProps: { accessDataName: "activities" },
  paramsDTO: {
    pageSize: 0,
    search: "string"
  },
  responseDTOInfiniteQueryArrayInner: ActivityItemDTO,
}
```

#### `useApiMutation`

For create, update, delete operations:

```typescript
createActivity: {
  type: "useApiMutation",
  queryProps: {
    method: "post",
    successMessage: "Activity created!",
    onSuccessInvalidateQueryKeys: [["apiActivities/getInfinite"]],
  },
  urlReplaceParamsDTO: null,
  mutationDTO: CreateActivityDTO,
  mutationResponseDTO: CreateActivityResponseDTO,
}
```

## Authentication & Interceptors

The library includes built-in authentication handling:

### Request Interceptor

- Automatically adds Bearer token to requests
- Handles token refresh on 401 responses
- Manages retry logic with configurable limits

### Response Interceptor

- Handles blob and arrayBuffer response conversions
- Automatic token refresh on authentication failures
- Error handling with user-friendly messages

## Error Handling

```typescript
// Custom error handling
const { error } = apiActivities.methods.getActivity.method({
	utilHandleServiceErrorProps: {
		baseErrorMessage: "Failed to load activity",
		isToast: true,
	},
});
```

## Type Safety

The library provides full TypeScript support:

```typescript
// Get types from your API
import type { TapiActivities } from "./types";

type Activity = TapiActivities["getActivity"];
type CreateActivityDTO = TapiActivities["createActivity"];
```

## Utility Functions

### Convert DTO to Default Values

```typescript
import { utilApiConvertDTOToDefaultValues } from "./utils";

const defaultValues = utilApiConvertDTOToDefaultValues(activityDTO);
```

### Build Query Parameters

```typescript
import { utilApiBuildQueryParams } from "./utils";

const queryString = utilApiBuildQueryParams(filters);
```

## Configuration Constants

```typescript
// constants.ts
export const CONSTANTS_API = {
	baseUrl: "https://api.example.com",
	pageSizeInfinite: 25,
	pageSizeMax: 1000,
	maxRetries: 3,
};
```

## File Structure

```
src/
├── API_BUILDER.ts          # Main builder class
├── api/                    # API definitions
│   ├── activities.ts
│   └── index.ts
├── hooks/                  # React Query hooks
│   ├── useApiQuery.ts
│   ├── useApiInfiniteQuery.ts
│   ├── useApiMutation.ts
│   └── index.ts
├── types/                  # TypeScript definitions
│   ├── types.apiBuilder.ts
│   ├── types.app.ts
│   ├── types.shared.ts
│   └── index.ts
├── apiBase/                # Axios configuration
│   ├── axiosWithAuth.ts
│   ├── interceptors.ts
│   └── index.ts
└── utils/                  # Utility functions
    ├── utilApiBuildQueryParams.ts
    ├── utilApiConvertDTOToDefaultValue.ts
    ├── utilApiHandleError.ts
    ├── utilApiUpdateAuthTokens.ts
    └── index.ts
```

## Best Practices

1. **Define DTOs separately** for better reusability
2. **Use descriptive method names** that reflect the operation
3. **Group related endpoints** in the same API builder
4. **Handle loading states** in your components
5. **Use TypeScript strictly** to catch errors at compile time

## Contributing

Please read the contributing guidelines before submitting pull requests.

## License

MIT License - see LICENSE file for details.
