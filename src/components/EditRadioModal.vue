<template>
  <div class="modal-container">
    <div class="modal-content">
      <h2 class="modal-title">Editar Rádio</h2>
      <form @submit.prevent="submitEdit">
        <div class="modal-form-group">
          <label class="modal-form-label">Nome</label>
          <input v-model="form.name" class="modal-form-input" required maxlength="20" />
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">País</label>
          <input v-model="form.country" class="modal-form-input" maxlength="15"/>
        </div>
        <div class="modal-form-group">
          <label class="modal-form-label">Idioma</label>
          <input v-model="form.language" class="modal-form-input" maxlength="10" />
        </div>
        <div class="modal-actions">
          <button type="button" @click="closeModal" class="btn btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn btn-save">
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRadioStore } from '@/stores/radioStore'

const props = defineProps({
  radio: Object,
})
const emit = defineEmits(['close', 'update'])
const radioStore = useRadioStore()

const form = ref({
  stationuuid: '',
  name: '',
  country: '',
  language: '',
})

watch(
  () => props.radio,
  (newRadio) => {
    if (newRadio) {
      form.value = { ...newRadio }
    }
  },
  { immediate: true }
)

const submitEdit = () => {

  emit('update', form.value)

  radioStore.updateRadio(form.value)
  closeModal()
}

const closeModal = () => {
  emit('close')
}
</script>


