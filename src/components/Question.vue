<template>
  <div class="p-4">
    <div class="mb-4">
      <h2 class="text-xl font-bold">{{ question.question }}</h2>
    </div>
    
    <div class="space-y-2">
      <button
        v-for="choice in question.choices"
        :key="choice.choice"
        @click="selectAnswer(choice)"
        :disabled="answered"
        :class="[
          'w-full p-3 text-left rounded border',
          {
            'bg-green-500 text-white': answered && choice.isCorrect,
            'bg-red-500 text-white': answered && choice === selectedChoice && !choice.isCorrect,
            'bg-white hover:bg-gray-100': !answered
          }
        ]"
      >
        {{ choice.choice }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['answer'])

const answered = ref(false)
const selectedChoice = ref(null)

function selectAnswer(choice) {
  if (answered.value) return
  
  selectedChoice.value = choice
  answered.value = true
  emit('answer', choice.isCorrect)
  
  setTimeout(() => {
    emit('next')
  }, 1000)
}
</script>
