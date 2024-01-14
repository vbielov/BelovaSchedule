<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { BACKEND_ADRESS } from './mainHandler.js';
import ServiceButton from '@/components/ServiceButton.vue';
import LoadingSpinner from './LoadingSpinner.vue';
const props = defineProps(['callback']);

const services = ref([]);
const FetchStatus = {
    Success: "Success",
    Loading: "Loading",
    Error: "Error"
}
const loadingState = ref(FetchStatus.Loading);

function loadServicesDB() {
  axios.get("https://" + BACKEND_ADRESS + "/api/services")
        .then((response) => {
          let servicesList = [];
          for(var i = 0; i < response.data.length; i++) {
            servicesList.push({
              id: response.data[i].id,
              name: response.data[i].name,
              durationMinutes: response.data[i].durationMinutes,
              price: response.data[i].price
            });
          }
          services.value = servicesList;
          loadingState.value = FetchStatus.Success;
        })
        .catch((error) => {
            console.error(error);
            FetchStatus.Error = error.code;
            loadingState.value = FetchStatus.Error;
        }
    );
}
loadServicesDB();

</script>

<template>
  <div class="textContainer">
    <h3 class="title">Wählen Sie einen Dienst aus</h3>
    <a href="https://maps.app.goo.gl/rnrssGebSmjSP5xh6" class="subTitle">⚑ Blutenburgstraße 122, 80634 München</a>
  </div>
  <div class="loadingSpinnerContainer">
    <LoadingSpinner class="loadingSpinner" v-show="loadingState == FetchStatus.Loading"/>
      <p v-show="loadingState == FetchStatus.Error"> {{ FetchStatus.Error }} </p>
  </div>
  <ul class="serviceList">
      <ServiceButton v-for="service in services" :service="service" @click="callback(service)"></ServiceButton>
  </ul>
</template>

<style scoped>
  .textContainer {
    padding: 1em;
  }

  .title {
    display: flex;
    justify-content: center;
    font-weight: bold;
  }

  .subTitle {
    display: flex;
    justify-content: center;
    color: var(--color-gray);
  }

  .serviceList {
    padding: 0em 0em 1em;
  }

  .loadingSpinnerContainer {
    display: flex;
    justify-content: center;
  }

  .loadingSpinner {
    scale: 0.5;
  }
</style>