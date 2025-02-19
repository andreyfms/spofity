<template>
  <div class="radio-container">
    <div class="radio-inner" @click="toggleSelection(radio.stationuuid)">
      <h4 class="radio-title">{{ radio.name }}</h4>
      <div class="checkbox-wrapper" data-ripple-dark="true">
        <input
          type="checkbox"
          :checked="isSelected(radio)"
          class="custom-checkbox peer"
        />
        <div class="checkbox-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                        stroke="currentColor" stroke-width="1">
                        <path fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"></path>
                    </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRadioStore } from '@/stores/radioStore'

defineProps({
  radio: Object,
})

const radioStore = useRadioStore()

const toggleSelection = (radioId) => {
  radioStore.toggleFavoriteSelection(radioId)
}

const isSelected = (radio) =>
  radioStore.selectedForReorder.includes(radio.stationuuid)
</script>

