<script setup>
import { ref } from 'vue';
const props = defineProps(['onAddAppointment', 'onClickAppointment', 'userSelectedDate', 'team', 'appointments', 'services']);

const startWorkingDay = 9;
const endWorkingDay = 18;
function generateDayTime() {
    const period = 0.5;
    const returnArr = [];
    var increment = 0;
    for(var i = startWorkingDay; i <= endWorkingDay; i += period) {
        const date = new Date(0);
        date.setHours(Math.floor(i), i % 1 * 60);
        var timeParts = date.toLocaleTimeString().split(":");
        timeParts = timeParts[0] + ":" + timeParts[1];
        returnArr.push({
            id: increment++,
            time: timeParts,
            isFullHour: i % 1 == 0,
        });
    }
    return returnArr;
}

function getAppointments(staffID) {
    const appoinemntsToReturn = [];
    for(var i = 0; i < props.appointments.length; i++) {
        if(props.appointments[i].teamMemberID == staffID) {
            appoinemntsToReturn.push(props.appointments[i]);
        }
    }
    return appoinemntsToReturn;
}

function getFreeAppointments() {
    const appoinemntsToReturn = [];
    for(var i = 0; i < props.appointments.length; i++) {
        let id = props.appointments[i].teamMemberID;
        if(id === undefined || id == null || id == 0) {
            appoinemntsToReturn.push(props.appointments[i]);
        }
    }
    return appoinemntsToReturn;
}

const rowHeightForHour = 100;
function calculateHeightOfAppointment(fromTimeString, toTimeString) {
    let fromTimeValue = new Date(fromTimeString).getTime();
    let toTimeValue = new Date(toTimeString).getTime();
    let differenceMS = toTimeValue - fromTimeValue;
    let differenceHours = differenceMS / 1000 / 60 / 60;
    let result = differenceHours * rowHeightForHour;
    let maxHeight = (endWorkingDay - startWorkingDay) * rowHeightForHour;
    maxHeight -= calculateTopOffsetOfAppointment(fromTimeString) - rowHeightForHour / 4
    return Math.min(result, maxHeight);
}

function calculateTopOffsetOfAppointment(fromTimeString) {
    let fromTimeValue = new Date(fromTimeString).getTime();
    let startOfDay = new Date(fromTimeString).setHours(startWorkingDay, 0, 0, 0);
    let differenceMS = fromTimeValue - startOfDay;
    let differenceHours = differenceMS / 1000 / 60 / 60;
    return differenceHours * rowHeightForHour + rowHeightForHour / 4;
}

function calculateTopOffsetOfTimeLine() {
    const dateNow = new Date(Date.now());
    // const dateNow = new Date(new Date(0, 0, 0, 15, 30, 0));
    let hours = 0;
    hours += dateNow.getHours();
    hours += dateNow.getMinutes() / 60;
    hours += dateNow.getSeconds() / 60 / 60;
    hours -= startWorkingDay;
    timeLineTopOffset.value = hours * rowHeightForHour + rowHeightForHour - 5;
}

const timeLineTopOffset = ref(0);
calculateTopOffsetOfTimeLine();
setInterval(() => calculateTopOffsetOfTimeLine(), 1000);

function isTimeLineVisible() {
    var dateNow = new Date(Date.now());
    let hours = 0;
    hours += dateNow.getHours();
    hours += dateNow.getMinutes() / 60;
    hours += dateNow.getSeconds() / 60 / 60;
    dateNow = new Date(Date.now());
    dateNow.setHours(0, 0, 0, 0);
    return props.userSelectedDate.getTime() === dateNow.getTime() && hours > startWorkingDay && hours < endWorkingDay;
    // return true;
}

function formatTime(dateString) {
    let date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return hours + ":" + minutes;
}

const defaultValues = {
    name: ""
}

const mousePosition = ref({x: 0, y: 0});
// addEventListener('mousemove', (event) => {
//     mousePosition.value = { x: event.pageX, y: event.pageY };
// }, false);

</script>

