<script setup>
import { ref, watch } from 'vue';
const props = defineProps(['appointmentData', 'team', 'services', 'deleteCallback']);

function preventSubmit() {}

const freeTeamMember = {
    displayName: "",
    id: 0
}

const nullService = {
    name: "",
    id: 0
}

const serviceRef = ref((props.services.find((service) => service.id === props.appointmentData.serviceID) || nullService).name);
const staffRef = ref((props.team.find((teamMember) => teamMember.id === props.appointmentData.teamMemberID) || freeTeamMember).displayName);

watch(serviceRef, async (newData, oldData) => {
    let serviceID = (props.services.find((service) => service.name === newData) || freeTeamMember).id;
    props.appointmentData.serviceID = serviceID;
});

watch(staffRef, async (newData, oldData) => {
    let staffID = (props.team.find((teamMember) => teamMember.displayName === newData) || freeTeamMember).id;
    props.appointmentData.teamMemberID = staffID;
});
</script>

<template>
    <div class="container">
        <form @submit.prevent="preventSubmit()">
            
                <label for="service">Service:</label>
                <input v-model="serviceRef" list="services" id="service" required>
                <datalist id="services">
                    <option v-for="service in props.services">{{ service.name }}</option>
                </datalist>
            
                <label for="staff">Staff:</label>
                <input v-model="staffRef" list="team" id="staff">
                <datalist id="team">
                    <option v-for="teamMember in props.team">{{ teamMember.displayName }}</option>
                </datalist>
            
                <label for="forename">Forename:</label>
                <input v-model="props.appointmentData.forename" type="text" id="forename" required>
            
                <label for="surname">Surname:</label>
                <input v-model="props.appointmentData.surname" type="text" id="surname" required>
            
                <label for="email">Email:</label>
                <input v-model="props.appointmentData.email" type="email" id="email" required>
            
                <label for="phoneNumber">Phone:</label>
                <input v-model="props.appointmentData.phoneNumber" type="tel" id="phoneNumber" placeholder="e.g., +49123456789" pattern="(\+49)?[1-9][0-9]{1,14}" required>
            
                <label for="fromTime">From Time:</label>
                <input v-model="props.appointmentData.fromTime" type="datetime-local" class="form-control" id="fromTime" required>
            
                <label for="toTime">To Time:</label>
                <input v-model="props.appointmentData.toTime" type="datetime-local" class="form-control" id="toTime" required>
            
                <label for="comment">Comment:</label>
                <textarea v-model="props.appointmentData.comment" type="text" id="comment"/>
            <div class="submitContainer">
                <button class="submitButton" @click="props.deleteCallback(props.appointmentData)">Delete ⚠️</button>
            </div>
        </form>
    </div>
</template>

<style scoped>

.title {
    display: flex;
    justify-content: center;
    font-weight: bold;
}

.container {
    padding: 1em;
    display: flex;
    width: 300px;
    flex-direction: column;
}

form {
    display: flex;
    flex-direction: column;
    max-width: 100%;
}

form label {
    color: var(--color-gray);
}

form input, form textarea {
    border: 5px solid transparent;
    overflow: hidden;
    border-radius: 5px 5px;
    background-color: var(--color-white);
    color: var(--color-dark-blue);
}

textarea {
    resize: none;
    overflow: hidden;
    height: auto;
    font-family: "Source Sans Pro", "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    color: var(--color-dark-blue);
}

.submitContainer {
    display: flex;
    justify-content: center;
    padding-top: 1em;
    justify-content: space-around;
}

.submitButton {
    padding: 0.25em 0.25em;
    margin: 0px 0.25em;
    background-color: var(--color-pink);
    font-weight: bold;
    color: var(--color-white);
    border: 5px solid transparent;
    border-radius: 10px 10px;
    cursor: pointer;
    transition: background-color 0.25s;
}

.submitButton:hover {
    background-color: var(--color-red);
}
</style>