import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { computed, watch } from 'vue'

export function useRequestForm (fn) {
  const { handleSubmit, isSubmitting, submitCount } = useForm()

  const PASSWORD_MIN_LENGTH = 6

  const { value: fio, errorMessage: fioError, handleBlur: fioBlur } = useField(
    'fio',
    yup
      .string()
      .trim()
      .min(3, 'name of at least three characters')
  )

  const { value: phone, errorMessage: phoneError, handleBlur: phoneBlur } = useField(
    'phone',
    yup
      .string()
      .trim()
  )

  const { value: email, errorMessage: eError, handleBlur: eBlur } = useField(
    'email',
    yup
      .string()
      .trim()
      .required('The email field is required')
      .email('Invalid email')
  )
  const { value: password, errorMessage: pError, handleBlur: pBlur } = useField(
    'password',
    yup
      .string()
      .trim()
      .required('The password field is required')
      .min(PASSWORD_MIN_LENGTH, `Password length is at least ${PASSWORD_MIN_LENGTH} characters`)
  )

  const isTooManyAttempts = computed(() => submitCount.value >= 3)

  watch(isTooManyAttempts, val => {
    let timer
    if (val) {
      timer = setTimeout(() => submitCount.value = 0, 1500)
    }
    return () => {
      clearTimeout(timer)
    }
  })

  const onSubmit = handleSubmit(fn)

  return {
    onSubmit,
    isSubmitting,
    fio,
    fioError,
    fioBlur,
    phone,
    phoneError,
    phoneBlur,
    email,
    eError,
    eBlur,
    password,
    pError,
    pBlur,
    isTooManyAttempts
  }
}
