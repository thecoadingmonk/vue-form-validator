<template>
    <form :ref="ref">
        <div v-for="[key] of Object.entries(config)" :key="key">
            <slot 
                :name="key" 
                :field="formValues[key]" 
                :key="key" 
                :error="formValues[key].error?.message" 
                :on="{
                    focus: () => setTouched(key),
                    input: () => setInput(key)
                }"
            />
        </div>
        <slot name="submit" :submit="submit">
            <button type="submit" @click="submit">Submit</button>
        </slot>
    </form>
</template>

<script lang="ts">
import {  defineComponent, PropType } from "vue";
import { Props, FormValues, FormState, Config, Options, StoredValues } from '../types/form';

export default defineComponent({
    data: () => {
        return {
            formValues: {} as FormValues,
            formState: {
                isSubmitted: false,
            } as FormState
        }
    },
    props: {
        config: {
            type: Object as PropType<Config>,
            default: () => ({})
        },
        options: {
            type: Object as PropType<Options>,
            default: () => ({})
        },
        ref: {
            type: String as PropType<Props['ref']>,
            default:'form'
        }
    },
    created() {
        for(const [key] of Object.entries(this.config)) {
            this.formValues = {
                ...this.formValues,
                [key]: {
                    value: this.config[key].defaultValue ?? '',
                }
            }
            this.formState.fields = { 
                ...this.formState.fields,
                [key]: {
                    isDirty: false,
                    isTouched: false,
                }
            }
        }

        if (this.options.persist) {
            this.restore()
        }

        if (this.options.alert && !this.options.persist) {
            window.addEventListener('beforeunload', this.handleReload, { capture: true })
        }
    },
    emits: ['on-submit', 'on-error'],
    methods: {
        submit: function(event?: MouseEvent){
            event?.preventDefault();

            if (Object.keys(this.config).length === 0){
                const formData = Object.create({})
                for (const [key, each] of Object.entries(this.formValues)) {
                    formData[key] = {
                        value: each.value 
                    }
                }
                this.$emit('on-submit', formData);
            } else {
                const formData = Object.create(this.formValues)
                for (const [key, each] of Object.entries(this.formValues)) {
                    formData[key] = this.validator({ key, value: each.value })
                }
                const hasError = Object.keys(formData).find((key) => formData[key].error.hasError === true)
                this.formValues = formData;
                this.formState.isSubmitted = true;

                if(hasError) {
                    this.$emit('on-error', formData);
                } else {
                    this.$emit('on-submit', formData);
                }

                if(this.options.persist) {
                    this.store()
                }
            }
        },
        setTouched(key: string) {
            this.formState.fields[key] = {
                ...(this.formState.fields[key] ?? {}),
                isTouched: true,
            }
            if(this.config[key].validateOn === 'focus') {
                this.formValues[key] = {
                    ...this.formValues[key],
                    ...this.validator({value: this.formValues[key].value, key })
                }
            }
        },
        setInput(key: string) {
            this.formState.fields[key] = {
                ...(this.formState.fields[key] ?? {}),
                isDirty: true,
            }
            
            if(this.config[key].validateOn === 'change') {
                this.formValues[key] = {
                    ...this.formValues[key],
                    ...this.validator({value: this.formValues[key].value, key })
                }
            }

            if(this.options.persist) {
                this.store()
            }
        },
        validator({  value, key }: {value: string, key: string}){
            const validations = this.config[key];
            if((this.$refs?.[this.ref]?.[key]?.disabled && validations?.validateOnDisabled) || !this.$refs?.[this.ref]?.[key]?.disabled) {
                if (validations?.required?.value && (value === '' || value === null || value === undefined)) {
                    return {
                        value: value,
                        error: {
                            message: validations.required.message || `${key} is required`,
                            hasError: true
                        }
                    }
                } else if(validations?.minLength?.value && value.length < validations?.minLength?.value) {
                    return {
                        value: value,
                        error: {
                            message: validations.minLength.message || `${key} length is less than ${validations?.minLength?.value}`,
                            hasError: true
                        }
                    }
                } else if(validations?.maxLength?.value && value.length > validations?.maxLength?.value) {
                    return {
                        value: value,
                        error: {
                            message: validations.maxLength.message || `${key} length is greater than ${validations?.maxLength?.value}`,
                            hasError: true
                        }
                    }
                } else if(validations?.validate) {
                    const isValidInput = validations.validate(value)
                    if (isValidInput === true) {
                        return {
                            value: value,
                            error: {
                                hasError: false
                            }
                        }
                    } else {
                        return {
                            value: value,
                            error: {
                                message: typeof isValidInput === 'string' ? isValidInput : undefined,
                                hasError: true
                            }
                        }
                    }
                } else {
                    return {
                        value: value,
                        error: {
                            hasError: false
                        }
                    }
                }
            } else {
                    return {
                        value: value,
                        error: {
                            hasError: false
                        }
                    }
            }
        },
        getFormState(): StoredValues {
            const state = Object.create({})
            for(const [key, value] of Object.entries(this.formState.fields)){
                state[key] = {
                    ...(this.formValues[key] ?? {}),
                    ...(value ?? {}),
                }
            }
            return {fields: state, isSubmitted: this.formState.isSubmitted}
        },
        store() {
            const localStorageKey = this.options.localStorageKey ?? 'FORM_VALUES'
            localStorage.setItem(localStorageKey, JSON.stringify(this.getFormState()))
        },
        restore() {
            const localStorageKey = this.options.localStorageKey ?? 'FORM_VALUES' 
            const storedValues: StoredValues = JSON.parse(localStorage.getItem(localStorageKey) ?? '{}')
            const hasValue = Object.keys(storedValues).length
            
            if (hasValue) {
                for(const [key, each] of Object.entries(storedValues)) {
                    this.formValues[key] = {
                        value: each.value,
                        error: each.error
                    }
                    this.formState.fields[key] = {
                        isDirty: each.isDirty,
                        isTouched: each.isTouched
                    }
                }
            }
        },
        handleReload(event: BeforeUnloadEvent) {
            event.preventDefault();
            const isFormDirty = !!Object.values(this.formState.fields).find(each => each.isDirty)

            if (isFormDirty) {
                return event.returnValue = this.options.alertMessage ?? 'Changes that you made may not be saved.'
            }
            return undefined
        }
    },
    beforeUnmount() {
        window.removeEventListener('beforeunload', this.handleReload, {capture: true})
    }
})
</script>
