import {useLayoutEffect, useMemo} from 'react';
import {IconCirclePlus, IconHelp, IconMessages, IconSettings}
    from "@tabler/icons-react";
import ThemeButton from "@/theme/ThemeButton.tsx";
import {ThemeController}
    from "@/theme/ThemeController.ts";
import SettingsMenuWithAccess
    from "@/view/layout/mainLayout/header/_menu/SettingsMenu.tsx";
import {companySettings} from "@/static";
import ActionIconsToolTipWithAccess, {type ActionIconItem}
    from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import {Group} from "@mantine/core";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import {LayoutController} from "@/view/layout/LayoutController.ts";
import {LoginController} from "@/view/login/LoginController.ts";
import {JewelryController} from "@/view/jewelry/JewelryController.ts";

function HeaderMenu() {
    const {formData, handleInput, errors} = LayoutController
    const {activeCompanyName, updateUser, user} = LoginController

    const ITEMS: ActionIconItem[] =
        useMemo(() => [
            {
                icon: <IconCirclePlus/>,
            }, {
                icon: <IconHelp/>,
            }, {
                icon: <IconMessages/>,
                tooltip: 'Messages',
                indicator: {
                    label: '2'
                }
            }, {
                // permission: null,
                icon: <SettingsMenuWithAccess
                    target={<IconSettings/>}
                    ITEMS={companySettings}
                    onItemClick={(item: any) => {
                        window.navigate(`app/${item.path}`)
                    }}
                />,
                withMenu: true,
            }, {
                permission: 1,
                icon: <ThemeButton withActionIcon={false}/>,
                onClick: () => ThemeController.toggleTheme(false),
            }
        ], [])

    useLayoutEffect(() => {
        handleInput('company', 'company_company_id', activeCompanyName)
    }, [handleInput, activeCompanyName])

    return (
        <Group>
            {user.user_email === 'cluis132@yahoo.com' && <FormGenerator
                field={[{
                    name: "company_company_id",
                    placeholder: "Select Company",
                    type: "select",
                    fieldProps: {
                        url: 'v1/company',
                        iterator: {label: 'company_name', value: 'company_id'},
                        clearable: false
                    },
                    style: {width: '300px'}
                }]}
                handleInput={async (name: any, value: any) => {
                    // here we update the user company_company_id because the product request depends
                    // on that variable to get the right products
                    handleInput('company', name, value)
                    await window.toast.U({
                        modalId: 'no-modal',
                        id: {
                            title: 'Changing Company',
                            text: 'Please wait...',
                        },
                        update: {
                            success: 'Company change successfully',
                            error: 'Company change failed.',
                        },
                        cb: () => updateUser({[name]: +value})
                    })
                    const isJewelryView = window.location.pathname === "/app/jewelry"
                    if (isJewelryView) {
                        JewelryController.loading = true
                        await JewelryController.fetchData()
                    }
                }}
                structure={[1]}
                formData={formData['company']}
                errors={errors['company']}
            />}
            <ActionIconsToolTipWithAccess
                ITEMS={ITEMS}
                gap={16}
                size={28}
            />
        </Group>
    );
}

export default HeaderMenu;