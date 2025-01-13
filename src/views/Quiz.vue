<template>
  <div class="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-indigo-900 to-purple-900">
    <!-- Titre principal -->
    <h1 class="text-4xl font-black text-white mb-8">Quiz One Piece</h1>

    <div class="w-full max-w-7xl flex">
      <!-- Images gauche -->
      <div class="hidden md:grid grid-cols-2 gap-4 w-2/7 content-center">
        <div class="crew-container">
          <img src="@/assets/crew-images/luffy.png" alt="Luffy" class="crew-image" />
        </div>
        <div class="crew-container">
          <img src="@/assets/crew-images/zoro.png" alt="Zoro" class="crew-image" />
        </div>
        <div class="crew-container">
          <img src="@/assets/crew-images/nami.png" alt="Nami" class="crew-image" />
        </div>
        <div class="crew-container">
          <img src="@/assets/crew-images/usopp.png" alt="Usopp" class="crew-image" />
        </div>
      </div>

      <!-- Quiz -->
      <div class="w-full md:w-3/7 px-6">
        <!-- En-tête avec niveau -->
        <div class="bg-gray-800/90 rounded-lg shadow-lg p-6 mb-4">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-extrabold text-white uppercase tracking-wider">
              NIVEAU: {{ store.currentLevel === 'facile' ? 'FACILE' : 
                        store.currentLevel === 'intermediaire' ? 'INTERMÉDIAIRE' : 'DIFFICILE' }}
            </h2>
            <div class="flex items-center gap-4">
              <span class="text-xl font-bold text-white">{{ timer }}s</span>
              <button @click="store.toggleTheme" class="p-2 rounded-lg bg-gray-700 text-white">
                <span v-if="store.theme === 'light'">🌙</span>
                <span v-else>☀️</span>
              </button>
            </div>
          </div>
          
          <!-- Barre de progression -->
          <div class="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                 :style="{ width: `${progress}%` }"></div>
          </div>
        </div>

        <!-- Question -->
        <div v-if="currentQuestion" class="bg-gray-800/90 rounded-lg shadow-lg p-8">
          <h3 class="text-xl font-semibold mb-6 text-white">{{ currentQuestion.question }}</h3>
          
          <div class="space-y-3">
            <button
              v-for="choice in currentQuestion.choices"
              :key="choice.choice"
              @click="checkAnswer(choice)"
              :disabled="answered"
              class="w-full text-left p-4 rounded-lg border transition-all duration-200 text-white"
              :class="[
                answered && choice === selectedChoice
                  ? choice.isCorrect
                    ? 'bg-green-600/50 border-green-500'
                    : 'bg-red-600/50 border-red-500'
                  : 'bg-gray-700/50 hover:bg-gray-600/50 border-gray-600'
              ]"
            >
              {{ choice.choice }}
            </button>
          </div>
        </div>
      </div>

      <!-- Images droite -->
      <div class="hidden md:grid grid-cols-2 gap-4 w-2/7 content-center">
        <div class="crew-container">
          <img src="@/assets/crew-images/sanji.png" alt="Sanji" class="crew-image" />
        </div>
        <div class="crew-container">
          <img src="@/assets/crew-images/chopper.png" alt="Chopper" class="crew-image" />
        </div>
        <div class="crew-container">
          <img src="@/assets/crew-images/robin.png" alt="Robin" class="crew-image" />
        </div>
        <div class="crew-container">
          <img src="@/assets/crew-images/franky.png" alt="Franky" class="crew-image" />
        </div>
      </div>
    </div>

    <!-- Images version mobile -->
    <div class="grid md:hidden grid-cols-4 gap-4 mt-8">
      <img src="@/assets/crew-images/luffy.png" alt="Luffy" class="crew-image-mobile" />
      <img src="@/assets/crew-images/zoro.png" alt="Zoro" class="crew-image-mobile" />
      <img src="@/assets/crew-images/nami.png" alt="Nami" class="crew-image-mobile" />
      <img src="@/assets/crew-images/usopp.png" alt="Usopp" class="crew-image-mobile" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'
