import {
    FormControl,
    FormLabel,
    Input,
    Button,
    FormErrorMessage,
    Stack,
    FormHelperText
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProps } from './Builder'

/**
 * FormTemplate: to  create really complex forms that have 
 * different types of inputs, validations, and styles
 * It works together with FormBuilder.
 * Usage:
  ```ts 
 function Example() {
  const form = useRef(new FormBuilder()
    .addField("firstName", "First name", "text")
    .addField("lastName", "Last name", "text")
    .addField("email", "Email", "email")
    .build((data: any) => {
        console.log("Form submitted with data:", data);
    }));

    return (
      <div>
        <h1>Sign up form</h1>
        <FormTemplate {...form.current} />
      </div>
    );
  }
  ```
 */
function FormTemplate(props: FormProps) {
    const { fields, onSubmit, schema, isSubmitting, submitText = 'Submit' } = props
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm({
        // @ts-ignore (I do not know why TS yell about schema)
        resolver: yupResolver(schema)
    })

    return (
        <Stack spacing={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field) => (
                    <FormControl
                        my={4}
                        key={field.name}
                        isRequired={field.required}
                        isInvalid={Boolean(errors[field.name])}
                    >
                        <FormLabel>{field.label}</FormLabel>
                        {field.type === 'file' ? (
                            <Input
                                w={'full'}
                                type={field.type}
                                accept="image/*"
                                {...register(field.name)}
                            />
                        ) : (
                            <Input
                                w={'full'}
                                type={field.type}
                                {...register(field.name)}
                            />
                        )}
                        {field.type === 'file' && (
                            <FormHelperText>
                                Maximum image size allowed is 4MB 😉
                            </FormHelperText>
                        )}
                        <FormErrorMessage>
                            {errors[field.name]?.message?.toString()}
                        </FormErrorMessage>
                    </FormControl>
                ))}
                <Stack spacing={10} pt={2}>
                    <Button
                        mt={4}
                        type="submit"
                        isLoading={isSubmitting}
                        loadingText="Submitting"
                    >
                        {submitText}
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
}

export default FormTemplate
