<template>
  <div>
    <div class="sidebar-home">

      <Sidebar @open-edit="openEditModal" />

      <div class="home">
        <h1 class="home-title">Spofity</h1>
        <RadioList @open-edit="openEditModal" />
      </div>
    </div>

    <EditRadioModal
      v-if="showEditModal"
      :radio="radioToEdit"
      @close="closeEditModal"
      @update="handleUpdateRadio"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/SidebarApp.vue';
import RadioList from '@/components/RadioList.vue'
import EditRadioModal from '@/components/EditRadioModal.vue';
import { useRadioStore } from '@/stores/radioStore';

const radioStore = useRadioStore();


const showEditModal = ref(false);

const radioToEdit = ref(null);


const openEditModal = (radio) => {
  radioToEdit.value = radio;
  showEditModal.value = true;
};


const closeEditModal = () => {
  showEditModal.value = false;
};

const handleUpdateRadio = (updatedRadio) => {
  radioStore.updateRadio(updatedRadio);
  closeEditModal();
};
</script>
