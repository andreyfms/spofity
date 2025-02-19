export const getStorageItem = (key, defaultValue = null) => {
  if (typeof localStorage !== 'undefined') {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  }
  return defaultValue
}

export const setStorageItem = (key, value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
