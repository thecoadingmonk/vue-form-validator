<template>
  <Form @on-submit="onSubmit" @on-error="onError" :config="FORM_CONFIG" :options="options" :ref="formRef">
    <template #name="{fieldKey, field, error, on}">
      <label :for="fieldKey">{{fieldKey}}</label>
      <input type="text" :name="fieldKey" :ref="fieldKey" :id="fieldKey" v-model="field.value" v-on="on" disabled/>
      <p>{{error}}</p>
    </template>

    <template #password="{fieldKey, field, error, on}">
      <label :for="fieldKey">{{fieldKey}}</label>
      <input type="text" :name="fieldKey" :ref="fieldKey" :id="fieldKey" v-model="field.value" v-on="on"/>
      <p>{{error}}</p>
    </template>

    <template #range="{fieldKey, field, error, on}">
      <label :for="fieldKey">{{fieldKey}}</label>
      <input type="range" :name="fieldKey" :ref="fieldKey" :id="fieldKey" v-model="field.value" v-on="on"/>
      <p>{{error}}</p>
    </template>

    <template #emails="{fieldKey, field, error, on, elements}">
      <label :for="fieldKey">{{fieldKey}}</label>
      <template v-for="(element) in elements" :key="element.key">
        <label :for="element.key">{{element.key}}</label>        
        <input type="text" :name="fieldKey + element.key" :id="fieldKey + element.key" v-model="element.value" v-on:input="(e) => on?.input(e, element.key)"/>
        <button @click="remove(element.key)">Remove</button>
        <p>{{element.error.message}}</p>
        <br />
      </template>
      <p>{{error}}</p>
    </template>

    <template #submit="{submit}">
      <button type="submit" @click="submit">Submit from parent</button>
    </template>
  </Form>
  <button type="button" @click="getFormState">Get form state</button>
  <button type="button" @click="append">append</button>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Form from './components/Form.vue';
  import type {Config} from './types/form';

  const formRef = ref('form');

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
      },
      append () {
        this.$refs[this.formRef].append('emails')
      },
      remove (index: number) {
        this.$refs[this.formRef].remove('emails', index)
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
            defaultValue: 'Samartha Hegde'
          },
          password: {
            required: {
              value: true,
              message: 'Password is Required'
            }
          },
          range: {},
          emails: {
            minLength: {
              value: 5,
              message: 'Name should be at least have 5 characters'
            },
            dynamic: {
              value: true, 
              initialElementCount: 3,
              defaultValue: 'new'
            },
            validateOn: 'change'
          }
        } as Config,
        options: {
          persist: false,
          alert: true,
          alertMessage: 'Changes you made may not be saved',
          localStorageKey: 'new-form'
        },
        formRef: formRef
      }
    }
  })
  </script>
