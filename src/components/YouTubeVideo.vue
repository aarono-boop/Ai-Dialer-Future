<template>
  <div class="youtube-video-container" style="margin: 16px 0;">
    <iframe
      :src="embedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      style="width: 100%; height: 315px; border-radius: 8px;"
      :title="title || 'Coach Introduction Video'"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Define props
const props = defineProps<{
  videoId: string
  autoplay?: boolean
  title?: string
}>()

// Convert YouTube URL to embed URL with autoplay
const embedUrl = computed(() => {
  const baseUrl = `https://www.youtube.com/embed/${props.videoId}`
  const params = new URLSearchParams()
  
  if (props.autoplay) {
    params.append('autoplay', '1')
    params.append('mute', '1') // Required for autoplay to work in most browsers
  }
  
  // Add other recommended parameters for better embedded experience
  params.append('rel', '0') // Don't show related videos from other channels
  params.append('modestbranding', '1') // Use modest branding
  
  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
})
</script>

<style scoped>
.youtube-video-container {
  position: relative;
  width: 100%;
}

/* Responsive video container */
@media (max-width: 768px) {
  .youtube-video-container iframe {
    height: 200px;
  }
}
</style>
