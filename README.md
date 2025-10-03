## Overview

This project provides a comprehensive API layer with built-in authentication, interceptors, query/mutation hooks, and type-safe API builders for React applications using TypeScript.

## Core Features

### 🛡️ Authentication & Interceptors
- **Automatic Token Management**: JWT access tokens automatically attached to requests
- **Token Refresh**: Automatic token refresh on 401 errors with retry logic
- **Request/Response Interceptors**: Handle blob/arrayBuffer conversions and error processing
- **Credential Management**: Secure token storage with localStorage utilities

### 🔄 React Query Integration
- **`useApiQuery`**: For standard GET requests with caching and error handling
- **`useApiInfiniteQuery`**: For paginated data with infinite scrolling
- **`useApiMutation`**: For POST/PUT/PATCH/DELETE operations with automatic cache invalidation

### 🏗️ Type-Safe API Builder
- **`UtilApiBuilder`**: Declarative API definition with full TypeScript support
- **Automatic Hook Generation**: Methods automatically converted to React Query hooks
- **Type Inference**: Full type safety for requests, responses, and parameters

## File Structure

```
api/
├── axiosWithAuth.ts          # Axios instance with auth configuration
├── interceptors.ts           # Request/response interceptors
├── online/                   # Feature-specific API modules
│   ├── api.ts               # Activity API definitions
│   ├── types.ts             # Type definitions
│   └── index.ts
├── hooks/                    # React Query custom hooks
│   ├── useApiQuery.ts
│   ├── useApiInfiniteQuery.ts
│   ├── useApiMutation.ts
│   └── index.ts
└── utils/                    # API utilities
    ├── utilApiBuilder.ts    # Main API builder class
    ├── utilApiUpdateAuthTokens.ts
    └── index.ts
```

## Key Components

### Axios Configuration (`axiosWithAuth.ts`)
```typescript
export const axiosWithAuth: AxiosInstance = axios.create({
  baseURL: CONSTANTS_API.baseUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
```

### Interceptors (`interceptors.ts`)
- **Request Interceptor**: Adds Authorization header with access token
- **Response Interceptors**: 
  - Handle blob/arrayBuffer to JSON conversion for errors
  - Automatic token refresh on 401 errors
  - Request retry logic with configurable limits

### API Builder Pattern (`utilApiBuilder.ts`)

#### Defining APIs
```typescript
export const apiOnlineActivities = new UtilApiBuilder({
  basUrl: "/activities",
  apiName: "apiOnlineActivities",
  methods: {
    getInfinite: {
      type: "useApiInfiniteQuery",
      queryProps: { accessDataName: "activities" },
      paramsDTO: { pageSize: 0, search: "string" },
      responseDTOInfiniteQueryArrayInner: ActivityDTO,
    },
    postOne: {
      type: "useApiMutation",
      queryProps: {
        method: "post",
        successMessage: "Активность создана!",
      },
      mutationDTO: CreateActivityDTO,
      mutationResponseDTO: { data: "string" },
    },
  },
});
```

#### Using Generated Hooks
```typescript
// Query
const { data, isLoading } = apiOnlineActivities.methods.getInfinite.method({
  params: { pageSize: 25 },
});

// Mutation
const mutation = apiOnlineActivities.methods.postOne.method();
mutation.mutate(activityData);
```

### React Query Hooks

#### `useApiQuery`
- Standard data fetching with caching
- Automatic error handling
- Type-safe parameters and responses

#### `useApiInfiniteQuery` 
- Paginated data with infinite scrolling
- Automatic page parameter management
- Flat data accessors

#### `useApiMutation`
- Optimistic updates support
- Automatic cache invalidation
- Success/error handling

## Configuration

### Constants (`constants.api.ts`)
```typescript
export const CONSTANTS_API = {
  baseUrl: "...",
  maxRetries: 3,
  pageSizeInfinite: 25,
  pageSizeMax: 1000,
  // ... other constants
};
```

## Type Safety

The system provides full TypeScript support:

- **Request/Response Types**: Automatically inferred from DTO definitions
- **Parameter Validation**: Type-checked URL parameters and query params
- **Hook Return Types**: Properly typed data, error states, and loading states

## Error Handling

- **Network Errors**: Automatic retry with exponential backoff
- **Authentication Errors**: Automatic token refresh and retry
- **Server Errors**: Structured error parsing and user-friendly messages
- **Offline Support**: Mock data support for development

## Usage Example

```typescript
// Using the generated API
const ActivitiesList = () => {
  const { flatData, isLoading, fetchNextPage } = apiOnlineActivities.methods.getInfinite.method();
  
  const createMutation = apiOnlineActivities.methods.postOne.method();
  
  const handleCreate = (data) => {
    createMutation.mutate(data);
  };
  
  return (
    <div>
      {/* Render activities */}
      <button onClick={() => fetchNextPage()}>Load More</button>
    </div>
  );
};
```

## Development Features

- **Offline Mode**: Mock data support when `isOfflineDev` is enabled
- **Automatic Cache Invalidation**: Smart cache updates after mutations
- **Search & Filter Integration**: Built-in support for search parameters and filters
- **Request Debouncing**: Automatic request optimization

This API layer provides a robust, type-safe foundation for building React applications with excellent developer experience and maintainable code structure.
