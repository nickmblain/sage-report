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
        class="absolute bottom-20 right-0 w-96 max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-charcoal-100 overflow-hidden flex flex-col"
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
        <div ref="messagesContainer" class="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-cream-50">
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

    <!-- Floating Action Button with Blob -->
    <button
      @click="isOpen = !isOpen"
      class="group relative w-20 h-20 transition-all duration-300 hover:scale-105"
    >
      <!-- Animated Blob Background -->
      <svg
        class="absolute inset-0 w-full h-full drop-shadow-lg"
        :class="{ 'blob-morph': !isOpen }"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          :fill="isOpen ? '#4a4a4a' : '#177D83'"
          class="transition-colors duration-300"
          d="M43.3,-49.4C58.7,-38.6,75.8,-27.5,76.8,-14.6C77.8,-1.7,62.8,12.9,52.3,29.3C41.8,45.8,35.9,64,23.2,72.5C10.5,81,-9,79.6,-23.7,71.5C-38.4,63.4,-48.3,48.5,-51.8,34C-55.3,19.5,-52.4,5.4,-49.8,-8.8C-47.3,-22.9,-45.2,-37.1,-37,-49.3C-28.7,-61.4,-14.4,-71.4,-0.2,-71.2C13.9,-70.9,27.8,-60.3,43.3,-49.4Z"
          transform="translate(100 100)"
        />
      </svg>

      <!-- Icon -->
      <div class="absolute inset-0 flex items-center justify-center z-10">
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 rotate-90 scale-50"
          enter-to-class="opacity-100 rotate-0 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 rotate-0 scale-100"
          leave-to-class="opacity-0 -rotate-90 scale-50"
          mode="out-in"
        >
          <svg v-if="isOpen" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
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

/* Blob morphing animation */
@keyframes blob-morph {
  0%, 100% {
    d: path("M43.3,-49.4C58.7,-38.6,75.8,-27.5,76.8,-14.6C77.8,-1.7,62.8,12.9,52.3,29.3C41.8,45.8,35.9,64,23.2,72.5C10.5,81,-9,79.6,-23.7,71.5C-38.4,63.4,-48.3,48.5,-51.8,34C-55.3,19.5,-52.4,5.4,-49.8,-8.8C-47.3,-22.9,-45.2,-37.1,-37,-49.3C-28.7,-61.4,-14.4,-71.4,-0.2,-71.2C13.9,-70.9,27.8,-60.3,43.3,-49.4Z");
  }
  25% {
    d: path("M39.5,-47.7C52.9,-36.5,66.6,-26.2,71.6,-12.3C76.6,1.6,72.9,19.2,63.6,32.6C54.3,46,39.4,55.2,23.7,60.8C8,66.4,-8.5,68.4,-23.2,63.4C-37.9,58.4,-50.8,46.4,-58.2,31.8C-65.6,17.2,-67.5,0,-63.5,-14.8C-59.5,-29.6,-49.6,-42,-37.3,-53.4C-25,-64.8,-10.3,-75.2,1.9,-77.5C14.1,-79.8,26.1,-58.9,39.5,-47.7Z");
  }
  50% {
    d: path("M44.7,-52.5C57.4,-42.9,66.5,-28.5,69.3,-13C72.1,2.5,68.6,19.1,60.1,32.8C51.6,46.5,38.1,57.3,22.8,63.1C7.5,68.9,-9.6,69.7,-25.2,64.1C-40.8,58.5,-54.9,46.5,-62.1,31.4C-69.3,16.3,-69.6,-1.9,-64.4,-18.1C-59.2,-34.3,-48.5,-48.5,-35.4,-58C-22.3,-67.5,-6.8,-72.3,5.6,-78.8C18,-85.3,32,-62.1,44.7,-52.5Z");
  }
  75% {
    d: path("M41.9,-49.2C54.1,-39.5,63.7,-26.3,67.7,-11.2C71.7,3.9,70.1,20.9,62,34.2C53.9,47.5,39.3,57.1,23.5,62.2C7.7,67.3,-9.3,67.9,-24.7,62.7C-40.1,57.5,-53.9,46.5,-61.4,32.3C-68.9,18.1,-70.1,0.7,-66.1,-15.4C-62.1,-31.5,-52.9,-46.3,-40.5,-55.9C-28.1,-65.5,-12.5,-69.9,1.3,-71.5C15.1,-73.1,29.7,-58.9,41.9,-49.2Z");
  }
}

.blob-morph path {
  animation: blob-morph 10s ease-in-out infinite;
}
</style>
