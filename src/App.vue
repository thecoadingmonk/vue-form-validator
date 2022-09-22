<template>
  <Form @on-submit="onSubmit" @on-error="onError" :config="FORM_CONFIG" :options="options" ref="form">
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
  import { defineComponent } from 'vue';
  import Form from './components/Form.vue'
  
  export default defineComponent({
    methods: {
      onSubmit: (data: Object) => {
        console.log('submit has been called', data);
      },
      onError: (data: Object) => {
        console.log('Form has error', data)
      },
      getFormState() {
        console.log(this.$refs.form.getFormState())
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
            validateOn: 'change',
            validateOnDisabled: true,
          },
          password: {
            required: {
              value: true
            }
          }
        },
        options: {
          name: {
            defaultValue: 'Samartha Hegde',
          }
        }
      }
    }
  })
  </script>
