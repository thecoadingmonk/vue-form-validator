<template>
  <Form @on-submit="onSubmit" @on-error="onError" :config="FORM_CONFIG" :options="options" :ref="formRef">
    <template #name="{key, field, error, on}">
      <label :for="key">{{key}}</label>
      <input type="text" :name="key" :ref="key" :id="key" v-model="field.value" v-on="on"/>
      <p>{{error}}</p>
    </template>

    <template #password="{key, field, error, on}">
      <label :for="key">{{key}}</label>
      <input type="text" :name="key" :ref="key" :id="key" v-model="field.value" v-on="on"/>
      <p>{{error}}</p>
    </template>

    <template #submit="{submit}">
      <button type="submit" @click="submit">Submit from parent</button>
    </template>
  </Form>
  <button type="button" @click="getFormState">Get form state</button>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Form from './components/Form.vue';
  import type {Config} from './types/form';

  export default defineComponent({
    methods: {
      onSubmit: (data: Object) => {
        console.log('submit has been called', data);
      },
      onError: (data: Object) => {
        console.log('Form has error', data)
      },
      getFormState () {
        console.log(this.$refs[this.formRef].getFormState())
      }
    },
    components: {
      Form
    },
    data: () => {
      return {
        FORM_CONFIG: {
          name: {
            required: {
              value: true,
              message: 'Name is required'
            },
            minLength: {
              value: 10,
              message: 'Name should be at least have 10 characters'
            },
            maxLength: {
              value: 100,
              message: 'Name cannot exceed 100 characters'
            },
            validate: (value: string) => {
              if (value) {
                return true
              }
              return 'Name cannot be empty'
            },
            validateOnDisabled: true,
          },
          password: {
            required: {
              value: true,
              message: 'Password is Required'
            }
          }
        } as Config,
        options: {
          name: {
            defaultValue: 'Samartha Hegde',
          }
        },
        formRef: ref('form')
      }
    }
  })
  </script>
