<template>
  <div class="bg-white/5 backdrop-blur-md rounded-xl shadow-xl p-8 mb-6 transform transition-all duration-500"
       :class="{ 'scale-95 opacity-0': isTransitioning }">
    <!-- En-tête de la question -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex-1">
        <div class="text-purple-300 text-sm mb-2">Question {{ questionNumber }}/{{ totalQuestions }}</div>
        <h3 class="text-xl font-medium text-white">{{ question.question }}</h3>
      </div>
      <!-- Timer circulaire -->
      <div class="relative w-16 h-16">
        <svg class="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="rgba(255, 255, 255, 0.1)"
            stroke-width="4"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="url(#timerGradient)"
            stroke-width="4"
            fill="none"
            :stroke-dasharray="`${(timer / initialTimer) * 175.9} 175.9`"
            class="transition-all duration-1000"
          />
        </svg>
        <span class="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
          {{ timer }}
        </span>
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#8B5CF6" />
            <stop offset="100%" stop-color="#EC4899" />
          </linearGradient>
        </defs>
      </div>
    </div>
    
    <!-- Choix de réponses -->
    <div class="grid gap-4">
      <button
        v-for="(choice, index) in question.choices"
        :key="choice.choice"
        :disabled="answered"
        @click="checkAnswer(choice)"
        class="w-full text-left p-5 rounded-xl transition-all duration-300 transform hover:scale-102 relative overflow-hidden group"
        :class="[
          answered && choice === selectedChoice
            ? choice.isCorrect
              ? 'bg-green-500/30 border-2 border-green-400'
              : 'bg-red-500/30 border-2 border-red-400'
            : 'bg-white/10 hover:bg-white/20 border-2 border-transparent hover:border-purple-400',
          'text-white'
        ]"
      >
        <!-- Numéro du choix -->
        <div class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full 
                    flex items-center justify-center text-sm font-medium"
             :class="[
               answered && choice === selectedChoice
                 ? choice.isCorrect
                   ? 'bg-green-400/20 text-green-400'
                   : 'bg-red-400/20 text-red-400'
                 : 'bg-purple-400/20 text-purple-400 group-hover:bg-purple-400/30'
             ]">
          {{ ['A', 'B', 'C', 'D'][index] }}
        </div>
        
        <!-- Texte du choix -->
        <span class="ml-10">{{ choice.choice }}</span>
        
        <!-- Indicateur de réponse -->
        <div v-if="answered && choice === selectedChoice" 
             class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <span class="text-sm" :class="choice.isCorrect ? 'text-green-400' : 'text-red-400'">
            {{ choice.isCorrect ? 'Correct!' : 'Incorrect' }}
          </span>
          <svg v-if="choice.isCorrect" class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <!-- Animation de sélection -->
        <div v-if="answered && choice === selectedChoice"
             class="absolute inset-0 bg-gradient-to-r"
             :class="choice.isCorrect ? 'from-green-500/10' : 'from-red-500/10'"
        ></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  initialTimer: {
    type: Number,
    default: 30
  }
})

const emit = defineEmits(['next-question', 'update-score'])

const timer = ref(props.initialTimer)
const answered = ref(false)
const selectedChoice = ref(null)
const isTransitioning = ref(false)
let timerInterval = null

const startTimer = () => {
  timer.value = props.initialTimer
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      handleTimeout()
    }
  }, 1000)
}

const handleTimeout = () => {
  if (!answered.value) {
    answered.value = true
    transitionToNext()
  }
}

const checkAnswer = (choice) => {
  if (answered.value) return
  
  selectedChoice.value = choice
  answered.value = true
  clearInterval(timerInterval)
  
  emit('update-score', choice.isCorrect)
  transitionToNext()
}

const transitionToNext = () => {
  setTimeout(() => {
    isTransitioning.value = true
    setTimeout(() => {
      emit('next-question')
      setTimeout(() => {
        isTransitioning.value = false
      }, 100)
    }, 400)
  }, 1500)
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearInterval(timerInterval)
})

watch(() => props.question, () => {
  answered.value = false
  selectedChoice.value = null
  clearInterval(timerInterval)
  startTimer()
})
</script>

<style scoped>
.scale-102 {
  transform: scale(1.02);
}

circle {
  transition: stroke-dasharray 1s linear;
}
</style>
