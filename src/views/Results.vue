<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4" 
       :class="{ 'dark': store.theme === 'dark', 'bg-gradient-to-br from-indigo-900 to-purple-900': store.theme === 'light', 'bg-gradient-to-br from-gray-900 to-black': store.theme === 'dark' }">
    <div class="bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-xl shadow-xl max-w-2xl w-full p-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-white">Résultats du Quiz</h1>
        <button @click="store.toggleTheme" class="p-2 rounded-lg bg-white/20 text-white">
          <span v-if="store.theme === 'light'">🌙</span>
          <span v-else>☀️</span>
        </button>
      </div>
      
      <div class="space-y-8">
        <!-- Message personnalisé -->
        <div v-if="route.query.message" class="text-center mb-8">
          <p class="text-xl text-white bg-purple-600/30 dark:bg-purple-900/30 p-4 rounded-lg">
            {{ route.query.message }}
          </p>
          <p class="text-lg text-purple-300 mt-4">
            Score au niveau {{ route.query.level }}: {{ Math.round(route.query.score) }}%
          </p>
        </div>

        <!-- Scores par niveau -->
        <div class="grid gap-6">
          <div v-for="(score, level) in store.scores" :key="level" 
               class="bg-white/5 dark:bg-gray-700/5 p-6 rounded-xl backdrop-blur-sm">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-medium capitalize text-white">Niveau {{ level }}</h3>
              <span class="text-lg font-semibold text-purple-300">
                {{ Math.round((score / store.questions[level].length) * 100) }}%
              </span>
            </div>
            <!-- Barre de progression -->
            <div class="w-full bg-white/10 dark:bg-gray-600/10 rounded-full h-3 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                   :style="{ width: `${(score / store.questions[level].length) * 100}%` }"></div>
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="mt-12 flex justify-center gap-4">
          <button v-if="!canProgress"
            @click="restartLevel"
            class="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-8 rounded-xl 
                   font-semibold hover:opacity-90 transition duration-300 transform hover:scale-105"
          >
            Recommencer le niveau
          </button>
          
          <button v-if="canProgress && !route.query.completed"
            @click="nextLevel"
            class="bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-8 rounded-xl 
                   font-semibold hover:opacity-90 transition duration-300 transform hover:scale-105"
          >
            Niveau suivant
          </button>
          
          <button v-if="route.query.completed"
            @click="restartQuiz"
            class="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-xl 
                   font-semibold hover:opacity-90 transition duration-300 transform hover:scale-105"
          >
            Recommencer le Quiz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuizStore } from '../stores/quiz'

const router = useRouter()
const route = useRoute()
const store = useQuizStore()

const canProgress = computed(() => {
  const currentScore = store.scores[route.query.level]
  const totalQuestions = store.questions[route.query.level].length
  const scorePercentage = (currentScore / totalQuestions) * 100
  return scorePercentage >= 50
})

const restartLevel = () => {
  store.resetLevel()
  router.push('/quiz')
}

const nextLevel = () => {
  if (route.query.level === 'facile') {
    store.changeLevel('intermediaire')
  } else if (route.query.level === 'intermediaire') {
    store.changeLevel('difficile')
  }
  router.push('/quiz')
}

const restartQuiz = () => {
  store.$reset()
  router.push('/')
}

onMounted(() => {
  store.applyTheme()
})
</script>

<style>
.dark {
  background-color: rgb(17 24 39);
}
</style>
