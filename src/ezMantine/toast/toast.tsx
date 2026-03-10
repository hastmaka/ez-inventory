import {notifications} from "@mantine/notifications";
import {IconCheck, IconX} from "@tabler/icons-react";
import {rem} from "@mantine/core";
import _ from "lodash";
// import {ezAwait} from "@/util";

const checkPropsObj = (props: object) => {
    if (!_.isObject(props)) throw new Error('No props was provided or it was not an object');
}

const checkPropsString = (props: string) => {
    if (!_.isString(props)) throw new Error('No props was provided or it was not a string');
}

export default function toast(props: object) {
    checkPropsObj(props);
    notifications.show({
        message: '',
        title: 'No title was provided',
        autoClose: 4000,
        ...props
    })
}

toast.W = function(props: string) {
    checkPropsString(props);
    toast({color: 'var(--mantine-color-yellow-6)',title: 'Warning',message: props})
}

toast.S = function(props: string) {
    checkPropsString(props);
    toast({color: 'var(--mantine-color-teal-4)',title: 'Success',message: props})
}

toast.E = function(props: string) {
    checkPropsString(props);
    toast({color: 'var(--mantine-color-red-8)',title: 'Error',message: props})
}

/**
 * @param modalId - reference to modal to trigger loading state
 * @param {id} object - first notification params
 * @param {update} object - optional if you want a custom message, otherwise throw new Error, and it will be caught
 * in the try and catch in error param
 * @param {cb} function
 * to close the modal after operation use closeModal(modalId)
 * @param {autoClose: false} - in case you want the notification does not auto close
 * @returns {Promise<void>}
 * @example
 * await toast.U({
 *     modalId: '',
 *     id: {
 *         title: 'Test',
 *         message: 'This is a test',
 *     },
 *     update: {
 *         title: 'Message to update the title',
 *         success: 'Message to show in case of success',
 *         error: 'Message to show in case of error',
 *     },
 *     cb: function to execute
 * })
 */

interface ToastU {
    id: {
        title?: string,
        message?: string
    },
    update?: {
        title?: string,
        success?: string,
        error?: string
    },
    cb: () => Promise<void>,
    modalId?: string,
    autoClose?: boolean
}

toast.U = async function ({id, update, cb, modalId, autoClose}: ToastU) {
    if (!modalId && import.meta.env.DEV) {
        console.warn("No modalId was provided or it was not a string");
    }
    if (!id || typeof id !== 'object') throw new Error('No id was provided or it was not an object');
    if (!cb || typeof cb !== 'function') throw new Error('No callback function was provided or it was not a function');
    // Show the initial loading notification
    const _id = notifications.show({
        loading: true,
        color: 'blue',
        title: 'id.title no provided',
        message: 'id.message not provided',
        autoClose: autoClose ?? 5000,
        withCloseButton: autoClose ?? false,
        ...id
    });

    try {
        // window.modalIsLoading('test')
        if (modalId) window.modalIsLoading(modalId)
        // await ezAwait()
        // Wait for the callback function to complete
        await cb()
        if (modalId) window.modalIsDone(modalId)
        // Update the notification to show success
        notifications.update({
            id: _id,
            color: 'teal',
            title: update?.title || 'Success',
            message: update?.success || 'No success message was provided in toast',
            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
            loading: false,
            withCloseButton: true,
            autoClose: autoClose ?? 5000
        });
        return {success: true};
    } catch (error) {
        if (modalId) window.modalIsDone(modalId)
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        // Update the notification to show failure
        notifications.update({
            id: _id,
            color: 'red',
            title: 'Error',
            message: (error as Error)?.message || update?.error || 'No error message was provided in toast',
            icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
            loading: false,
            withCloseButton: true,
            autoClose: autoClose ?? 5000
        });

        return error
    }
}

/**
 * We use this when is a task that takes a long time to complete, then receive an emit event
 * and get the data from the server, in the controller we have a socket.on('event', (data) => {})
 * @param id - string
 * @param rest - object
 * */

toast.Progress = function ({id, ...rest}: {id: string, message: string, [key: string]: any}) {
    if (!id) throw new Error('No id was provided or it is not a string');
    notifications.show({
        id,
        loading: true,
        withCloseButton: false,
        autoClose: false,
        ...rest
    })
}

toast.close = function (id: string) {
    notifications.hide(id)
}