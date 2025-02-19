<template>
  <div>
    <!-- Botão hambúrguer para mobile -->
    <button
      class="hamburger hamburger-mobile"
      @click="toggleSidebar"
      aria-label="Menu"
    >
      <div class="hamburger-icon">
        <span
          aria-hidden="true"
          class="hamburger-span hamburger-span-1"
          :class="{ 'rotate-45': isSidebarOpen, '-translate-y-1.5': !isSidebarOpen }"
        ></span>
        <span
          aria-hidden="true"
          class="hamburger-span hamburger-span-2"
          :class="{ 'opacity-0': isSidebarOpen }"
        ></span>
        <span
          aria-hidden="true"
          class="hamburger-span hamburger-span-3"
          :class="{ '-rotate-45': isSidebarOpen, 'translate-y-1.5': !isSidebarOpen }"
        ></span>
      </div>
    </button>

    <!-- Botão hambúrguer para desktop -->
    <button
      class="hamburger hamburger-desktop"
      @click="toggleSidebar"
      aria-label="Menu"
    >
      <div class="hamburger-icon">
        <span
          aria-hidden="true"
          class="hamburger-span hamburger-span-1"
          :class="{ 'rotate-45': isSidebarOpen, '-translate-y-1.5': !isSidebarOpen }"
        ></span>
        <span
          aria-hidden="true"
          class="hamburger-span hamburger-span-2"
          :class="{ 'opacity-0': isSidebarOpen }"
        ></span>
        <span
          aria-hidden="true"
          class="hamburger-span hamburger-span-3"
          :class="{ '-rotate-45': isSidebarOpen, 'translate-y-1.5': !isSidebarOpen }"
        ></span>
      </div>
    </button>

    <!-- Sidebar -->
    <transition >
      <aside
        v-show="isSidebarOpen"
        class="sidebar md:flex md:flex-col transition-discrete"
        :class="{ 'sidebar-open': isSidebarOpen, 'w-full min-w-64': !isSidebarOpen }"
      >
        <!-- Campo de busca -->
        <div class="search-container">
          <div class="search-inner">
            <div type="submit" id="searchsubmit" class="search-button">
              <svg class="h-5 w-5 focus:text-[#501462] text-[#8cf1da]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              v-model="searchTerm"
              placeholder="Search here"
              name="s"
              id="s"
              class="search-input"
            />
          </div>
        </div>

        <!-- Lista de favoritos -->
        <div class="favorites-container">
          <div class="space-y-2">
            <div
              v-for="radio in filteredFavorites"
              :key="radio.stationuuid"
              class="favorite-item"
            >
              <FavoriteItem
                :radio="radio"
                @select="handleSelect(radio)"
                @edit="openEditModal(radio)"
                @remove="removeFavorite(radio.stationuuid)"
                class="flex-1"
              />
            </div>
          </div>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRadioStore } from '@/stores/radioStore'
import FavoriteItem from '@/components/FavoriteItem.vue'

const radioStore = useRadioStore()
const searchTerm = ref('')
const isSidebarOpen = ref(false)

onMounted(() => {
  const isDesktop = window.matchMedia('(min-width: 768px)').matches
  isSidebarOpen.value = isDesktop
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const filteredFavorites = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return radioStore.favorites.filter(radio =>
    radio.name.toLowerCase().includes(term) ||
    (radio.country && radio.country.toLowerCase().includes(term)) ||
    (radio.language && radio.language.toLowerCase().includes(term))
  )
})

const handleSelect = (radio) => {
  radioStore.setCurrentRadio(radio)
  if (window.innerWidth < 768) toggleSidebar()
}

const removeFavorite = (radioId) => {
  radioStore.removeFavorite(radioId)
}

const openEditModal = (radio) => {
  emit('open-edit', radio)
}

const emit = defineEmits(['open-edit'])
</script>
