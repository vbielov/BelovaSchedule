<script setup>
import ServiceButton from '@/components/ServiceButton.vue';
import { Service } from './mainHandler.js'
const props = defineProps(['callback']);


const services = [
  Service.Manikure, Service.Pedikure, Service.Manikure_Shellac, Service.Pedikure_Shellac
];

</script>

<template>
  <div class="textContainer">
    <h3 class="title">Wählen Sie einen Dienst aus</h3>
    <p class="subTitle">⚑ Blutenburgstraße 122, 80634 München</p>
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
</style>