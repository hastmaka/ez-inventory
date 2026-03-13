/**
 * FetchApi.ts
 *
 * A centralized wrapper around the native `fetch` API with added logic for:
 *  - Constructing query strings from objects, arrays, or nested objects.
 *  - Attaching authentication tokens from session storage.
 *  - Encoding/decoding response payloads.
 *  - Handling error codes (401, 403, etc.) with custom logic.
 *
 * @module FetchApi
 */

import type {FetchApiResponse} from "@/types";
import HandleApiError from "@/api/HandleApiError.ts";
import {logoutUser} from "@/api/firebase/FirebaseAuth.ts";
import {auth} from "@/api/firebase/FirebaseConfig.ts";

/**
 * Performs an HTTP request against the backend API.
 *
 * @async
 * @function FetchApi
 * @param {string} endpoint - The endpoint path (e.g., `"v1/users"`).
 *   - If `strict` is `true`, this should be a full URL.
 *   - Otherwise, it will be prefixed with `VITE_REACT_APP_LOCAL_URL`.
 * @param {string} [method='GET'] - The HTTP method to use (`GET`, `POST`, `PUT`, `DELETE`, etc).
 * @param {any} [data] - Optional request body (will be JSON.stringified for non-GET requests).
 * @param {Record<string, any>} [query={}] - Object representing query parameters:
 *   - Arrays will be expanded into multiple params.
 *   - Objects will be stringified.
 *   - Null/undefined values will be skipped.
 * @param {boolean} [strict] - Whether to treat the endpoint as a full URL (no prefix).
 * @returns {Promise<any>} The decoded JSON response. On success, it returns a `FetchApiResponse`
 *   with `.data` and `.auth` already decoded. On failure, it returns the error or triggers logout.
 *
 * @example
 * ```ts
 * // Basic GET
 * const users = await FetchApi("v1/users");
 *
 * // With query params
 * const result = await FetchApi("v1/users", "GET", null, { page: 2, roles: ["admin", "editor"] });
 *
 * // POST with body
 * await FetchApi("v1/users", "POST", { name: "John Doe" });
 *
 * // Full URL (strict mode)
 * await FetchApi("https://api.example.com/data", "GET", null, {}, true);
 * ```
 *
 * @throws Will throw if:
 *  - The network request fails.
 *  - The server returns a non-OK status (unless handled specially for 401/403).
 *  - The response `auth` field cannot be decoded.
 */

export async function FetchApi(
    endpoint: string,
    method: string = 'GET',
    data?: any,
    query: Record<string, any> = {},
    strict?: boolean
): Promise<any> {
    const baseUrl: string = import.meta.env.VITE_REACT_APP_LOCAL_URL;
    // const url = new URL(strict ? endpoint : baseUrl + endpoint);
    const url = strict
        ? new URL(endpoint)
        : new URL(baseUrl + endpoint, window.location.origin);

    const existingParams = Object.fromEntries(url.searchParams.entries());
    const tempQuery = { ...existingParams, ...query };

    const params = new URLSearchParams();

    Object.entries(tempQuery).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (Array.isArray(value) || typeof value === "object") {
            // stringify whole thing
            params.append(key, JSON.stringify(value));
        } else if (value instanceof Date) {
            params.append(key, value.toISOString());
        } else {
            params.append(key, value.toString());
        }
    });

    url.search = params.toString();

    const freshToken = await auth.currentUser?.getIdToken();
    const options: RequestInit = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            ...(endpoint !== 'user/create_user' && {
                'x-access-token': freshToken
            })
        }
    };

    if (method.toUpperCase() !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url.toString(), options);
        if (!response.ok) return await HandleApiError(response)
        const json: FetchApiResponse = await response.json();
        return json;
    } catch (e: any) {
        if (import.meta.env.DEV) {
            debugger
        }
        switch (e.status) {
            case 401:
                if (import.meta.env.DEV) {
                    // debugger
                }
                return await logoutUser()
            default:
                if (import.meta.env.DEV) {
                    // eslint-disable-next-line no-debugger
                    // debugger;
                }
                return window.toast.E('Something went wrong!, contact admin')
        }
    }
}