<template>
  <div class="api-radio-item">
    <div v-if="isPlayingCard" class="badge">
      Current radio
    </div>
    <div class="radio-info">
      <button
        @click.stop="handlePlayStop"
        :disabled="isLoading"
        :class="['play-button transition-all duration-300 ease-in-out', playButtonClass]"
      >
        <span v-if="isLoading">
          <svg class="animate-spin h-5 w-5 inline-block mx-auto" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </span>
        <span v-else>
          {{ isPlayingCard ? 'Stop' : 'Play' }}
        </span>
      </button>
      <h3 class="title-radio-item">{{ displayedRadio.name }}</h3>
      <p class="subtext">
        {{ displayedRadio.country || '-' }} • {{ displayedRadio.language || '-' }}
      </p>
    </div>
    <div class="radio-actions">
      <button @click.stop="$emit('edit', displayedRadio)" class="action-btn edit-btn">
        <!-- Ícone de edição -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button v-if="!isFavorite" @click.stop="$emit('addFavorite', displayedRadio)" class="action-btn add-favorite-btn">
        <!-- Ícone para adicionar favorito -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
          <path fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clip-rule="evenodd" />
        </svg>
      </button>
      <button v-else @click.stop="$emit('removeFavorite', displayedRadio)" class="action-btn remove-favorite-btn">
        <!-- Ícone para remover favorito -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRadioStore } from '@/stores/radioStore'
import useAudioManager from '@/composables/audioManager'

const props = defineProps({
  radio: Object,
})

const radioStore = useRadioStore()
const { isPlaying, play, pause, stop } = useAudioManager();
const isLoading = ref(false)

const displayedRadio = computed(() => {
  return radioStore.editedRadios[props.radio.stationuuid] || props.radio
})

const isPlayingCard = computed(() => {
  return (
    radioStore.currentRadio &&
    radioStore.currentRadio.stationuuid === displayedRadio.value.stationuuid &&
    isPlaying.value
  )
})

const playButtonClass = computed(() => {
  if (isLoading.value) {
    return 'bg-yellow-500 transform scale-105'
  }
  return isPlayingCard.value ? 'bg-red-500' : 'bg-green-500'
})

const isFavorite = computed(() =>
  radioStore.favorites.some(r => r.stationuuid === displayedRadio.value.stationuuid)
)

const handlePlayStop = () => {
  if (!isPlayingCard.value) {
    const previousRadio = radioStore.currentRadio
    if (previousRadio) {
      stop()
    }
    radioStore.setCurrentRadio(displayedRadio.value)
    isLoading.value = true
    play(displayedRadio.value.url_resolved, previousRadio ? previousRadio.url_resolved : null)
      .then(() => {
        isLoading.value = false
      })
      .catch(error => {
        isLoading.value = false
        alert("Desculpe, esta rádio não é suportada.", error)
        stop()
        if (previousRadio) {
          radioStore.setCurrentRadio(previousRadio)
          play(previousRadio.url_resolved).catch(err => {
            console.error("Erro ao tentar restaurar a estação anterior:", err)
          })
        } else {
          radioStore.setCurrentRadio(null)
        }
      })
  } else {
    pause()
    radioStore.setCurrentRadio(null)
  }
}
</script>
