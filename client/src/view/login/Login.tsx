import FormGenerator from "@/components/form/FormGenerator.js";
import {Center, Stack, Image} from "@mantine/core";
import {LoginController} from "@/view/login/LoginController.ts";
import EzText from "@/ezMantine/text/EzText.tsx";
import EzButton from "@/ezMantine/button/EzButton.tsx";
// import {ActionIconsToolTip} from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
// import {
//     IconBrandFacebook,
//     IconBrandGoogle,
//     IconBrandTwitter
// } from "@tabler/icons-react";
import ThemeButton from "@/theme/ThemeButton.tsx";
import {useViewportSize} from "@mantine/hooks";
import {ThemeController} from "@/theme/ThemeController.ts";
import {useEnterKeySubmit} from "@/util/hook";
import {useRef} from "react";

// const title: Record<string, string> = {
//     signIn: 'Sign In',
//     forgot: 'Forgot',
//     create: 'Sign Up'
// }

const structure: Record<string, number[]> = {
    signIn: [1, 1],
    forgot: [1],
    create: [2, 1, 1, 1]
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
            // type: 'password',
            required: true
        },
        {
            label: 'Confirm Password',
            name: 'confirmPassword',
            // type: 'password',
            required: true
        },
    ]
}

function Login() {
    const {width} = useViewportSize();
    const btnRef = useRef(null);

    const {
        active,
        loginMessage,
        handleInput,
        handleSignIn,
        formData,
        errors,
        checkRequired,
        loadingBtn
    } = LoginController

    const handleSubmit = () => {
        if (checkRequired('login', fields[active])) {
            handleSignIn(width < 768).then()
        }
    }

    useEnterKeySubmit(btnRef, handleSubmit);

    return (
        <Center h='100dvh' bg='var(--mantine-color-body)' pos='relative'>
            <ThemeButton pos='absolute' top={16} right={16} isLocal={true}/>
            <Stack>
                <Image src={ThemeController.getLogo()} h='auto' w={280}/>
                <Stack p={16} w={300}>
                    <Stack>
                        {/*<EzText align='center'>{title[active]}</EzText>*/}
                        <EzText
                            align='center'
                            size='12px'
                            c={loginMessage.type === 'error' ? 'red' : 'green'}
                        >{loginMessage.msg}</EzText>
                        <FormGenerator
                            field={fields[active]}
                            handleInput={(name, value, api) => {
                                handleInput('login', name, value, api)
                            }}
                            formData={formData!['login']}
                            errors={errors?.['login']}
                            structure={structure[active]}
                        />
                        <EzButton
                            onClick={handleSubmit}
                            loading={loadingBtn}
                            ref={btnRef}
                        >Sign in</EzButton>
                        {/*<Divider labelPosition='center' label='OR'/>*/}
                        {/*<Group justify='center' gap={24}>*/}
                        {/*    <ActionIconsToolTip*/}
                        {/*        ITEMS={[{*/}
                        {/*            tooltip: 'Login with Google',*/}
                        {/*            icon: <IconBrandGoogle/>*/}
                        {/*        }, {*/}
                        {/*            tooltip: 'Login with Facebook',*/}
                        {/*            icon: <IconBrandFacebook/>*/}
                        {/*        }, {*/}
                        {/*            tooltip: 'Login with Twitter',*/}
                        {/*            icon: <IconBrandTwitter/>*/}
                        {/*        }]}*/}
                        {/*    />*/}
                        {/*</Group>*/}
                    </Stack>
                </Stack>
            </Stack>
        </Center>
    );
}

export default Login;