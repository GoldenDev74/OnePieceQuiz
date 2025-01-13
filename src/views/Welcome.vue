<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900"
       :class="{ 'dark': store.theme === 'dark' }">
    <div class="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl max-w-md w-full">
      <div class="flex justify-between items-center mb-8">
        <div class="text-center flex-1">
          <h1 class="text-4xl font-bold text-white mb-2">Quiz Otaku</h1>
          <p class="text-purple-300">Testez vos connaissances sur One Piece !</p>
        </div>
        <button @click="store.toggleTheme" class="p-2 rounded-lg bg-white/20 text-white">
          <span v-if="store.theme === 'light'">🌙</span>
          <span v-else>☀️</span>
        </button>
      </div>
      
      <form @submit.prevent="startQuiz" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-purple-300 mb-2">Votre nom</label>
          <input 
            type="text" 
            id="name" 
            v-model="username" 
            required
            class="w-full px-4 py-3 rounded-xl bg-white/5 border-2 border-purple-500/30 focus:border-purple-500 
                   text-white placeholder-purple-300 focus:ring-0 focus:outline-none"
            placeholder="Entrez votre nom"
          >
        </div>
        
        <button 
          type="submit"
          class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl
                 font-semibold hover:opacity-90 transition duration-300 transform hover:scale-105"
        >
          Commencer le Quiz
        </button>
      </form>
      
      <div class="mt-8 text-center">
        <p class="text-purple-300 text-sm">
          3 niveaux de difficulté • 30 secondes par question • Score global
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'

const router = useRouter()
const store = useQuizStore()
const username = ref('')

const startQuiz = () => {
  store.username = username.value
  store.initializeQuestions()
  router.push('/quiz')
}

onMounted(() => {
  store.applyTheme()
})
</script>

<style>
.dark {
  @apply bg-gray-900;
}
</style>
