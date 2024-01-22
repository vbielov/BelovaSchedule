<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { BACKEND_ADRESS } from '@/components/mainHandler';
import CalendarPage from '@/components/CalendarPage.vue';
import ScheduleTable from "@/components/ScheduleTable.vue";

const hideCalendar = ref(true);
const dateNow = new Date(Date.now());
dateNow.setHours(0, 0, 0, 0);
const userSelectedDate = ref(dateNow);
const appointments = ref([]);
const team = ref([]);

axios.get("https://" + BACKEND_ADRESS + "/api/team", { withCredentials: true })
    .then((response) => {
        team.value = response.data.filter((teamMember) => teamMember.acceptsAppointments === true);
    })
    .catch((error) => {
        window.location.replace("/login");
        console.error(error);
    }
);

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function updateAppointments(selectedDate) {
    const params = { date: formatDate(selectedDate) };
    axios.get("https://" + BACKEND_ADRESS + "/api/get-appointments", { params, withCredentials: true })
    .then((response) => {
        appointments.value = response.data;
    })
    .catch((error) => {
        window.location.replace("/login");
        console.error(error);
    });
}
updateAppointments(userSelectedDate.value);

function logout() {
    axios.post("https://" + BACKEND_ADRESS + "/api/logout", {}, { withCredentials: true })
    .then((response) => {
        document.cookie = "";
        location.reload();
    })
    .catch((error) => {
        console.error(error);
        document.cookie.indexOf
    })
}


function toggleOpenCalendar() {
    hideCalendar.value = !hideCalendar.value;
}



function selectDay(date) {
    if(hideCalendar.value == false) {
        hideCalendar.value = true;
    }
    console.log(date);
    userSelectedDate.value = date;
    updateAppointments(userSelectedDate.value);
}

function formatSelectedDate(date) {
    const WEEK_DAYS = [
        "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
    ];
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return WEEK_DAYS[date.getDay()] + " " + day + "." + month + " ";
}

// var websocket = new WebSocket("wss://" + BACKEND_ADRESS + "/api/schedule-websocket");
// websocket.onmessage = function(appoimentsData) {

//     console.log(msg);
// }
// websocket.onclose = function() {
//     alert("WebSocket connection closed");
// }

// function sendChange(appoimentChange) {
//     websocket.send(appoimentChange);
// }

</script>

<template>
    <div class="staffPage">
        <nav class="nav">
            <button class="navButton" @click="logout">Logout</button>
            <button class="navButton calendarButton" @click="toggleOpenCalendar">{{ formatSelectedDate(userSelectedDate) }} &nbsp; 📅</button>
        </nav>
        <div class="contentContainer">
            <ScheduleTable :team="team" :appointments="appointments" :userSelectedDate="userSelectedDate"></ScheduleTable>
            <div class="sidePanel">
                <CalendarPage :callback="selectDay" :userSelectedDay="userSelectedDate"></CalendarPage>
            </div>
        </div>
    </div>
    <div class="mobileCalendarContainer" :hide=hideCalendar>
        <div class="mobileCalendar">          
            <CalendarPage :callback="selectDay" :userSelectedDay="userSelectedDate"></CalendarPage>
        </div>
    </div>
    <button @click="sendChange('Hello!')">
        Some Button
    </button>
</template>

<style scoped>
    button {
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .staffPage {
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: var(--color-light-gray);
        min-height: 100vh;
    }

    nav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1em;
        border-bottom: 2px solid var(--color-cold-white);
        background-color: var(--color-cold-white);
    }

    .navButton {
        background-color: var(--color-pink);
        transition: background-color 0.25s;
        padding: 0.75em 1em;
        border-radius: 10px;
        color: var(--color-white);
        font-weight: bold;
    }

    .navButton:hover {
        background-color: var(--color-red);
    }

    .contentContainer {
        display: flex;
        width: 100%;
        justify-content: flex-end;
    }

    .sidePanel {
        display: flex;
        border-left: 2px solid var(--color-cold-white);
    }

    .calendarButton {
        display: none;
    }
    
    .mobileCalendarContainer {
        position: fixed;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: flex-start;
        display: none;
        z-index: 10;
    }
    .mobileCalendar {
        background-color: var(--color-light-gray);
        border: 2px solid var(--color-cold-white);
        border-radius: 15px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin: 2em;
    }

    @media only screen and (max-width: 600px) {
        .sidePanel {
            display: none;
        }

        .calendarButton {
            display: block;
        }

        .mobileCalendarContainer[hide=false] {
            display: flex;
        }
    }
</style>