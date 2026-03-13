import { auth } from '../config/firebase';

const BASE_URL = 'https://api.pancho.ngrok.io/api/';

export async function fetchApi(
  endpoint: string,
  method: string = 'GET',
  data?: unknown,
  query: Record<string, unknown> = {},
): Promise<any> {
  const url = new URL(BASE_URL + endpoint);

  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value) || typeof value === 'object') {
      url.searchParams.append(key, JSON.stringify(value));
    } else {
      url.searchParams.append(key, String(value));
    }
  });

  const freshToken = await auth.currentUser?.getIdToken();
  const options: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      ...(freshToken && { 'x-access-token': freshToken }),
    },
  };

  if (method.toUpperCase() !== 'GET' && data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url.toString(), options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}
