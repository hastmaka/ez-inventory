import {SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {deleteFromFirebaseStorage, uploadToFirebaseStorage} from "@/api/firebase/FirebaseStore.ts";
import {getModel} from "@/api/models";
import {JewelryController} from "@/view/jewelry/JewelryController.ts";

import u from "@/util";
import {gramsToOz, ozToGrams} from "@/util/weightConversion.ts";
import moment from "moment";

export const JewelryModalController: SignalType<any, any> =
    new SignalController({
        editMap: {
            product: async function (fields, id) {
                const response = await FetchApi(`v1/product/${id}`)
                const product = new (getModel("product"))(response.data);

                const descriptionImage = product.product_image_url.find((i: any) => i.document_primary)
                // debugger

                fields.push('product_description', 'file_description', 'product_image_url')
                JewelryModalController.fields = fields
                JewelryModalController.populateForm('product', fields, {
                    ...product,
                    product_weight_g: gramsToOz(product.product_weight_g),
                    file_description: descriptionImage.document_url,
                })
                // the logic is already made to use this variable so
                JewelryModalController.aiLoading = false

                JewelryModalController.fileUrl = descriptionImage.document_url
            }
        },
        fileUrl: null,
        files: [] as File[],
        descriptionError: false,
        activeDescriptionIndex: null,
        platformGeneratorLoader: {}
    }, {
        removeFile: async function (this: any, file: File | any): Promise<void> {
            // then update product_image_url on db
            // then reload the modal
            const editing = this.modal.state === 'editing'
            if (editing) {
                // if we are in edit mode we need to delete the image from firestore
                const success = await deleteFromFirebaseStorage(file.document_url)
                if (success) {
                    const product_id = this.formData.product.product_id
                    const updatedImage = this.formData.product.product_image_url.filter((i: any) =>
                        i.document_url !== file.document_url)
                    await FetchApi(
                        'v1/product',
                        'PUT',
                        {product_id, product_image_url: updatedImage}
                    )
                    return this.editMap.product(this.fields, product_id)
                } else {
                    return window.toast.E('')
                }
            }
            this.formData.files = this.formData.files.filter((f: File) => f !== file);
        },
        addFile: async function (this: any, file: File[]) {
            const editing = this.modal.state === 'editing'
            if (editing) {
                const {product_image_url, product_id} = this.formData.product
                const response = await uploadToFirebaseStorage(file, 'product')
                response.map(({url}) => product_image_url.push({
                    document_primary: false,
                    document_type: 'image',
                    document_url: url
                }))
                await FetchApi(
                    'v1/product',
                    'PUT',
                    {product_id, product_image_url}
                )
                return this.editMap.product(this.fields, product_id)
            }
            const isFiles = this.formData.files?.length
            const existingNames = isFiles
                ? new Set(this.formData.files.map((f: File) => f.name))
                : new Set([]);
            const newFiles = file.filter((f: File) => !existingNames.has(f.name));
            this.formData.files = isFiles
                ? [...this.formData.files, ...newFiles]
                : [...newFiles]
        },
        codeGetData: async function (this: any) {
            const response = await FetchApi('v1/user/generate/2fa')
            this.codeData = response.data;
            this.codeLoading = false
        },
        // handleExport: async function(this: any, selectedRow: Record<number, boolean>) {
        //     const selectedIds = Object.keys(selectedRow).map(key => key)
        //     debugger
        // },
        setText: function (this: any, text: string, index: number) {
            this.aiData.product_description[index] = text
            if (index || index === 0) this.activeIndex = index
        },
        handleAccept: function (this: any) {
            this.aiData.descriptions[this.activeIndex] = this.selectToEdit
        },
        // handleCancel: function(this:any){
        //     this.files = []
        //     this.errors = {}
        //     this.formData = {}
        //     this.formDataCopy = {}
        //     this.aiData = []
        //     this.activeDescriptionIndex = null
        //     this.fileUrl = null
        //     this.aiLoading = true
        // },
        aiGetData: async function (this: any, fields: string[]) {
            this.isFetching = true
            const {file_description, ...rest} = this.formData.product;
            try {
                const firestoreResponse = await uploadToFirebaseStorage(file_description, "product");
                this.fileUrl = firestoreResponse[0].url

                const response = await FetchApi(
                    'v1/ai/product_description',
                    'GET',
                    null,
                    {
                        ...rest,
                        image_url: this.fileUrl
                    }
                )

                this.isFetching = false

                if (response.success) {
                    fields.push('product_description', 'file_description')
                    this.populateForm('product', fields, {
                        ...response.data,
                        file_description,
                        product_material: rest['product_material'],
                        product_type: rest['product_type'],
                        product_gem_type: rest['product_gem_type'],
                    })
                    this.aiLoading = false
                }

            } catch (error) {
                this.loading = false
                this.isFetching = false
                console.log(error);
            }
        },
        handleSave: async function (this: any, modalId: string) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {file_description, product_description, ...rest} = this.formData.product;
            rest.product_image_url = []
            rest.product_image_url.push({
                document_primary: true,
                document_type: 'image',
                document_url: this.fileUrl
            })
            if (this.formData.files?.length) {
                const response = await uploadToFirebaseStorage(this.formData.files, 'product')
                response.map(({url}) => rest.product_image_url.push({
                    document_primary: false,
                    document_type: 'image',
                    document_url: url
                }))
            }
            rest.product_description = product_description[this.activeDescriptionIndex]
            rest.product_weight_g = ozToGrams(rest.product_weight_g)

            const response = await FetchApi('v1/product', 'POST', u.extractSelectValues(rest))

            if (response.success) {
                window.closeModal(modalId)
                this.resetState()
                await JewelryController.fetchData()
            }
        },
        handleEdit: async function (this: any, modalId: string): Promise<void> {
            const {product_image_url, product_id} = this.formData.product
            const toDb: Record<string, any> = {...this.dirtyFields}
            if (toDb.product_weight_g != null) {
                toDb.product_weight_g = ozToGrams(toDb.product_weight_g);
            }
            toDb.product_image_url = product_image_url
            toDb.product_id = product_id
            // get files and upload them to firestore
            // create the new objs with the data return
            if (this.formData.files?.length) {
                const response = await uploadToFirebaseStorage(this.formData.files, 'product')
                response.map(({url}) => toDb.product_image_url.push({
                    document_primary: false,
                    document_type: 'image',
                    document_url: url
                }))
            }

            const response = await FetchApi(
                'v1/product',
                'PUT',
                u.extractSelectValues({...toDb}),
            )

            if (response.success) {
                window.closeModal(modalId)
                this.resetState()
                await JewelryController.fetchData()
            }

        },
        handleExport: async function (this: any, platform: string, idsArray: number[]): Promise<void> {
            const {data, rowSelection} = JewelryController
            const localIds = Object.keys(rowSelection).map(key => key)
            // get all the records from db
            const _data = idsArray || data.list.filter((_item: any, index: number) =>
                localIds.includes(index.toString())).map((p: any) => p.product_id)
            const csvName = `${platform}-${moment().format('MM-DD-YYYY')}-(${_data.length})${platform ? '-re' : ''}`

            this.platformGeneratorLoader[platform] = true

            const response = await FetchApi(
                `v1/product/${JSON.stringify(_data)}`,
                'GET',
                null,
                {platform: platform || this.checkbox[0]}
            )
            u.exportCSV(response.data, csvName, platform);
            this.platformGeneratorLoader[platform] = false
        },
        exportHistoryGetData: async function(this: any): Promise<void> {
            const response = await FetchApi('v1/export_log')
            this.exportHistoryData = response.data
            this.exportHistoryLoading = false
        },
        seeProductGetData: async function (this: any, _ids: any, platform: string, date: string) {
            this.exportHistoryLoading = true
            const response = await FetchApi(`v1/product/${JSON.stringify(_ids)}`)
            this.seeProductData = response.data
            this.seeProductLoading = false
            this.exportHistoryLoading = false
            window.updateModal('export-history-modal', {
                title: `Platform: ${u.capitalizeWords(platform)} - Products: (${_ids.length}) - Date: ${moment(date).format('MM/DD/YYYY')}`
            })
        },
        goingBack: async function(this: any) {
            this.exportHistoryLoading = true
            this.seeProductLoading = true
            this.seeProductData = []
            window.updateModal('export-history-modal', {
                title: "Export History",
            })
            await this.exportHistoryGetData()
        }
    }).signal