import confetti from 'canvas-confetti'

const router = useRouter()
const store = useQuizStore()
const timer = ref(30)
const answered = ref(false)
const selectedChoice = ref(null)
let timerInterval

const currentQuestion = computed(() => {
  if (!store.questions[store.currentLevel] || store.questions[store.currentLevel].length === 0) {
    return null
  }
  return store.questions[store.currentLevel][store.currentQuestion]
})

const progress = computed(() => {
  const questions = store.questions[store.currentLevel]
  if (!questions || questions.length === 0) return 0
  return (store.currentQuestion / questions.length) * 100
})

function startTimer() {
  timer.value = 30
  clearInterval(timerInterval)
  
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      nextQuestion()
    }
  }, 1000)
}

function checkAnswer(choice) {
  if (answered.value) return
  
  selectedChoice.value = choice
  answered.value = true
  clearInterval(timerInterval)
  
  if (choice.isCorrect) {
    store.updateScore(store.currentLevel, true)
  }
  
  setTimeout(() => {
    nextQuestion()
  }, 1500)
}

function nextQuestion() {
  answered.value = false
  selectedChoice.value = null
  
  if (store.currentQuestion < store.questions[store.currentLevel].length - 1) {
    store.nextQuestion()
    startTimer()
  } else {
    finishLevel()
  }
}

async function finishLevel() {
  const scorePercentage = (store.scores[store.currentLevel] / store.questions[store.currentLevel].length) * 100
  
  await store.savePlayerScore()
  
  if (store.currentLevel === 'facile') {
    if (scorePercentage >= 50) {
      router.push({
        path: '/results',
        query: {
          message: 'Bravo ! Vous pouvez passer au niveau intermédiaire !',
          score: scorePercentage,
          level: store.currentLevel,
          canProgress: true
        }
      })
    } else {
      router.push({
        path: '/results',
        query: {
          message: 'Vous devez obtenir au moins 50% pour passer au niveau intermédiaire.',
          score: scorePercentage,
          level: store.currentLevel,
          canProgress: false
        }
      })
    }
  } else if (store.currentLevel === 'intermediaire') {
    if (scorePercentage >= 50) {
      router.push({
        path: '/results',
        query: {
          message: 'Excellent ! Vous pouvez passer au niveau difficile !',
          score: scorePercentage,
          level: store.currentLevel,
          canProgress: true
        }
      })
    } else {
      router.push({
        path: '/results',
        query: {
          message: 'Vous devez obtenir au moins 50% pour passer au niveau difficile.',
          score: scorePercentage,
          level: store.currentLevel,
          canProgress: false
        }
      })
    }
  } else {
    if (scorePercentage >= 50) {
      launchFireworks()
      router.push({
        path: '/results',
        query: {
          message: 'Félicitations ! Vous avez terminé tous les niveaux avec succès !',
          score: scorePercentage,
          level: store.currentLevel,
          completed: true
        }
      })
    } else {
      router.push({
        path: '/results',
        query: {
          message: 'Vous avez terminé le niveau difficile.',
          score: scorePercentage,
          level: store.currentLevel,
          canProgress: false
        }
      })
    }
  }
}

function launchFireworks() {
  const duration = 5 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    })
  }, 250)
}

onMounted(() => {
  store.initializeQuestions()
  store.applyTheme()
  startTimer()
})

onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>

<style scoped>
.crew-container {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 0.5rem;
  padding: 0.5rem;
  transition: transform 0.3s ease;
}

.crew-container:hover {
  transform: scale(1.05);
}

.crew-image {
  width:250px;
  height: 250px;
  object-fit: contain;
  border-radius: 0.25rem;
}

.crew-image-mobile {
  width: 80%;
  aspect-ratio: 1;
  border-radius: 0.5rem;
  object-fit: contain;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .crew-container {
    padding: 0.25rem;
  }
  
  .crew-image {
    width: 90%;
    height: 90%;
  }
}
</style>
