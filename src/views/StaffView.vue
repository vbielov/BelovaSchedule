<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';
import { BACKEND_ADRESS, formatDateToLocalISO } from '@/components/mainHandler';
import CalendarPage from '@/components/CalendarPage.vue';
import ScheduleTable from "@/components/ScheduleTable.vue";
import AppointmentViewer from "@/components/AppointmentViewer.vue"

const editedAppointment = ref(null);
const popupContent = ref(null);

const dateNow = new Date(Date.now());
dateNow.setHours(0, 0, 0, 0);
const userSelectedDate = ref(dateNow);

const appointments = ref([]);
var originalAppointments = [];
const team = ref([]);
const services = ref([]);

axios.get("https://" + BACKEND_ADRESS + "/api/services", { withCredentials: true })
    .then((response) => {
        services.value = response.data;
    })
    .catch((error) => {
        console.error(error);
});

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
        originalAppointments = structuredClone(response.data);
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

const POPUP_CALENDAR = "Calendar";
const POPUP_APPOINTMENT = "Appointment";
// Calendar, Edit/Add Appointment
function setPopup(contentType) {
    popupContent.value = contentType;
}

function selectDay(date) {
    setPopup(null);
    if(userSelectedDate.value === date) {
        return;
    }
    userSelectedDate.value = date;
    updateAppointments(userSelectedDate.value);
}

document.body.addEventListener('keydown', (event) => {
    if (event.key == "Escape") {
        setPopup(null);
    }
});

function formatSelectedDate(date) {
    const WEEK_DAYS = [
        "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
    ];
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return WEEK_DAYS[date.getDay()] + " " + day + "." + month + " ";
}

var websocket = new WebSocket("wss://" + BACKEND_ADRESS + "/api/schedule-websocket");
websocket.onmessage = function(message) {
    let webSocketMessage = JSON.parse(message.data);
    let fromTime = new Date(webSocketMessage.appointment.fromTime);
    let toTime = new Date(webSocketMessage.appointment.toTime);
    if(userSelectedDate.value.getDate() < fromTime.getDate() || userSelectedDate.value.getDate() > toTime.getDate()) {
        return;
    }
    let index = appointments.value.findIndex((app) => app.id === webSocketMessage.appointment.id);
    switch(webSocketMessage.operation) {
        case CREATE_OPERATION:
        case UPDATE_OPERATION:
            console.log(webSocketMessage.appointment);
            if(index !== -1) {
                appointments.value[index] = webSocketMessage.appointment;
                break;
            } 
            appointments.value.push(webSocketMessage.appointment);
            
            break;
        case DELETE_OPERATION:
            if(index !== -1) {
                appointments.value = appointments.value.filter((app) => app.id !== webSocketMessage.appointment.id);
            }
            break;
    }
}
websocket.onclose = function(e) {
    alert("WebSocket connection closed");
}

const UPDATE_OPERATION = "update";
const DELETE_OPERATION = "delete";
const CREATE_OPERATION = "create";
class WebSocketMessage {
    constructor(operation, appointment) {
        this.operation = operation;
        this.appointment = appointment;
    }
}

function sendChange(appoimentChange) {
    websocket.send(JSON.stringify(appoimentChange));
}

function onClickAppointment(appointment) {
    editedAppointment.value = appointment;
    setPopup(POPUP_APPOINTMENT);
}

// To check if appointments are equal.
function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
        return false;
        }
    }

    return true;
}

watch(editedAppointment, (newData, oldData) => {
    let appoiment = originalAppointments.find((app) => app.id == newData.id);
    if(!newData || !appoiment) {
        return;
    }

    if(shallowEqual(newData, appoiment)) {
        return;
    }

    sendChange(new WebSocketMessage(UPDATE_OPERATION, newData));
}, {deep: true});

function deleteAppointment(appointment) {
    appointments.value = appointments.value.filter((app) => app.id !== appointment.id);
    setPopup(null);
    sendChange(new WebSocketMessage(DELETE_OPERATION, appointment));
}

function doAppointmentsCollide(appointmentA, appointmentB) {
    return (appointmentA.fromTime <= appointmentB.toTime && appointmentA.toTime >= appointmentB.fromTime) ||
            (appointmentB.fromTime <= appointmentA.toTime && appointmentB.toTime >= appointmentA.fromTime);
}

function createNewEmptyAppointment(teamMembmerID) {
    // Goes though all appointments of teamMember
    // Finds Empty space where appointment with length of one hour could fit without colliding
    // Creates there appointment with minimal information about person
    // Opens popup to edit that appointment
    let appointmentsOfTeamMember = appointments.value.filter((app) => app.teamMembmerID == teamMembmerID);
    if(appointmentsOfTeamMember.length !== 0) {
        for(let i = 0; i < appointmentsOfTeamMember.length; i++) {
            let possibleAppointment = {
                fromTime: appointmentsOfTeamMember[i].toTime + 60000,
                toTime: appointmentsOfTeamMember[i].toTime + 3600000
            };
            var isColliding = false;
            for(let j = 0; j < appointmentsOfTeamMember.length; j++) {
                if(doAppointmentsCollide(possibleAppointment, appointmentsOfTeamMember[j])) {
                    isColliding = true;
                    break;
                }
            }
            if(!isColliding) {
                // We have found it!
            }
        }
    } else {
        let fromDate = new Date(userSelectedDate.value);
        fromDate.setHours(9, 0, 0, 0);
        let toDate = new Date(userSelectedDate.value);
        toDate.setHours(10, 0, 0, 0);

        let newAppointment = {
            id: -1,
            forename: "New",
            surname: "Client",
            email: "example@email.com",
            phoneNumber: "+4911111111",
            comment: "",
            fromTime: formatDateToLocalISO(fromDate),
            toTime: formatDateToLocalISO(toDate),
            serviceID: 1,
            teamMemberID: teamMembmerID
        };

        sendChange(new WebSocketMessage(CREATE_OPERATION, newAppointment));
    }
}

</script>

<template>
    <div class="staffPage">
        <nav class="nav">
            <button class="navButton" @click="logout">Logout</button>
            <button class="navButton calendarButton" @click="setPopup(POPUP_CALENDAR)">{{ formatSelectedDate(userSelectedDate) }} &nbsp; 📅</button>
        </nav>
        <div class="contentContainer">
            <ScheduleTable 
                :onAddAppointment="createNewEmptyAppointment" 
                :onClickAppointment="onClickAppointment" 
                :services="services" 
                :team="team" 
                :appointments="appointments" 
                :userSelectedDate="userSelectedDate"
            />
            <div class="sidePanel">
                <CalendarPage :callback="selectDay" :userSelectedDay="userSelectedDate"/>
            </div>
        </div>
    </div>
    <div class="mobileCalendarContainer" :hide="popupContent === null">
        <div class="mobileCalendar">          
            <button class="navButton" style="margin: 0.5em;" @click="setPopup(null)">x</button>
            <CalendarPage v-if="popupContent === POPUP_CALENDAR" :callback="selectDay" :userSelectedDay="userSelectedDate"/>
            <AppointmentViewer v-if="popupContent === POPUP_APPOINTMENT" :deleteCallback="deleteAppointment" :appointmentData="editedAppointment" :team="team" :services="services" class="appointmentEditor"/>
        </div>
    </div>
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
        z-index: 10;
        display: none;
    }

    .mobileCalendarContainer[hide=false] {
            display: flex;
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
    }
</style>