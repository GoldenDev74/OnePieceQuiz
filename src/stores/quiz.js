import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import facileQuestions from '../assets/facile.json'
import intermediaireQuestions from '../assets/intermediaire.json'
import difficileQuestions from '../assets/difficile.json'

export const useQuizStore = defineStore('quiz', () => {
  const currentLevel = ref('facile')
  const currentQuestion = ref(0)
  const scores = ref({
    facile: 0,
    intermediaire: 0,
    difficile: 0
  })
  const username = ref('')
  const theme = ref(localStorage.getItem('theme') || 'light')
  
  const questions = ref({
    facile: [],
    intermediaire: [],
    difficile: []
  })

  const canAccessLevel = computed(() => {
    const scorePercentage = (scores.value[currentLevel.value] / questions.value[currentLevel.value].length) * 100
    return {
      intermediaire: scorePercentage >= 50,
      difficile: scorePercentage >= 50 && scores.value.intermediaire > 0
    }
  })

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
  }

  function initializeQuestions() {
    questions.value = {
      facile: facileQuestions.quiz.questions.map(q => ({
        ...q,
        choices: shuffleArray([...q.choices].map(choice => ({
          choice: choice.choice,
          isCorrect: choice.isCorrect
        })))
      })),
      intermediaire: intermediaireQuestions.quiz.questions.map(q => ({
        ...q,
        choices: shuffleArray([...q.choices].map(choice => ({
          choice: choice.choice,
          isCorrect: choice.isCorrect
        })))
      })),
      difficile: difficileQuestions.quiz.questions.map(q => ({
        ...q,
        choices: shuffleArray([...q.choices].map(choice => ({
          choice: choice.choice,
          isCorrect: choice.isCorrect
        })))
      }))
    }
  }

  function nextQuestion() {
    currentQuestion.value++
  }

  function updateScore(level, isCorrect) {
    if (isCorrect) {
      scores.value[level]++
    }
  }

  function changeLevel(level) {
    currentLevel.value = level
    currentQuestion.value = 0
    // Mélanger à nouveau les choix pour le nouveau niveau
    questions.value[level] = questions.value[level].map(q => ({
      ...q,
      choices: shuffleArray([...q.choices])
    }))
  }

  function savePlayerScore() {
    const playerScore = {
      name: username.value,
      date: new Date().toISOString(),
      scores: { ...scores.value }
    }
    
    // Sauvegarder dans le localStorage
    const savedScores = JSON.parse(localStorage.getItem('playerScores') || '[]')
    savedScores.push(playerScore)
    
    // Trier par score total décroissant
    savedScores.sort((a, b) => {
      const totalA = Object.values(a.scores).reduce((sum, score) => sum + score, 0)
      const totalB = Object.values(b.scores).reduce((sum, score) => sum + score, 0)
      return totalB - totalA
    })
    
    localStorage.setItem('playerScores', JSON.stringify(savedScores))
  }

  function resetLevel() {
    scores.value[currentLevel.value] = 0
    currentQuestion.value = 0
    if (currentLevel.value !== 'facile') {
      changeLevel('facile')
    } else {
      // Mélanger à nouveau les choix pour le même niveau
      questions.value[currentLevel.value] = questions.value[currentLevel.value].map(q => ({
        ...q,
        choices: shuffleArray([...q.choices])
      }))
    }
  }

  return {
    currentLevel,
    currentQuestion,
    scores,
    username,
    theme,
    questions,
    canAccessLevel,
    toggleTheme,
    applyTheme,
    initializeQuestions,
    nextQuestion,
    updateScore,
    changeLevel,
    savePlayerScore,
    resetLevel
  }
})
