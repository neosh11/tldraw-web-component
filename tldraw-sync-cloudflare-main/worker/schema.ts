import { SchemaPropsInfo } from "tldraw"
export const preview: SchemaPropsInfo = {
    props: {
        html: {
            validate: (value) => {
                if (typeof value !== 'string') {
                    return 'html must be a string'
                }
                if (value.length > 100000) {
                    return 'html is too long'
                }
                return null
            }
        },
        parts: {
            validate: (value) => {
                if (!Array.isArray(value)) {
                    return 'parts must be an array'
                }
                if (value.length > 100) {
                    return 'parts is too long'
                }
                return null
            }
        },
        source: {
            validate: (value) => {
                if (typeof value !== 'string') {
                    return 'source must be a string'
                }
                if (value.length > 1000) {
                    return 'source is too long'
                }
                return null
            }
        },
        w: {
            validate: (value) => {
                if (typeof value !== 'number') {
                    return 'w must be a number'
                }
                if (value < 0 || value > 10000) {
                    return 'w is out of range'
                }
                return null
            }
        },
        h: {
            validate: (value) => {
                if (typeof value !== 'number') {
                    return 'h must be a number'
                }
                if (value < 0 || value > 10000) {
                    return 'h is out of range'
                }
                return null
            }
        },
        linkUploadVersion: {
            validate: (value) => {
                if (typeof value !== 'number') {
                    return 'linkUploadVersion must be a number'
                }
                return null
            }
        },
        uploadedShapeId: {
            validate: (value) => {
                if (typeof value !== 'string') {
                    return 'uploadedShapeId must be a string'
                }
                if (value.length > 100) {
                    return 'uploadedShapeId is too long'
                }
                return null
            }
        },
        dateCreated: {
            validate: (value) => {
                if (typeof value !== 'number') {
                    return 'dateCreated must be a number'
                }
                return null
            }
        },
    },
}