<template>
  <div id="register-page">
    <!-- Top Header -->
    <div class="text-3xl text-center text-white mb-3">
      <i class="mdi mdi-chat mr-1"></i>
      {{ appTitle }}
    </div>

    <!-- The Card -->
    <card>
      <card-header>
        Forgot Password
      </card-header>

      <card-content>
        <!-- Alert -->
        <div
          v-if="alert"
          class="rounded bg-green-500 text-white py-2 px-3 mb-2 flex"
        >
          <i class="mdi mdi-check-circle mr-2"></i>
          {{ alert }}
        </div>

        <!-- The Form -->
        <form @submit.prevent="forgotPassword">
          <!-- Email -->
          <div>
            <label for="email" class="block mb-1">Email</label>
            <custom-input
              id="email"
              type="email"
              placeholder="Email"
              v-model="form.email"
            ></custom-input>

            <text-error v-if="errors.email">
              {{ errors.email }}
            </text-error>
          </div>

          <!-- Submit Btn -->
          <submit-button :loading="loading">Send</submit-button>
        </form>
      </card-content>
    </card>
  </div>
</template>

<script>
import {
  showValidationErrors,
  hideValidationErrors,
} from '@/helpers/validationForm'
import Card from '@/components/auth/Card'
import CardHeader from '@/components/auth/CardHeader'
import CardContent from '@/components/auth/CardContent'
import CustomInput from '@/components/auth/Form/Input'
import SubmitButton from '@/components/auth/Form/SubmitButton'
import TextError from '@/components/auth/Form/TextError'
import authApi from '@/api/authApi'

export default {
  name: 'ForgotPasswordPage',

  components: {
    Card,
    CardHeader,
    CardContent,
    CustomInput,
    SubmitButton,
    TextError,
  },

  data() {
    return {
      form: {
        email: null,
      },
      errors: {
        email: null,
      },
      loading: false,
      alert: null,
    }
  },

  computed: {
    appTitle() {
      return process.env.VUE_APP_TITLE
    },
  },

  methods: {
    async forgotPassword() {
      this.loading = true
      this.alert = null
      hideValidationErrors(this.errors)

      try {
        await authApi.forgotPassword(this.form)

        this.alert =
          'Forgot password has been successfully sent to your e-mail.'
        this.form.email = null
      } catch (err) {
        const errCode = err.response.status

        if (errCode === 422) {
          showValidationErrors(err.response.data.data, this.errors)
        } else if (errCode == 404) {
          this.$toasted.show('Email not found.', {
            icon: 'mdi-close-circle',
            type: 'warning',
          })
        } else {
          this.$toasted.show('Failed to send forgot password mail.', {
            icon: 'mdi-close-circle',
            type: 'error',
          })
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
