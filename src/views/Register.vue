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
        Register
      </card-header>

      <card-content>
        <!-- The Form -->
        <form @submit.prevent="register">
          <!-- Email -->
          <div>
            <label for="email" class="block mb-1">Email</label>
            <custom-input
              id="email"
              placeholder="Email"
              v-model="form.email"
            ></custom-input>

            <text-error v-if="errors.email">
              {{ errors.email }}
            </text-error>
          </div>

          <!-- Username -->
          <div>
            <label for="username" class="block mb-1">Username</label>
            <custom-input
              id="username"
              placeholder="Username"
              v-model="form.username"
            ></custom-input>

            <text-error v-if="errors.username">
              {{ errors.username }}
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
          <submit-button :loading="loading">Register</submit-button>

          <hr class="my-1" />

          <div class="text-center">
            <span class="mr-1">Already have an account ?</span>
            <router-link :to="{ name: 'Login' }" class="text-blue-600"
              >Sign in here!</router-link
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
  name: 'RegisterPage',

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
        username: null,
        password: null,
        password_confirmation: null,
      },
      errors: {
        email: null,
        username: null,
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
      registerAction: 'register',
    }),
    async register() {
      this.loading = true
      hideValidationErrors(this.errors)

      try {
        await this.registerAction(this.form)

        this.$router.push({
          name: 'Home',
        })
      } catch (err) {
        const errCode = err.response.status

        if (errCode === 422) {
          showValidationErrors(err.response.data.data, this.errors)
        } else {
          this.$toasted.show('Failed to register user.', {
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
