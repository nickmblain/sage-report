<script setup lang="ts">
import { ref, nextTick } from 'vue'

const isOpen = ref(false)
const input = ref('')
const isTyping = ref(false)
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([
  {
    role: 'assistant',
    content: "Hi! I'm Sage, your AI assistant. I can help you with generating reports, understanding student progress, or answering questions about the platform. How can I help you today?"
  }
])

const messagesContainer = ref<HTMLElement | null>(null)

const suggestions = [
  'How do I generate a report?',
  'What report types are available?',
  'Help me write feedback for a student'
]

const mockResponses: Record<string, string> = {
  'how do i generate a report': "To generate a report:\n\n1. Click **New Report** in the sidebar\n2. Select a student from your roster\n3. Choose the report type (Progress, Behavioral, Academic, or IEP)\n4. Select the reporting period\n5. Optionally add strengths and areas for growth\n6. Click **Generate Report**\n\nThe AI will create a personalized report in seconds!",
  'what report types are available': "Sage Report supports four report types:\n\n**Progress Report** - General academic and social progress updates\n\n**Behavioral Report** - Focuses on classroom behavior and social skills\n\n**Academic Report** - Detailed academic performance across subjects\n\n**IEP Progress** - Tracks Individualized Education Program goals\n\nEach type uses AI to generate appropriate content based on the student and your notes.",
  'help me write feedback': "I'd be happy to help! Here are some tips for effective student feedback:\n\n**Be Specific** - Instead of \"good job,\" say \"Your analysis of the character's motivations showed deep understanding.\"\n\n**Balance Positives & Growth Areas** - Start with strengths, then address areas for improvement.\n\n**Use Action Words** - \"Continue practicing...\" or \"Try focusing on...\"\n\nWould you like me to help draft feedback for a specific student?",
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

async function sendMessage(text?: string) {
  const messageText = text || input.value.trim()
  if (!messageText) return

  messages.value.push({ role: 'user', content: messageText })
  input.value = ''
  scrollToBottom()

  isTyping.value = true

  // Simulate AI thinking
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))

  // Find a matching response or use default
  const lowerText = messageText.toLowerCase()
  let response = "I understand you're asking about that. Let me help!\n\nAs an AI assistant for Sage Report, I can help you:\n- Generate student reports\n- Understand different report types\n- Draft personalized feedback\n- Navigate the platform\n\nCould you tell me more about what you need?"

  for (const [key, value] of Object.entries(mockResponses)) {
    if (lowerText.includes(key) || key.split(' ').some(word => lowerText.includes(word) && word.length > 4)) {
      response = value
      break
    }
  }

  isTyping.value = false
  messages.value.push({ role: 'assistant', content: response })
  scrollToBottom()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <!-- Floating Button -->
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-20 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-charcoal-100 overflow-hidden"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-sage-600 to-sage-500 p-4">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-sage-600"></span>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-white">Sage Assistant</h3>
              <p class="text-sage-100 text-xs">AI-powered help</p>
            </div>
            <button
              @click="isOpen = false"
              class="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="h-80 overflow-y-auto p-4 space-y-4 bg-cream-50">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="message.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
          >
            <div
              :class="[
                'max-w-[85%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-sage-500 text-white rounded-br-md'
                  : 'bg-white border border-charcoal-100 text-charcoal-700 rounded-bl-md shadow-sm'
              ]"
            >
              <p class="text-sm whitespace-pre-wrap" v-html="message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')"></p>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-white border border-charcoal-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div class="flex gap-1.5">
                <span class="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Suggestions -->
        <div v-if="messages.length === 1" class="px-4 pb-2 bg-cream-50">
          <p class="text-xs text-charcoal-500 mb-2">Suggestions:</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion"
              @click="sendMessage(suggestion)"
              class="text-xs bg-white border border-charcoal-200 text-charcoal-600 px-3 py-1.5 rounded-full hover:border-sage-300 hover:bg-sage-50 transition-colors"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 border-t border-charcoal-100 bg-white">
          <div class="flex gap-2">
            <input
              v-model="input"
              @keydown="handleKeydown"
              type="text"
              placeholder="Ask Sage anything..."
              class="flex-1 px-4 py-2.5 bg-cream-50 border border-charcoal-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
            <button
              @click="sendMessage()"
              :disabled="!input.trim() || isTyping"
              class="px-4 py-2.5 bg-sage-500 text-white rounded-xl hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Floating Action Button -->
    <button
      @click="isOpen = !isOpen"
      class="group relative w-14 h-14 rounded-full shadow-lg transition-all duration-300"
      :class="isOpen ? 'bg-charcoal-700 rotate-0' : 'bg-gradient-to-br from-sage-500 to-sage-600 hover:shadow-xl hover:scale-105'"
    >
      <!-- Animated rings when closed -->
      <div v-if="!isOpen" class="absolute inset-0 rounded-full">
        <span class="absolute inset-0 rounded-full bg-sage-400 animate-ping opacity-20"></span>
        <span class="absolute inset-[-4px] rounded-full border-2 border-sage-300/50 animate-pulse"></span>
      </div>

      <!-- Sparkle effects -->
      <div v-if="!isOpen" class="absolute inset-0 overflow-hidden rounded-full">
        <span class="absolute top-1 right-2 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style="animation-delay: 0s"></span>
        <span class="absolute bottom-3 left-2 w-1 h-1 bg-white/40 rounded-full animate-pulse" style="animation-delay: 0.5s"></span>
        <span class="absolute top-4 left-3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style="animation-delay: 1s"></span>
      </div>

      <!-- Icon -->
      <div class="relative z-10 flex items-center justify-center">
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 rotate-90 scale-50"
          enter-to-class="opacity-100 rotate-0 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 rotate-0 scale-100"
          leave-to-class="opacity-0 -rotate-90 scale-50"
          mode="out-in"
        >
          <svg v-if="isOpen" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </Transition>
      </div>

      <!-- Tooltip -->
      <span
        v-if="!isOpen"
        class="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-charcoal-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      >
        Ask Sage AI
        <span class="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-charcoal-800"></span>
      </span>
    </button>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 0.6s infinite;
}
</style>
