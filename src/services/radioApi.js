import axios from 'axios'

const API_URL = 'https://de1.api.radio-browser.info/json/stations/search'

export const fetchRadios = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        limit: 10,
        ...params,
      },
    })
    return response.data.map(radio => ({
      ...radio,
      id: radio.stationuuid,
    }))
  } catch (error) {
    console.error("Erro ao buscar rádios:", error)
    throw error
  }
}
