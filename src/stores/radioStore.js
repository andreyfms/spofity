import { defineStore } from 'pinia'
import { getStorageItem, setStorageItem } from '@/utils/storage'

export const useRadioStore = defineStore('radio', {
  state: () => ({
    apiRadios: getStorageItem('apiRadios', []),
    favorites: getStorageItem('favorites', []),
    favoritesOrder: getStorageItem('favoritesOrder', []),
    selectedForReorder: [],
    currentRadio: null,
    editedRadios: getStorageItem('editedRadios', {})
  }),
  actions: {
    addFavorite(radio) {
      const id = radio.stationuuid
      if (!this.favorites.some(r => r.stationuuid === id)) {
        this.favorites.push({ ...radio })
        this.favoritesOrder.push(id)
        this.saveFavorites()
      }
    },
    removeFavorite(radioId) {
      this.favorites = this.favorites.filter(r => r.stationuuid !== radioId)
      this.favoritesOrder = this.favoritesOrder.filter(id => id !== radioId)
      this.selectedForReorder = this.selectedForReorder.filter(id => id !== radioId)
      this.saveFavorites()
    },
    updateRadio(updatedRadio) {

      this.apiRadios = this.apiRadios.map(r =>
        r.stationuuid === updatedRadio.stationuuid ? updatedRadio : r
      )
      setStorageItem('apiRadios', this.apiRadios)


      this.favorites = this.favorites.map(r =>
        r.stationuuid === updatedRadio.stationuuid ? updatedRadio : r
      )

      if (this.currentRadio && this.currentRadio.stationuuid === updatedRadio.stationuuid) {
        this.currentRadio = updatedRadio
      }

      this.editedRadios[updatedRadio.stationuuid] = updatedRadio
      setStorageItem('editedRadios', this.editedRadios)
      this.saveFavorites()
    },
    setCurrentRadio(radio) {
      this.currentRadio = radio
    },
    setApiRadios(radios) {

      this.apiRadios = radios.map(radio => {
        return this.editedRadios[radio.stationuuid]
          ? this.editedRadios[radio.stationuuid]
          : radio
      })
      setStorageItem('apiRadios', this.apiRadios)
    },
    toggleFavoriteSelection(radioId) {
      if (this.selectedForReorder.includes(radioId)) {
        this.selectedForReorder = this.selectedForReorder.filter(id => id !== radioId)
      } else {
        this.selectedForReorder.push(radioId)
      }
    },
    saveFavorites() {
      setStorageItem('favorites', this.favorites)
      setStorageItem('favoritesOrder', this.favoritesOrder)
    }
  },
  getters: {
    orderedAvailableRadios(state) {

      let sortedRadios = [...state.apiRadios].sort((a, b) => a.name.localeCompare(b.name))


      if (state.currentRadio) {
        sortedRadios = sortedRadios.filter(radio => radio.stationuuid !== state.currentRadio.stationuuid)
      }


      let ordered = state.currentRadio ? [state.currentRadio] : []


      const selectedFavs = sortedRadios.filter(radio =>
        state.selectedForReorder.includes(radio.stationuuid)
      )
      selectedFavs.sort((a, b) =>
        state.selectedForReorder.indexOf(a.stationuuid) - state.selectedForReorder.indexOf(b.stationuuid)
      )


      const remaining = sortedRadios.filter(radio =>
        !state.selectedForReorder.includes(radio.stationuuid)
      )

      return ordered.concat(selectedFavs, remaining)
    }
  }
})
