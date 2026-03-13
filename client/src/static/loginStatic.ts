const title: Record<string, string> = {
    signIn: 'Sign In',
    forgot: 'Forgot',
    create: 'Sign Up'
}

const structure: Record<string, number[]> = {
    signIn: [1,1],
    forgot: [1],
    create: [2,1,1,1]
}

const fields: Record<string, any> = {
    signIn: [
        {
            label: 'Email',
            name: 'email',
            required: true,
            fieldProps: {
                type: 'email',
            }
        },
        {
            label: 'Password',
            name: 'password',
            required: true,
            fieldProps: {
                type: 'password',
            }
        },
    ],
    forgot: [
        {
            label: 'Email',
            name: 'email',
            type: 'email',
            required: true
        },
    ],
    create: [
        {
            label: 'Name',
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            label: 'Last Name',
            name: 'last_name',
            type: 'text',
            required: true,
        },
        {
            label: 'Email',
            name: 'email',
            type: 'email',
            required: true
        },
        {
            label: 'Password',
            name: 'password',
            type: 'password',
            required: true
        },
        {
            label: 'Confirm Password',
            name: 'confirmPassword',
            type: 'password',
            required: true
        },
    ]
}

export default {
    title, structure, fields
}