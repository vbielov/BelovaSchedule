<script setup>
import ServicePage from '@/components/ServicePage.vue';
import { pageIndex, Pages, previousPage, selectService, selectDate, bookAppointment } from '@/components/mainHandler.js';
import DatePage from '@/components/DatePage.vue';
import UserForm from "@/components/UserForm.vue";
import SuccessPage from '@/components/SuccessPage.vue';
import CalendarPage from '@/components/CalendarPage.vue';
</script>

<template>
  <main>
    <!-- TOP NAVIGATION -->
    <nav>
      <button @click="previousPage" v-if="pageIndex != Pages.Service && pageIndex != Pages.Success && pageIndex != Pages.Failure">
        <span>‹</span>
      </button>
    </nav>
  
    <!-- FIRST PAGE -->
    <div class="page" :show="pageIndex == Pages.Service">
      <ServicePage :callback="selectService"/>
    </div>

    <!-- CALENDAR PAGE -->
    <div class="page" :show="pageIndex == Pages.Calendar">
      <CalendarPage></CalendarPage>
    </div>

    <!-- TIME PAGE -->
    <div class="page" :show="pageIndex == Pages.Date">
      <DatePage :callback="selectDate"/>
    </div>

    <!-- USER FORM -->
    <div class="page" :show="pageIndex == Pages.UserForm">
      <UserForm :callback="bookAppointment"></UserForm>
    </div>

    <!-- END PAGE -->
    <div class="page" :show="pageIndex == Pages.Success || pageIndex == Pages.Failure">
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
    max-height: 550px;
    overflow: hidden;
    transition: max-height 1s;
  }

  .page[show=false] {
    max-height: 0px;
    transition: max-height 0.5s;
  }
</style>
