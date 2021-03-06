<template>
  <aside id="sidebar" class="border-r">
    <!-- Top Container -->
    <div class="top-container px-4">
      <!-- User Container -->
      <div
        class="user-container py-3 mb-3 flex items-center justify-between border-b border-gray-300"
      >
        <div class="flex items-center">
          <!-- Avatar -->
          <img :src="user.avatar" class="user-avatar" />

          <div class="flex flex-col">
            <!-- Username -->
            <span>{{ user.username }}</span>

            <!-- Active Indicator -->
            <span
              class="online-indicator"
              :class="{ offline: userStatus === 'Offline' }"
            >
              {{ userStatus }}
            </span>
          </div>
        </div>

        <!-- Menu -->
        <dropdown-menu>
          <dropdown-item @click="$emit('update-profile')">
            <i class="mdi mdi-account"></i>
            <span>Profile</span>
          </dropdown-item>

          <dropdown-item @click="$emit('update-password')">
            <i class="mdi mdi-lock"></i>
            <span>Password</span>
          </dropdown-item>

          <dropdown-item
            class="px-3 flex space-x-1 cursor-pointer "
            @click="goLogout"
          >
            <i
              class="mdi"
              :class="[logoutLoading ? 'mdi-loading mdi-spin' : 'mdi-logout']"
            ></i>
            <span>Logout</span>
          </dropdown-item>
        </dropdown-menu>
      </div>

      <!-- The Search -->
      <search @input="searchPeoples"></search>
    </div>

    <!-- Conversation Container -->
    <div class="conversation-container px-4">
      <!-- Loading -->
      <div
        v-if="getLastConversationLoading"
        class="text-center text-gray-500 mt-5"
      >
        <i class="mdi mdi-spin mdi-loading text-5xl"></i>
        <p class="mt-3">Searching...</p>
      </div>

      <!-- Search Peoples -->
      <template v-else-if="searchResult !== null">
        <template v-if="searchResult.length">
          <people
            v-for="people in searchResult"
            :key="people.id"
            :people="people"
          ></people>
        </template>

        <div v-else class="text-center text-gray-500 text-2xl mt-5">
          <i class="mdi mdi-magnify mr-2"></i>
          <span>Users not found.</span>
        </div>
      </template>

      <!-- Conversations Empty -->
      <template v-else-if="!conversations.length">
        <div class="text-xl text-center text-gray-500 flex flex-col mt-5">
          <i class="mdi mdi-account-group text-3xl"></i>
          <span class="text-2xl"
            >Find peoples and start the conversations.</span
          >
        </div>
      </template>

      <!-- List of conversations -->
      <template v-else v-for="conversation in conversations">
        <conversation
          v-if="
            Array.isArray(conversation.messages) || conversation.last_message
          "
          :key="conversation.id"
          :conversation="conversation"
        ></conversation>
      </template>
    </div>
  </aside>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { stopEcho } from '@/plugins/echo'
import { userStatus } from '@/helpers/authUser'
import globalApi from '@/api/globalApi'
import DropdownMenu from '@/layouts/default/partials/DropdownMenu'
import DropdownItem from '@/layouts/default/partials/DropdownItem'
import Search from '@/components/default/SearchBox'
import People from '@/components/default/People'
import Conversation from '@/components/default/Conversation'

export default {
  components: {
    DropdownMenu,
    DropdownItem,
    Search,
    People,
    Conversation,
  },

  data() {
    return {
      searchResult: null,
      getLastConversationLoading: false,
      logoutLoading: false,
    }
  },

  computed: {
    ...mapState('auth', {
      user: state => state.user,
    }),
    ...mapState('conversation', {
      conversationsState: state => state.conversations,
    }),
    userStatus() {
      return userStatus(this.user.last_online)
    },
    conversations() {
      return [...this.conversationsState].sort((a, b) => {
        const aLastMessage = this.findLastMessage(a)
        const bLastMessage = this.findLastMessage(b)

        if (!aLastMessage || !bLastMessage) {
          return 0
        }

        const aDate = new Date(aLastMessage.created_at)
        const bDate = new Date(bLastMessage.created_at)
        if (aDate < bDate) {
          return 1
        } else {
          return -1
        }
      })
    },
  },

  mounted() {
    this.getLastConversations()
  },

  methods: {
    ...mapActions('auth', {
      logoutAction: 'logout',
    }),
    ...mapActions('conversation', {
      getLastConversationAction: 'getLastConversations',
    }),
    async goLogout() {
      if (this.logoutLoading) return
      this.logoutLoading = true

      try {
        await this.logoutAction()

        stopEcho()

        this.$router.push({
          name: 'Login',
        })
      } catch (err) {
        this.$toasted.show('Failed to logout user.', {
          icon: 'mdi-close-circle',
          type: 'error',
        })
      } finally {
        this.logoutLoading = false
      }
    },
    async getLastConversations() {
      this.getLastConversationLoading = true

      try {
        await this.getLastConversationAction()
      } catch (err) {
        this.$toasted.show('Failed to get last conversations.', {
          icon: 'mdi-close-circle',
          type: 'error',
        })
      } finally {
        this.getLastConversationLoading = false
      }
    },
    async searchPeoples(value) {
      if (!value.length) {
        this.searchResult = null
        return
      }

      this.getLastConversationLoading = true

      try {
        const res = await globalApi.searchPeoples({
          search: value,
        })

        this.searchResult = res.data.data
      } catch (err) {
        this.$toasted.show('Something went wrong, failed to search peoples.', {
          icon: 'mdi-close-circle',
          type: 'error',
        })
      } finally {
        this.getLastConversationLoading = false
      }
    },
    findLastMessage(conversation) {
      return Array.isArray(conversation.messages)
        ? conversation.messages[0]
        : conversation.last_message
    },
  },
}
</script>
