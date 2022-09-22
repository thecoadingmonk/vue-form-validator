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
import {  defineComponent } from "vue";
export default defineComponent({
    data: () => {
        return {
            formValues: {},
            formState: {}
        }
    },
    props: {
        config: {
            type: Object,
            default: () => ({})
        },
        options: {
            type: Object,
            default: () => ({})
        },
        ref: {
            type: String,
            default:'form'
        }
    },
    created() {
        for(const [key] of Object.entries(this.config)) {
            this.formValues = {
                ...this.formValues,
                [key]: {
                    value: this.options[key]?.defaultValue ?? ''
                }
            }
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
                if(hasError) {
                    this.$emit('on-error', formData);
                } else {
                    this.$emit('on-submit', formData);
                }
            }
        },
        setTouched(key: string) {
            this.formState[key] = {
                ...this.formState[key],
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
            this.formState[key] = {
                ...this.formState[key],
                isDirty: true,
            }
            if(this.config[key].validateOn === 'change') {
                this.formValues[key] = {
                    ...this.formValues[key],
                    ...this.validator({value: this.formValues[key].value, key })
                }
            }
        },
        validator({  value, key }){
            const validations = this.config[key];
            if((this.$refs[this.ref][key].disabled && validations?.validateOnDisabled) || !this.$refs[this.ref][key].disabled) {
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
                                message: isValidInput,
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
        getFormState() {
            const state = Object.create({})
            for(const [key, value] of Object.entries(this.formValues)){
                state[key] = {
                    ...(value ?? {}),
                    ...(this.formState[key] ?? {}),
                }
            }
            return state
        }
    },
})
</script>
