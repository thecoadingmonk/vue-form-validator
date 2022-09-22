import type { VNodeRef } from "vue";

export interface Group {
    value: number | string | boolean
    message: string
}

export interface Validation {
    required?: Group
    minLength?: Group
    maxLength?: Group
    validate?: (value: string) => string | boolean
    validateOn?: 'focus' | 'change' | 'submit'
    validateOnDisabled?: boolean
}

export interface Config{
    [key: string]: Validation
}

export interface Options {
    [key: string]: {
        defaultValue: string
    }
}

export interface Props {
    ref: VNodeRef
    config: Config
    options: Options
}

export interface FormValues {
    [key: string]: {
        value: string
        error?: {
            hasError: boolean
            message?: string
        }
    } 
}

export interface FormState {
    [key: string]: {
        isDirty: boolean
        isTouched: boolean
    }
}