<template>
    <table>
        <tr class="timeLine" v-if="isTimeLineVisible()" :style="
            'top: ' + timeLineTopOffset + 'px; '
        "></tr>
        <tr>
            <th></th>
            <th>Frei</th>
            <th v-for="staff in props.team" :key="staff.id">{{ staff.displayName }}</th>
        </tr>
        <tr v-for="timeRow in generateDayTime()">
            <th><p class="timeHeader" :isFullHour="timeRow.isFullHour">{{ timeRow.time }}</p></th>
            <td>
                <div class="addAppointmentContainer">
                    <button class="addAppointmentButton" v-if="timeRow.id == 0" @click="props.onAddAppointment(0)">+</button>
                </div>
                <div v-if="timeRow.id == 0" v-for="appointment in getFreeAppointments()" class="appointmentContainer" :key="appointment.id">
                    <button class="appointment" @click="props.onClickAppointment(appointment)" :style="
                        'height: ' + calculateHeightOfAppointment(appointment.fromTime, appointment.toTime) + 'px; top: ' + calculateTopOffsetOfAppointment(appointment.fromTime) + 'px; '
                    ">
                        {{ formatTime(appointment.fromTime) + " - " + formatTime(appointment.toTime) }} <br/>
                        <h3>{{ appointment.forename + " " + appointment.surname }}</h3>
                        {{ appointment.phoneNumber }} <br/> 
                        {{ (props.services.find((service) => service.id === appointment.serviceID) || defaultValues).name }} <br/>
                        <span style="color: var(--color-cold-white)">{{ appointment.comment }}</span>
                    </button>
                </div>
            </td>
            <td v-for="staff in props.team" :key="staff.id">
                
                <div class="addAppointmentContainer">
                    <button class="addAppointmentButton" v-if="timeRow.id == 0" @click="props.onAddAppointment(staff.id)">+</button>
                </div>
                
                <div v-if="timeRow.id == 0" v-for="appointment in getAppointments(staff.id)" class="appointmentContainer" :key="appointment.id">
                    <button class="appointment" @click="props.onClickAppointment(appointment)" :style="
                        'height: ' + calculateHeightOfAppointment(appointment.fromTime, appointment.toTime) + 'px; top: ' + (calculateTopOffsetOfAppointment(appointment.fromTime) + mousePosition.y) + 'px; left: ' + mousePosition.x + 'px;'
                    ">
                        {{ formatTime(appointment.fromTime) + " - " + formatTime(appointment.toTime) }} <br/>
                        <h3>{{ appointment.forename + " " + appointment.surname }}</h3>
                        {{ appointment.phoneNumber }} <br/> 
                        {{ (props.services.find((service) => service.id === appointment.serviceID) || defaultValues).name }} <br/>
                        <span style="color: var(--color-cold-white)">{{ appointment.comment }}</span>
                    </button>
                </div>
            </td>
        </tr>
    </table>
</template>

<style scoped>
    button {
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    table {
        margin: 1.0em;
        border-spacing: 0px;
        border-collapse: collapse;
        max-height: 100%;
        align-self: start;
        position: relative;
    }

    tr {
        height: 50px;
        /* Don't forget to change this value in td, th style too */
    }

    td, th {
        height: 50px;
        border: 2px solid var(--color-cold-white);
        width: 100vw;
    }

    th {
        font-weight: bold;
    }

    th:nth-child(1) {
        width: 100px;
        max-width: 100px;
    }

    .appointment {
        background-color: var(--color-pink);
        transition: background-color 0.25s;
        width: 100%;
        top: 0px;
        padding: 0.3em;
        border-radius: 10px;
        text-align: start;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        color: var(--color-white);
        font-size: 1em;
        position: absolute;
        /* max-height: 0px; */
        overflow: hidden;
    }

    .appointment:hover {
        background-color: var(--color-red);
    }

    .appointmentContainer {
        position: relative;
        width: 100%;
        max-height: 0px;
    }

    .timeHeader {
        position: relative;
        top: 25px;
    }

    .timeHeader[isFullHour=false] {
        color: var(--color-gray);
        font-size: 0.9em;
    }

    .timeLine {
        position: absolute;
        width: 100%;
        background-color: var(--color-red);
        opacity: 0.25;
        height: 10px;
        border-radius: 15px;
        z-index: 5;
        transition: top 0.5s;
    }

    .addAppointmentContainer {
        position: relative; 
        width: 100%; 
        height: 0px; 
        display: flex; 
        align-items: center;
    }

    .addAppointmentButton {
        font-size: 1.5em;
        scale: 1.0;
        transition: scale, 0.25s;
        font-weight: bold; 
        color: var(--color-gray); 
        position: absolute; 
        display: flex; 
        width: 100%; 
        justify-content: center; 
        align-items: center;
        line-height: 0px;
    }

    .addAppointmentButton:hover {
        scale: 1.25;
    }

</style>