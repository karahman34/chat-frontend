<template>
  <div id="login-page">
    <!-- Top Header -->
    <div class="text-3xl text-center text-white mb-3">
      <i class="mdi mdi-chat mr-1"></i>
      {{ appTitle }}
    </div>

    <!-- The Card -->
    <card>
      <card-header>
        Login
      </card-header>

      <card-content>
        <!-- The Form -->
        <form @submit.prevent="login">
          <!-- Username -->
          <div>
            <label for="email_or_username" class="block mb-1"
              >Email / Username</label
            >
            <custom-input
              id="email_or_username"
              placeholder="Email / Username"
              v-model="form.email_or_username"
            ></custom-input>

            <text-error v-if="errors.email_or_username">
              {{ errors.email_or_username }}
            </text-error>
          </div>

          <!-- Password -->
          <div class="my-2">
            <div class="flex justify-between">
              <label for="password" class="block mb-1">Password</label>
              <router-link
                :to="{ name: 'ForgotPassword' }"
                class="text-blue-600 hover:underline"
                >Forgot password?</router-link
              >
            </div>

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

          <!-- Submit Btn -->
          <submit-button :loading="loading">Login</submit-button>

          <hr class="my-1" />

          <div class="text-center">
            <span class="mr-1">Dont have an account ?</span>
            <router-link :to="{ name: 'Register' }" class="text-blue-600"
              >Sign up here!</router-link
            >
          </div>
        </form>
      </card-content>
    </card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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

export default {
  name: 'LoginPage',

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
        email_or_username: null,
        password: null,
      },
      errors: {
        email_or_username: null,
        password: null,
      },
      loading: false,
    }
  },

  computed: {
    appTitle() {
      return process.env.VUE_APP_TITLE
    },
  },

  methods: {
    ...mapActions('auth', {
      loginAction: 'login',
    }),
    async login() {
      this.loading = true
      hideValidationErrors(this.errors)

      try {
        await this.loginAction(this.form)

        this.$router.push({
          name: 'Home',
        })
      } catch (err) {
        const errCode = err.response.status

        if (errCode === 422) {
          showValidationErrors(err.response.data.data, this.errors)
        } else if (errCode === 401) {
          this.$toasted.show('Invalid credentials.', {
            icon: 'mdi-close-circle',
            type: 'error',
          })
        } else {
          this.$toasted.show('Failed to authenthicate user.', {
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
