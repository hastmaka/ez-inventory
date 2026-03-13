import {Checkbox, Flex, Stack, Textarea} from "@mantine/core";
import EzText from "@/ezMantine/text/EzText.tsx";
import type {FormField} from "@/types";
import FormGenerator from "@/components/form/FormGenerator.tsx";
import {JewelryModalController} from "@/view/jewelry/_modal/JewelryModalController.ts";
import {useEffect} from "react";

export default function SelectDescription({
    fields,
    id,
    hideFormFields = false,
}: {
    fields: FormField[];
    id?: number;
    hideFormFields?: boolean;
}) {
    const {
        activeDescriptionIndex,
        setText,
        handleInput,
        formData,
        errors,
        descriptionError
    } = JewelryModalController

    useEffect(() => {
        if(descriptionError) {
            setTimeout(() => JewelryModalController.descriptionError = false, 4000)
        }
    }, [descriptionError])

    function renderDescription() {
        if (!formData?.['product']?.product_description) return null
        return formData?.['product']?.product_description.map((item: string, index: number) =>
            <Checkbox.Card
                key={index}
                // className={classes.root}
                checked={activeDescriptionIndex === index}
                radius="md"
                p={16}
                onClick={() => {
                    JewelryModalController.activeDescriptionIndex = index;
                }}
            >
                <Flex gap={8}>
                    <Checkbox.Indicator/>
                    <Textarea
                        flex={1}
                        autosize
                        // maxRows={6}
                        value={item}
                        onChange={(e) =>
                            setText(e.target.value, index)}
                    />
                </Flex>
            </Checkbox.Card>
        )
    }

    return (
        <Stack>
            {!hideFormFields && (
                <FormGenerator
                    field={fields}
                    handleInput={(name, value, api) =>
                        handleInput('product', name, value, api)}
                    structure={[1,2,3,1]}
                    formData={formData['product']}
                    errors={errors['product']}
                />
            )}

            <Stack gap={0}>
                <Stack gap={0}>
                    <EzText>Descriptions <EzText component='span' c='red.7'>*</EzText></EzText>
                    {!id && (
                        <EzText size='xs' c={descriptionError ? 'red': 'inherit'}>
                            {descriptionError ? 'Please select one description': 'Select a description'}
                        </EzText>
                    )}
                </Stack>
                {id
                    ? (
                        <Textarea
                            flex={1}
                            autosize
                            // maxRows={6}
                            value={formData['product']?.product_description}
                            onChange={(e) => {
                                const value = e.target.value
                                handleInput('product', 'product_description', value)
                            }}
                        />
                    )
                    : renderDescription()
                }
            </Stack>
        </Stack>
    )
}