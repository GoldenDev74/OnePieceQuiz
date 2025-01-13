<template>
  <svg v-if="name === 'luffy'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="crew-svg">
    <!-- Chapeau de paille -->
    <circle cx="50" cy="50" r="40" fill="#FFD700"/>
    <rect x="30" y="45" width="40" height="10" fill="#8B4513"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="#8B4513" stroke-width="2"/>
  </svg>

  <svg v-else-if="name === 'zoro'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="crew-svg">
    <!-- Trois sabres -->
    <line x1="30" y1="30" x2="70" y2="70" stroke="#silver" stroke-width="4"/>
    <line x1="40" y1="30" x2="80" y2="70" stroke="#silver" stroke-width="4"/>
    <line x1="50" y1="30" x2="90" y2="70" stroke="#silver" stroke-width="4"/>
  </svg>

  <svg v-else-if="name === 'nami'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="crew-svg">
    <!-- Bâton climatique -->
    <path d="M30 70 Q50 20 70 70" fill="none" stroke="#4169E1" stroke-width="4"/>
    <circle cx="50" cy="30" r="10" fill="#87CEEB"/>
  </svg>

  <svg v-else-if="name === 'usopp'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="crew-svg">
    <!-- Lance-pierre -->
    <path d="M40 60 L50 40 L60 60" fill="none" stroke="#8B4513" stroke-width="4"/>
    <line x1="50" y1="40" x2="50" y2="70" stroke="#8B4513" stroke-width="4"/>
  </svg>

  <svg v-else-if="name === 'sanji'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="crew-svg">
    <!-- Jambe en feu -->
    <path d="M30 50 Q50 20 70 50" fill="none" stroke="#FF4500" stroke-width="4"/>
    <path d="M40 60 Q50 30 60 60" fill="none" stroke="#FF0000" stroke-width="4"/>
  </svg>

  <svg v-else-if="name === 'chopper'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="crew-svg">
    <!-- Chapeau avec croix -->
    <circle cx="50" cy="50" r="30" fill="#FF69B4"/>
    <rect x="45" y="20" width="10" height="30" fill="white"/>
    <rect x="35" y="30" width="30" height="10" fill="white"/>
  </svg>

  <svg v-else-if="name === 'robin'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="crew-svg">
    <!-- Fleur -->
    <circle cx="50" cy="50" r="20" fill="#800080"/>
    <circle cx="50" cy="30" r="10" fill="#DA70D6"/>
    <circle cx="70" cy="50" r="10" fill="#DA70D6"/>
    <circle cx="50" cy="70" r="10" fill="#DA70D6"/>
    <circle cx="30" cy="50" r="10" fill="#DA70D6"/>
  </svg>

  <svg v-else-if="name === 'franky'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="crew-svg">
    <!-- Étoile mécanique -->
    <path d="M50 20 L60 40 L80 40 L65 55 L70 75 L50 65 L30 75 L35 55 L20 40 L40 40 Z" fill="#4682B4"/>
  </svg>

  <svg v-else-if="name === 'brook'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="crew-svg">
    <!-- Crâne avec afro -->
    <circle cx="50" cy="50" r="30" fill="white"/>
    <circle cx="50" cy="50" r="40" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="40" cy="45" r="5" fill="black"/>
    <circle cx="60" cy="45" r="5" fill="black"/>
  </svg>

  <svg v-else-if="name === 'jinbe'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="crew-svg">
    <!-- Vague -->
    <path d="M20 50 Q35 30 50 50 Q65 70 80 50" fill="none" stroke="#0000CD" stroke-width="4"/>
    <path d="M20 60 Q35 40 50 60 Q65 80 80 60" fill="none" stroke="#4169E1" stroke-width="4"/>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.crew-svg {
  width: 100%;
  height: 100%;
  max-width: 150px;
  transition: transform 0.3s ease;
}

.crew-svg:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .crew-svg {
    max-width: 100px;
  }
}

@media (max-width: 640px) {
  .crew-svg {
    max-width: 80px;
  }
}
</style>
