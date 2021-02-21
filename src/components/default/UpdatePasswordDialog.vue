<template>
  <the-dialog :value="value" @change="hideDialog">
    <!-- The Card -->
    <div class="bg-white rounded shadow-lg py-1 w-full max-w-lg">
      <!-- Header -->
      <div class="py-2 px-6 mb-3 border-b text-xl font-semibold">
        <i class="mdi mdi-lock mr-1"></i>
        <span>Password</span>
      </div>

      <!-- Content -->
      <div class="px-6">
        <!-- The Form -->
        <form @submit.prevent="updatePassword">
          <!-- Old Password -->
          <div class="mb-2">
            <label for="old_password">Old Password</label>
            <custom-input
              id="old_password"
              type="password"
              class="mt-1"
              placeholder="Old Password"
              :error="errorsField.old_password !== null"
              v-model="form.old_password"
            ></custom-input>
            <text-error v-if="errorsField.old_password">{{
              errorsField.old_password
            }}</text-error>
          </div>

          <!-- New Password -->
          <div class="mb-2">
            <label for="new_password">New Password</label>
            <custom-input
              id="new_password"
              type="password"
              class="mt-1"
              placeholder="New Password"
              :error="errorsField.new_password !== null"
              v-model="form.new_password"
            ></custom-input>
            <text-error v-if="errorsField.new_password">{{
              errorsField.new_password
            }}</text-error>
          </div>

          <!-- New Password Confirmation -->
          <div class="mb-2">
            <label for="new_password_confirmation">Repeat New Password</label>
            <custom-input
              id="new_password_confirmation"
              type="password"
              class="mt-1"
              placeholder="Repeat New Password"
              v-model="form.new_password_confirmation"
            ></custom-input>
          </div>

          <!-- Submit Button -->
          <submit-button :loading="loading">Update Password</submit-button>
        </form>
      </div>
    </div>
  </the-dialog>
</template>

<script>
import {
  hideValidationErrors,
  showValidationErrors,
} from '@/helpers/validationForm'
import Dialog from '@/components/default/Dialog'
import CustomInput from '@/components/default/Form/Input'
import SubmitButton from '@/components/default/Form/SubmitButton'
import TextError from '@/components/default/Form/TextError'
import profileApi from '@/api/profileApi'

export default {
  components: {
    'the-dialog': Dialog,
    CustomInput,
    SubmitButton,
    TextError,
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      form: {
        old_password: null,
        new_password: null,
        new_password_confirmation: null,
        _method: 'patch',
      },
      errorsField: {
        old_password: null,
        new_password: null,
      },
      loading: false,
    }
  },

  mounted() {
    this.resetForm()
  },

  methods: {
    hideDialog() {
      this.$emit('change', false)
    },
    resetForm() {
      this.form.old_password = null
      this.form.new_password = null
      this.form.new_password_confirmation = null
    },
    async updatePassword() {
      this.loading = true
      hideValidationErrors(this.errorsField)

      try {
        await profileApi.updatePassword(this.form)

        this.$toasted.show('Password updated.', {
          icon: 'mdi-check-circle',
          type: 'success',
        })

        this.resetForm()
        this.$el.querySelector('form').reset()
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(err.response.data.data, this.errorsField)
        } else if (errCode === 401) {
          this.errorsField.old_password = 'The old password field is wrong.'
        } else {
          this.$toasted.show(
            err?.response?.data?.message || 'Failed to update user password.',
            {
              icon: 'mdi-close-circle',
              type: 'error',
            },
          )
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
