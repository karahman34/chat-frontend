<template>
  <div id="default-layout" v-if="loggedIn" class="px-3 flex items-center">
    <!-- Chat Card -->
    <div
      class="chat-card flex mx-auto bg-white shadow-xl rounded-2xl overflow-hidden w-full lg:max-w-5xl"
    >
      <!-- The Sidebar -->
      <sidebar
        :class="{
          'mobile-active': sidebarMobileActive,
        }"
        @update-profile="updateProfileDialog = true"
        @update-password="updatePasswordDialog = true"
      ></sidebar>

      <!-- Content -->
      <section
        class="content"
        :class="{
          'sidebar-mobile-active': sidebarMobileActive,
        }"
      >
        <!-- Default View -->
        <div
          v-if="!currentConversation"
          class="h-full flex flex-col justify-center items-center text-gray-600"
        >
          <i class="mdi mdi-chat-outline text-8xl"></i>
          <p class="text-2xl">Start Conversation.</p>
        </div>

        <!-- Real Content -->
        <template v-else>
          <!-- The Navbar -->
          <navbar
            :conversation="currentConversation"
            @hide="hideNavbar"
          ></navbar>

          <!-- View -->
          <div class="main">
            <slot></slot>
          </div>

          <!-- Input -->
          <chat-input :conversation="currentConversation"></chat-input>
        </template>
      </section>
    </div>

    <!-- Update Profile Dialog -->
    <update-profile-dialog
      :user="user"
      v-model="updateProfileDialog"
    ></update-profile-dialog>

    <!-- Update Password Dialog -->
    <update-password-dialog
      v-model="updatePasswordDialog"
    ></update-password-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import UpdateProfileDialog from '@/components/default/UpdateProfileDialog'
import UpdatePasswordDialog from '@/components/default/UpdatePasswordDialog'
import ChatInput from '@/components/default/ChatInput'

export default {
  components: {
    ChatInput,
    Sidebar,
    Navbar,
    UpdateProfileDialog,
    UpdatePasswordDialog,
  },

  data() {
    return {
      updateProfileDialog: false,
      updatePasswordDialog: false,
    }
  },

  computed: {
    ...mapState('auth', {
      loggedIn: state => state.loggedIn,
      user: state => state.user,
    }),
    ...mapGetters('conversation', {
      currentConversation: 'currentConversation',
      getConversationByReceiver: 'getByReceiverId',
    }),
    sidebarMobileActive() {
      return !this.currentConversation
    },
  },

  mounted() {
    if (this.loggedIn) {
      this.listenNewMessage()
    }
  },

  methods: {
    ...mapMutations('conversation', {
      addMessage: 'ADD_CONVERSATION_MESSAGE',
      setLastMessage: 'SET_LAST_CONVERSATION_MESSAGES',
      incrementUnreadMessages: 'INCREMENT_UNREAD_MESSAGES',
      setCurrentConversationId: 'SET_CURRENT_CONVERSATION_ID',
    }),
    ...mapActions('conversation', {
      markReadAction: 'markRead',
      getConversation: 'getConversation',
    }),
    listenNewMessage() {
      window.Echo.private(`user.${this.user.id}`).listen(
        '.newMessage',
        event => {
          const conversation = this.getConversationByReceiver(event.sender.id)
          const message = event.message
          message.sender = 'receiver'

          if (conversation) {
            if (
              !this.currentConversation ||
              (this.currentConversation &&
                parseInt(this.currentConversation.id) !==
                  parseInt(conversation.id))
            ) {
              this.incrementUnreadMessages(conversation)
            } else {
              this.markReadAction(this.currentConversation)
            }

            conversation.messages === null
              ? this.setLastMessage({
                  conversation,
                  message,
                })
              : this.addMessage({
                  conversation,
                  message,
                })
          } else {
            this.getConversation(event.sender.id).catch(err =>
              this.$toasted.show(
                err?.response?.data?.message || 'Failed to get conversation.',
                {
                  icon: 'mdi-close-circle',
                  type: 'error',
                },
              ),
            )
          }
        },
      )
    },
    hideNavbar() {
      this.setCurrentConversationId(null)
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/sass/layouts/default/app';
</style>
