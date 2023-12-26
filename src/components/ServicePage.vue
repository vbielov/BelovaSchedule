<script setup>
import ServiceButton from '@/components/ServiceButton.vue';
import { Service } from './mainHandler.js'
const props = defineProps(['callback']);


const services = [
  Service.Manikure, Service.Pedikure, Service.Combi
];

</script>

<template>
    <h3 class="text">Wählen Sie einen Dienst aus</h3>
    <ul class="serviceList">
        <ServiceButton v-for="service in services" :title="service" @click="callback(service)"></ServiceButton>
    </ul>
</template>

<style scoped>
  .text {
    display: flex;
    justify-content: center;
    padding: 1em;
    font-weight: bold;
  }

  .serviceList {
    padding: 0em 0em 1em;
  }
</style>