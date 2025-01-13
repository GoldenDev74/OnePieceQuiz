<template>
  <div class="w-full bg-gray-200 rounded-full h-2.5">
    <div 
      class="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  progress: {
    type: Number,
    required: true
  }
})
</script>
