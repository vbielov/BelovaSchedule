<script setup>
import { ref } from 'vue';
import ServicePage from '@/components/ServicePage.vue';
import { Service, BACKEND_ADRESS } from '@/components/mainHandler.js';
import DatePage from '@/components/DatePage.vue';
import UserForm from "@/components/UserForm.vue";
import SuccessPage from '@/components/SuccessPage.vue';
import axios from 'axios';

var userSelectedService = Service.None;
var userSelectedDate = undefined;
var userForm = undefined;

const Pages = {
  Service: 0,
  Date: 1,
  UserForm: 2,
  Success: 3,
  Failure: 4
}

const pageIndex = ref(Pages.Service);

function backOnClick() {
  pageIndex.value--;
}

function serviceOnClick(serviceType) {
  console.log(serviceType);
  userSelectedService = serviceType;
  pageIndex.value = Pages.Date;
}

function formatDateToLocalISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ":00.000+01:00";
}

function dateOnClick(date) {
  userSelectedDate = formatDateToLocalISO(date);
  console.log(userSelectedDate);
  pageIndex.value = Pages.UserForm;
}

class BookBody {
  constructor(service, date, form) {
    this.service = service;
    this.date = date;
    this.form = form;
  }
}
function formOnClick(form) {
  userForm = form;

  // TODO: Vertify all inputs are valid locally to, to reduce load on server and delay
  const bookRequest = new BookBody(userSelectedService, userSelectedDate, userForm);
  console.log(bookRequest);
  axios.post('http://' + BACKEND_ADRESS + '/api/book', bookRequest)
    .then(response => {
      pageIndex.value = Pages.Success;
    })
    .catch(error => {
      console.error('POST error:', error);
      pageIndex.value = Pages.Failure;
    });
}

</script>

<template>
  <main>
    <!-- TOP NAVIGATION -->
    <nav>
      <button v-if="pageIndex != Pages.Service && pageIndex != Pages.Success && pageIndex != Pages.Failure" @click="backOnClick()">
        <span>‹</span>
      </button>
    </nav>
  
    <!-- FIRST PAGE -->
    <div class="page" :show="pageIndex == Pages.Service">
      <ServicePage :callback="serviceOnClick"/>
    </div>

    <!-- SECOND PAGE -->
    <div class="page" :show="pageIndex == Pages.Date">
      <DatePage :callback="dateOnClick"/>
    </div>

    <!-- USER FORM -->
    <div class="page" :show="pageIndex == Pages.UserForm">
      <UserForm :callback="formOnClick"></UserForm>
    </div>

    <!-- END PAGE -->
    <div class="page" :show="pageIndex > 2">
      <SuccessPage :state="pageIndex == Pages.Success"></SuccessPage>
    </div>
  </main>

</template>

<style scoped>
  main {
    border: 5px solid transparent;
    border-radius: 20px 20px;
    overflow: hidden;
    width: 100%;
  }

  nav {
    background-color: var(--color-cold-white);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-height: 50px;
  }

  nav button {
    border: none;
    width: 50px;
    height: 50px;
    background-color: var(--color-red);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  
  nav button span {
    font-size: 3em;
    color: white;
  }

  .page {
    width: 100%;
    background-color: var(--color-light-gray);

    display: block;
    max-height: 500px;
    overflow: hidden;
    transition: max-height 1s;
  }

  .page[show=false] {
    max-height: 0px;
    transition: max-height 0.5s;
  }
</style>
