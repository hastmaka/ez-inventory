export type FetchApiResponse = {
    success?: boolean;
    status?: number;
    data?: any;
    auth?: any;
    message?: string;
    [key: string]: any;
}