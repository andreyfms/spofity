<template>
  <section class="flex-1 p-3 min-h-screen bg-gradient-to-br from-cyan-100 to-indigo-100">
    <div class="flex justify-between items-center max-w-4xl mx-auto">
      <span class="radio-list-title">Favorite Radios</span>
      <div class="search-container-list">
        <div class="search-icon">
          <svg class=".search-icon-svg" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <input type="search" v-model="searchTerm" @keyup.enter="fetchFilteredRadios" placeholder="Search stations"
          class="search-input-list">
      </div>
    </div>

    <div class="radio-list">
      <Radioitem v-for="radio in paginatedRadios" :key="radio.id" :radio="radio" @play="playRadio"
        @addFavorite="addFavorite" @removeFavorite="removeFavorite" @edit="openEditModal" class="radio-item" />
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1"
        class="pagination-btn disabled:opacity-40">Previous</button>
      <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn primary">Next</button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchRadios } from '@/services/radioApi';
import { useRadioStore } from '@/stores/radioStore';
import Radioitem from '@/components/RadioItem.vue';

const radioStore = useRadioStore();
const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const emit = defineEmits(['open-edit']);


const getSavedEdits = () => {
  const savedEdits = localStorage.getItem('radioEdits');
  return savedEdits ? JSON.parse(savedEdits) : {};
};


const mergeWithEdits = (radios, edits) => {
  return radios.map(radio => {
    if (edits[radio.id]) {
      return { ...radio, ...edits[radio.id] };
    }
    return radio;
  });
};

const fetchFilteredRadios = async () => {
  try {
    const params = searchTerm.value ? { name: searchTerm.value } : {};
    const apiRadios = await fetchRadios(params);
    const savedEdits = getSavedEdits();
    const mergedRadios = mergeWithEdits(apiRadios, savedEdits);
    radioStore.setApiRadios(mergedRadios);
    currentPage.value = 1;
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchFilteredRadios);

const orderedRadios = computed(() => radioStore.orderedAvailableRadios);
const filteredRadios = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return orderedRadios.value.filter(({ name, country, language }) =>
    [name, country, language].some(field => field?.toLowerCase().includes(term))
  );
});
const totalPages = computed(() => Math.ceil(filteredRadios.value.length / itemsPerPage));
const paginatedRadios = computed(() => filteredRadios.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage));

const playRadio = (radio) => radioStore.setCurrentRadio(radio);
const addFavorite = (radio) => radioStore.addFavorite(radio);
const removeFavorite = ({ stationuuid }) => radioStore.removeFavorite(stationuuid);
const openEditModal = (radio) => emit('open-edit', radio);
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
</script>

