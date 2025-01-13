<template>
  <div class="carousel-container relative overflow-hidden">
    <div class="carousel-track flex transition-transform duration-500 ease-in-out"
         :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(image, index) in crewImages" :key="index" class="carousel-slide w-full flex-shrink-0">
        <img :src="image.src" :alt="image.alt" class="carousel-image mx-auto">
      </div>
    </div>
    
    <!-- Indicateurs de navigation -->
    <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
      <button v-for="(_, index) in crewImages" 
              :key="index"
              @click="goToSlide(index)"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'">
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const crewImages = [
  { src: new URL('../assets/crew-images/luffy.png', import.meta.url).href, alt: 'Luffy' },
  { src: new URL('../assets/crew-images/zoro.png', import.meta.url).href, alt: 'Zoro' },
  { src: new URL('../assets/crew-images/nami.png', import.meta.url).href, alt: 'Nami' },
  { src: new URL('../assets/crew-images/usopp.png', import.meta.url).href, alt: 'Usopp' },
  { src: new URL('../assets/crew-images/sanji.png', import.meta.url).href, alt: 'Sanji' },
  { src: new URL('../assets/crew-images/chopper.png', import.meta.url).href, alt: 'Chopper' },
  { src: new URL('../assets/crew-images/robin.png', import.meta.url).href, alt: 'Robin' },
  { src: new URL('../assets/crew-images/franky.png', import.meta.url).href, alt: 'Franky' }
]

const currentIndex = ref(0)
let autoplayInterval

const goToSlide = (index) => {
  currentIndex.value = index
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % crewImages.length
}

onMounted(() => {
  // Démarrer le défilement automatique
  autoplayInterval = setInterval(nextSlide, 3000)
})

onUnmounted(() => {
  // Nettoyer l'intervalle lors du démontage
  clearInterval(autoplayInterval)
})
</script>

<style scoped>
.carousel-container {
  width: 100%;
  height: 200px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
}

.carousel-image {
  height: 180px;
  width: auto;
  object-fit: contain;
}

@media (min-width: 640px) {
  .carousel-container {
    height: 250px;
  }
  
  .carousel-image {
    height: 230px;
  }
}
</style>
