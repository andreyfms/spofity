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
        <input type="search" v-model="searchList" @keyup.enter="fetchRadios2" placeholder="Search stations"
          class="search-input-list">
      </div>
    </div>

    <div class="radio-list">
      <RadioItem v-for="radio in radios" :key="radio.id" :radio="radio" class="radio-item" />
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
import { ref, onMounted, computed } from 'vue';
import { fetchRadios } from '../services/radioApi';
import RadioItem from './RadioItem.vue';

const searchList = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const radios = ref([]);
const totalItems = ref(0);

const fetchData = async () => {
  try {
    const response = await fetchRadios( {name: searchList.value});
    radios.value = response;
    totalItems.value = response.length;
  } catch (error) {
    console.error("Error fetching radios:", error);
  }
};

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData();
  }
};

const fetchRadios2 = () => {
  currentPage.value = 1;
  fetchData();
};

onMounted(fetchData);
</script>
