<template>
    <form ref="form">
        <input type="text" name="name" ref="name" id="name" v-model="formValues.name.value"/>
        <input type="password" name="password" ref="password" id="password" v-model="formValues.password.value"/>
        <button type="submit" @click="submit">Submit</button>
    </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    data: () => {
        return {
            formValues: {
                name: {
                    value: '',
                    error: {
                        message: '',
                    }
                },
                password: {
                    value: '',
                    error: {
                        message: ''
                    }
                }
            }
        }
    },
    props: {
        config: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ['on-submit', 'on-error'],
    methods: {
        submit: function(event: MouseEvent){
            event.preventDefault();

            if (Object.keys(this.config).length === 0){
                const formData = Object.create({})
                for (const [key, each] of Object.entries(this.formValues)) {
                    formData[key] = each.value
                }
                this.$emit('on-submit', formData);
            } else {
                const formData = Object.create(this.formValues)
                for (const [key, each] of Object.entries(this.formValues)) {
                    const validations = this.config[key];

                    if (validations?.required?.value && (each.value === '' || each.value === null || each.value === undefined)) {
                        formData[key] = {
                            value: each.value,
                            error: {
                                message: validations.required.message || `${key} is required`
                            }
                        }
                    } else if(validations?.minLength?.value && each.value.length < validations?.minLength?.value) {
                        formData[key] = {
                            value: each.value,
                            error: {
                                message: validations.minLength.message || `${key} length is less than ${validations?.minLength?.value}`
                            }
                        }
                    } else if(validations?.maxLength?.value && each.value.length > validations?.maxLength?.value) {
                        formData[key] = {
                            value: each.value,
                            error: {
                                message: validations.maxLength.message || `${key} length is greater than ${validations?.maxLength?.value}`
                            }
                        }
                    } else if(validations?.validate) {
                        const isValidInput = validations.validate(each.value)
                        if (isValidInput === true) {
                            formData[key] = each.value
                        } else {
                            formData[key] = {
                                value: each.value,
                                error: {
                                    message: isValidInput
                                }
                            }
                        }
                    } else {
                        formData[key] = each.value
                    }

                }
                const hasError = Object.keys(formData).find((key) => formData[key].error !== undefined)
                if(hasError) {
                    this.$emit('on-error', formData)
                } else {
                    this.$emit('on-submit', formData);
                }
            }
        }
    }
})
</script>
