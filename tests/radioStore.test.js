import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRadioStore } from '@/stores/radioStore'

describe('Radio Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useRadioStore()

    store.apiRadios = []
    store.favorites = []
    store.favoritesOrder = []
    store.selectedForReorder = []
    store.currentRadio = null
  })

  it('Deve adicionar uma rádio aos favoritos', () => {
    const radio = { stationuuid: '123', name: 'Spofity' }
    store.addFavorite(radio)
    expect(store.favorites).toHaveLength(1)
    expect(store.favorites[0].name).toBe('Spofity')
  })

  it('Deve remover uma rádio dos favoritos', () => {
    const radio = { stationuuid: '123', name: 'Spofity' }
    store.addFavorite(radio)
    store.removeFavorite('123')
    expect(store.favorites).toHaveLength(0)
  })

  it('Deve definir a rádio atual ao tocar e reordenar quando parar', () => {
    const radio = { stationuuid: '123', name: 'Spofity' }
    store.setCurrentRadio(radio)
    expect(store.currentRadio).toEqual(radio)
    store.setCurrentRadio(null)
    expect(store.currentRadio).toBeNull()
  })
})
