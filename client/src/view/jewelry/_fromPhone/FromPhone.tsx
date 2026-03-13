import {Affix, AppShell, Button, Group, Stack} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import Header from "./Header.tsx";
import FormGenerator from "@/components/form/FormGenerator";
import {useLayoutEffect, useMemo, useRef} from "react";
import SelectDescription from "../_share/SelectDescription.tsx";
import EzScroll from "@/ezMantine/scroll/EzScroll.tsx";
import ProductImage from "@/view/jewelry/_share/ProductImage.tsx";
import DescriptionImage from "@/view/jewelry/_share/DescriptionImage.tsx";
import MobileNavbar from "@/view/jewelry/_fromPhone/mobileNavbar.tsx";
import {JewelryModalController} from "@/view/jewelry/_modal/JewelryModalController.ts";
import {getProductFields, getProductSelect} from "../_share/FIELDS.ts";

export default function FromPhone() {
    const {
        formData,
        errors,
        handleInput,
        aiLoading,
        checkRequired,
        aiGetData,
        // aiData,
        handleCancel,
        handleSave,
        isFetching,
        activeDescriptionIndex,
        modal
    } = JewelryModalController
    const tagLength = formData['product']?.product_tag?.length
    const [opened, { toggle }] = useDisclosure();
    const viewportRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        viewportRef.current?.scrollTo({ top: 0 });
    }, []);

    const FIELDS = useMemo(() => getProductFields(tagLength), [tagLength]);
    const SELECT = useMemo(() => getProductSelect(), []);

    async function handleSubmit() {
        if (aiLoading) {
            const goodToGo = checkRequired('product', SELECT)
            if(!goodToGo){
                return window.toast.W('Some fields are required.')
            }
            return aiGetData([...FIELDS, ...SELECT].map(f=> f.name))
        }
        const readyToDb = checkRequired('product', [...FIELDS, ...SELECT])
        if(!readyToDb){
            return window.toast.E('Some fields are required.')
        }
        if (activeDescriptionIndex === null) {
            JewelryModalController.descriptionError = true
            return window.toast.E('Please select one description')
        }
        await window.toast.U({
            modalId: 'no-modal',
            id: {
                title: 'Creating Product',
                message: 'Please wait...',
            },
            update: {
                success: `Product created successfully`,
                error: `Failed to create product`
            },
            cb: handleSave
        })
    }

    function renderBtnText(){
        if (!aiLoading) return 'To Db'
        if (modal.state === 'create') return 'Description'
        if (modal.state === 'editing') return 'Description'
        return null
    }

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 200,
                breakpoint: 'sm',
                collapsed: { desktop: true, mobile: !opened }
            }}
            styles={{
                main: {
                    overflow: "hidden",
                },
                navbar: {
                    borderInlineEnd: undefined,
                },
                header: {
                    display: 'flex',
                }
            }}
        >
            <AppShell.Header>
                <Header toggle={toggle} opened={opened}/>
            </AppShell.Header>

            <AppShell.Navbar p="0 1rem">
                <MobileNavbar/>
            </AppShell.Navbar>

            <AppShell.Main bg='var(--mantine-color-body)' display="flex">
                <EzScroll p={8} h='calc(100dvh - 60px)' flex={1} needPaddingBottom scrollbars="y" viewportRef={viewportRef}>
                    <Stack>
                        <FormGenerator
                            field={SELECT}
                            handleInput={(name: any, value: any, api: any) =>
                                handleInput('product', name, value, api)}
                            structure={[2,1]}
                            formData={formData['product']}
                            errors={errors['product']}
                        />
                        <DescriptionImage/>
                        <ProductImage/>
                        {!aiLoading && <SelectDescription fields={FIELDS}/>}
                    </Stack>
                </EzScroll>
                <Affix
                    position={{ bottom: 0, right: 0 }} w='100%'
                    bg='var(--mantine-color-body)'
                    p='.5rem'
                    zIndex={100}
                >
                    {formData.product?.file_description
                        ? (
                            <Group>
                                <Button flex={1} color='red.7' onClick={handleCancel}>Cancel</Button>
                                <Button
                                    flex={1}
                                    color={!aiLoading ? 'teal.7' : 'blue.7'}
                                    onClick={handleSubmit}
                                    loading={isFetching}
                                >{renderBtnText()}</Button>
                            </Group>
                        )
                        : null
                    }
                </Affix>
            </AppShell.Main>

            {/*<Progress/>*/}
        </AppShell>
    );
}