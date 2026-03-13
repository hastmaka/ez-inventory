export default async function HandleApiError(
    data: string | any
) {
    if (typeof data === 'string') {
        throw new Error(data);
    }

    // If data is a Response object
    if (
        data &&
        typeof data === 'object' &&
        typeof data.status === 'number' &&
        typeof data.json === 'function'
    ) {
        let response: any = undefined;
        try {
            response = await data.json();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            try {
                response = await data.text();
            } catch {
                response = undefined;
            }
        }
        // here we could notify the server and send an email about the error
        // throw {
        //     status: data.status,
        //     url: data.url,
        //     message,
        // };
        // 522 show notification

        // here we sent the user to the server, the server did the logout process (ex: deleted user
        // from redis etc., then return 201 to logout user from firebase as last step)
        if (response?.status === 401) throw response;

        return response
    }
    return data;
}
