import axios from 'axios'
import Resizer from 'react-image-file-resizer'
import { envConfig } from '@/helpers/envConfig'

const MAXIMUM_IMAGE_SIZE = 4000000 // 4MB maximum image size

const resizeFile = (file: File): Promise<string> =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            250, // Is the maxWidth of the resized new image.
            250, // Is the maxHeight of the resized new image.
            'WEBP', // Is the compressFormat of the resized new image.
            70,
            0,
            (uri: any) => {
                resolve(uri)
            },
            'base64'
        )
    })

const uploadToCloudinary = async (dataUrl: string): Promise<Record<string, any>> => {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${envConfig.cloudinaryCloudName}/image/upload` // Replace with your Cloudinary upload endpoint
    const formData = new FormData()
    formData.append('file', dataUrl)

    formData.append('upload_preset', envConfig.cloudinaryUploadPreset || '')
    formData.append('cloud_name', envConfig.cloudinaryCloudName || '')
    formData.append('folder', envConfig.cloudinaryFolderName || '')

    const response = await axios.post(cloudinaryUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export { resizeFile, uploadToCloudinary, MAXIMUM_IMAGE_SIZE }
