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
    defaultValue?: string
    dynamic?: {
        initialElementCount: number
        value: true
    }
}

export interface Config{
    [key: string]: Validation
}

export interface Options {
    persist?: boolean
    alert?: boolean
    alertMessage?: string
    localStorageKey?: string
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
    isSubmitted: boolean
    fields: {
        [key: string]: {
            isDirty: boolean
            isTouched: boolean
        }
    }
}

export interface StoredValues {
    isSubmitted: boolean
    fields: {
        [key: string]: {
            isDirty: boolean
            isTouched: boolean
            value: string
            error: {
                hasError: boolean
                message?: string
            }
        } 
    }
}

export interface DynamicElements {
    [key: string]: {
        key: number
        value: string
        error: {
            hasError: boolean
            message?: string
        }
    }[]
}