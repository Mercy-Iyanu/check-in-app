import { ObjectSchema } from 'yup'

enum InputType {
    'button',
    'checkbox',
    'color',
    'date',
    'datetime-local',
    'email',
    'file',
    'hidden',
    'image',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'time',
    'url',
    'week'
}

export type FormField = {
    name: string
    label: string
    type: keyof typeof InputType
    required: boolean
    value: string
}

export type FormProps = {
    fields: FormField[]
    onSubmit: (data: any) => void
    schema: ObjectSchema<any> | undefined
    submitText?: string
    isSubmitting?: boolean
}

/**
 * FormBuilder: to create forms dynamically based on configuration
 * It works together with FormTemplate
 * 
 * Usage: 
  ```ts
 const form = useRef(new FormBuilder()
    .addField("firstName", "First name", "text")
    .isRequired()
    .addField("lastName", "Last name", "text")
    .addField("email", "Email", "email")
    .isRequired()
    .setSchema(schema) // schema is Yup.ObjectSchema
    .build((data: any) => {
        console.log("Form submitted with data:", data);
    }));
  ```
 */
class FormBuilder {
    private fields: FormField[]
    private schema: ObjectSchema<any> | undefined

    constructor() {
        this.fields = []
    }

    /**
     *
     * @param name Name of the input field
     * @param label Text label
     * @param type Input type. For example, text, number, tel etc
     * @returns FormBuilder
     */
    addField(name: string, label: string, type: keyof typeof InputType) {
        this.fields.push({
            name,
            label,
            type,
            required: false,
            value: ''
        })

        return this
    }

    setSchema(schema: ObjectSchema<any>) {
        this.schema = schema
        return this
    }

    isRequired() {
        const lastField = this.fields[this.fields.length - 1]
        if (lastField) {
            lastField.required = true
        }
        return this
    }

    build(submitCallback: (data: any) => void): FormProps {
        return {
            fields: this.fields,
            onSubmit: submitCallback,
            schema: this.schema
        }
    }

    resetForm() {
        this.fields.forEach((field) => {
            field.value = ''
        })
    }
}

export default FormBuilder
