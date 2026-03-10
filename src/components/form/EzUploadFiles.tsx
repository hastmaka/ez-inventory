import {Dropzone, type FileRejection, IMAGE_MIME_TYPE, MIME_TYPES} from "@mantine/dropzone";
import classes from "@/view/client/clientView/document/_modal/AddDocumentModal.module.scss";
import {Card, Flex, Group, Image, Stack, Text} from "@mantine/core";
import {IconCloudUpload, IconCrop, IconDownload, IconX} from "@tabler/icons-react";
import {ActionIconsToolTip} from "@/ezMantine/actionIconTooltip/ActionIconsToolTip.tsx";
import {lazy, Suspense, useEffect, useState} from "react";
import _ from "lodash";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";
import EzText from "@/ezMantine/text/EzText.tsx";
import NoImage from "@/components/NoImage.tsx";
// dynamic imports
const EzCropImageTool =
    lazy(() => import('@/ezMantine/cropImageTool/EzCropImageTool.tsx'))

type EzUploadFilesProps = {
    uploadedFiles: (file: File[]) => void,
    maxSize?: number,
    cancel: () => void,
    multiple?: boolean,
    [key: string]: any,
};

function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} Kb`;
    } else {
        return `${(bytes / (1024 * 1024)).toFixed(0)}Mb`;
    }
}

function renderError(data: string[]) {
    const text = data.join(", ") + ` ${data.length === 1 ? 'file is' : 'files are'} too large`;
    return <EzText c='red.8'>{text}</EzText>;
}

function EzUploadFiles({
    uploadedFiles,
    maxSize = 30, // last digit is for Mbs
    cancel,
    multiple,
    ...rest
}: EzUploadFilesProps) {
    const _maxSize = 1024 * 1024 * maxSize;
    const [data, setData] = useState<File[]>([]);
    const [error, setError] = useState<string[]>([]);

    useEffect(() => {
        setTimeout(() => {setError([])}, 10000)
    }, [error.length])

    function handleCropImage(file: File){
        const modalId = 'crop-image-modal';
        window.openModal({
            modalId,
            title: 'Crop Image',
            fullScreen: true,
            children: (
                <Suspense>
                    <EzCropImageTool
                        file={file}
                        handleCropAndSave={(croppedFile: File) => {
                            const indexToUpdate = data.findIndex(f => f.name === file.name);
                            if (indexToUpdate !== -1) {
                                setData(prevData => {
                                    const newData = [...prevData];
                                    newData[indexToUpdate] = croppedFile;
                                    return newData;
                                });
                            }
                            window.closeModal(modalId)
                        }}
                    />
                </Suspense>
            ),
            onClose: () => {}
        })
    }

    return (
        <Stack>
            <Dropzone
                onDrop={(files: File[]) => {
                    if (!multiple) return setData(files)
                    // check if the file was already added
                    const tempFiles: File[] = [];
                    _.map(files, (file: File) => {
                        const index = data.findIndex((f: File) => f.name === file.name);
                        if (index === -1) {
                            tempFiles.push(file);
                        }
                    })
                    setData(prev => [...prev, ...tempFiles])
                }}
                className={classes.dropzone}
                accept={[...IMAGE_MIME_TYPE, MIME_TYPES.pdf]}
                maxSize={_maxSize}
                onReject={(files: FileRejection[]) => {
                    const tempFiles: string[] = [];
                    _.map(files, (file: any) => {
                        tempFiles.push(file.file.name)
                    })
                    setError(tempFiles);
                }}
                multiple={multiple}
                {...rest}
            >
                <div style={{ pointerEvents: 'none' }}>
                    <Group justify="center">
                        <Dropzone.Accept>
                            <IconDownload
                                style={{ width: '3rem', height: '3rem' }}
                                color="blue.6"
                                stroke={1.5}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX
                                style={{ width: '3rem', height: '3rem' }}
                                color="red.6"
                                stroke={1.5}
                            />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconCloudUpload
                                style={{ width: '3rem', height: '3rem' }}
                                stroke={1.5}
                            />
                        </Dropzone.Idle>
                    </Group>

                    <EzText ta="center" fw={700} mt="xl">
                        <Dropzone.Accept>Drop files here</Dropzone.Accept>
                        <Dropzone.Reject>Pdf file less than {formatFileSize(_maxSize)}</Dropzone.Reject>
                        <Dropzone.Idle>Upload file</Dropzone.Idle>
                    </EzText>
                    <EzText ta="center" mt="xs" c="dimmed">
                        Drag&apos;n&apos;drop files here to upload. We can accept only{" "}
                        <i>.pdf</i> files that are less than {formatFileSize(_maxSize)} in size.
                    </EzText>
                </div>
            </Dropzone>

            {error.length > 0 && renderError(error)}

            {data.length > 0 &&
                data.map((file, index) => {
                    const isImage =
                        IMAGE_MIME_TYPE.includes(file.type as (typeof IMAGE_MIME_TYPE)[number]);
                    return (
                        <Card key={index} p=".5rem">
                            <Flex justify="space-between" align='center'>
                                <Group>
                                    {isImage
                                        ? (
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                w={50}
                                                h={50}
                                                fit="cover"
                                                radius="sm"
                                            />
                                        )
                                        : <NoImage/>
                                    }
                                    <Text>{file.name} - size: {formatFileSize(file.size)}</Text>
                                </Group>
                                <ActionIconsToolTip
                                    ITEMS={[
                                        ...(isImage ?
                                        [{
                                            tooltip: 'Crop Image',
                                            icon: <IconCrop />,
                                            onClick: () => handleCropImage(file)
                                        }] : []),
                                        {
                                            tooltip: 'Remove file',
                                            icon: <IconX/>,
                                            onClick: () => {
                                                setData(prev =>
                                                    prev.filter(f => f.name !== file.name))
                                            }
                                        },
                                    ]}
                                />
                            </Flex>
                        </Card>
                    )
                })}

            <SaveCancelDeleteBtns
                cancel={cancel}
                accept={() => uploadedFiles(data)}
                label={{
                    accept: 'Upload',
                    cancel: 'Cancel',
                }}
            />
        </Stack>
    );
}

export default EzUploadFiles;