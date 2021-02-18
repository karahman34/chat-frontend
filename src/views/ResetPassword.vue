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
        Reset Password
      </card-header>

      <card-content>
        <!-- Alert -->
        <div
          v-if="alert"
          class="rounded bg-green-500 text-white py-2 px-3 mb-2 flex"
        >
          <i class="mdi mdi-check-circle mr-2"></i>
          <div>
            <span>Password has been changed successfully.</span>
            <router-link :to="{ name: 'Login' }" class="ml-1 underline"
              >Sign in.</router-link
            >
          </div>
        </div>

        <!-- The Form -->
        <form @submit.prevent="resetPassword">
          <!-- Email -->
          <div>
            <label for="email" class="block mb-1">Email</label>
            <custom-input
              id="email"
              type="email"
              placeholder="Email"
              readonly
              class="bg-gray-200"
              :value="email"
              disabled
            ></custom-input>

            <text-error v-if="errors.email">
              {{ errors.email }}
            </text-error>
          </div>

          <!-- Password -->
          <div class="my-2">
            <label for="password" class="block mb-1">Password</label>

            <custom-input
              id="password"
              type="password"
              placeholder="Password"
              v-model="form.password"
            ></custom-input>

            <text-error v-if="errors.password">
              {{ errors.password }}
            </text-error>
          </div>

          <!-- Password Confirmation -->
          <div class="my-2">
            <label for="password_confirmation" class="block mb-1"
              >Password Confirmation</label
            >
            <custom-input
              id="password_confirmation"
              type="password"
              placeholder="Password Confirmation"
              v-model="form.password_confirmation"
            ></custom-input>
          </div>

          <!-- Submit Btn -->
          <submit-button :loading="loading">Reset Password</submit-button>
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
  name: 'ResetPasswordPage',

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
        password: null,
        password_confirmation: null,
      },
      errors: {
        password: null,
      },
      loading: false,
      alert: null,
    }
  },

  computed: {
    appTitle() {
      return process.env.VUE_APP_TITLE
    },
    email() {
      return this.$route.query.email
    },
    token() {
      return this.$route.query.token
    },
  },

  methods: {
    async resetPassword() {
      this.loading = true
      this.alert = false
      hideValidationErrors(this.errors)

      try {
        await authApi.resetPassword({
          ...this.form,
          email: this.email,
          token: this.token,
        })

        this.alert = true
        this.form.password = null
        this.form.password_confirmation = null
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
