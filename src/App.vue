<template>
  <Form @on-submit="onSubmit" @on-error="onError" :config="FORM_CONFIG"/>
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
            }
          }
        }
      }
    }
  })
  </script>
