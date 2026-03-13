import {FetchApi} from './FetchApi.ts';

const EZ_BASE = import.meta.env.VITE_EZ_TRACK_API_URL
    || 'https://eztrack.ryl.digital/api/v1';

const ezFetch = (
    path: string,
    method = 'GET',
    data?: unknown,
    query?: Record<string, unknown>,
) => FetchApi(`${EZ_BASE}/${path}`, method, data, query, true);

// --- Dashboard ---
export const getDashboard = () => ezFetch('dashboard');

// --- Client CRUD ---
export const listClients = (query?: Record<string, unknown>) =>
    ezFetch('client', 'GET', undefined, query);

export const getClient = (id: number) => ezFetch(`client/${id}`);

export const createClient = (data: Record<string, unknown>) =>
    ezFetch('client', 'POST', data);

export const updateClient = (data: Record<string, unknown>) =>
    ezFetch('client', 'PUT', data);

export const deleteClient = (id: number) =>
    ezFetch(`client/${id}`, 'DELETE');

// --- Client Actions ---
export const suspendClient = (id: number) =>
    ezFetch(`client/${id}/suspend`, 'POST');

export const activateClient = (id: number) =>
    ezFetch(`client/${id}/activate`, 'POST');

export const markClientPaid = (id: number) =>
    ezFetch(`client/${id}/mark-paid`, 'POST');

export const enableRecurring = (id: number) =>
    ezFetch(`client/${id}/enable-recurring`, 'POST');

export const disableRecurring = (id: number) =>
    ezFetch(`client/${id}/disable-recurring`, 'POST');

export const sendClientPaymentLink = (id: number) =>
    ezFetch(`client/${id}/send-payment-link`, 'POST');

export const getClientInvoices = (id: number) =>
    ezFetch(`client/${id}/invoices`);

export const getOverdueClients = () => ezFetch('client/overdue');

// --- Invoice CRUD ---
export const listInvoices = (query?: Record<string, unknown>) =>
    ezFetch('invoice', 'GET', undefined, query);

export const getInvoice = (id: number) => ezFetch(`invoice/${id}`);

export const createInvoice = (data: Record<string, unknown>) =>
    ezFetch('invoice', 'POST', data);

export const updateInvoice = (data: Record<string, unknown>) =>
    ezFetch('invoice', 'PUT', data);

export const deleteInvoice = (id: number) =>
    ezFetch(`invoice/${id}`, 'DELETE');

export const sendInvoicePaymentLink = (id: number) =>
    ezFetch(`invoice/${id}/send-payment-link`, 'POST');

// --- Payments ---
export const getSquareActivity = (
    query?: Record<string, unknown>,
) => ezFetch('square/activity', 'GET', undefined, query);

export const listPayments = (query?: Record<string, unknown>) =>
    ezFetch('payment', 'GET', undefined, query);

export const getPaymentSummary = () => ezFetch('payment/summary');

// --- Square ---
export const testSquareConnection = () => ezFetch('square/test');

export const getSquareStatus = () => ezFetch('square/status');

export const syncSquareCustomers = () =>
    ezFetch('square/sync-customers', 'POST');

// --- Admin ---
export const triggerScheduler = (type: 'invoice' | 'payment') =>
    ezFetch('admin/trigger-scheduler', 'POST', {type});

// --- Resources ---
export const getDockerContainers = () =>
    ezFetch('resource/docker-containers');

export const getCaddySites = () => ezFetch('resource/caddy-sites');
