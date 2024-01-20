<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { BACKEND_ADRESS } from '@/components/mainHandler';
import CalendarPage from '@/components/CalendarPage.vue';

const message = ref("");
var staffMembers = ref([
    { id: 0, name: "Inna" },
    { id: 0, name: "Yulia" },
    { id: 0, name: "Ira" },
    { id: 0, name: "Annya" }
]);

axios.get("https://" + BACKEND_ADRESS + "/api/user", { withCredentials: true })
    .then((response) => {
        message.value = response.data;
    })
    .catch((error) => {
        window.location.replace("/login");
        console.error(error);
    }
);

function logout() {
    axios.post("https://" + BACKEND_ADRESS + "/api/logout", {}, { withCredentials: true })
    .then((response) => {
        location.reload();
    })
    .catch((error) => {
        console.error(error);
    })
}

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

generateDayTime();

const appoinments = [
    {
        teamMemberID: 1,
        fromTime: "2024-01-15 11:00:00",
        toTime: "2024-01-15 13:39:00",
        name: "Somename"
    },
    {
        teamMemberID: 3,
        fromTime: "2024-01-15 14:00:00",
        toTime: "2024-01-15 16:45:00",
        name: "Somename"
    },
    {
        teamMemberID: 0,
        fromTime: "2024-01-15 9:00:00",
        toTime: "2024-01-15 12:00:00",
        name: "Somename"
    },
    {
        teamMemberID: 0,
        fromTime: "2024-01-15 14:00:00",
        toTime: "2024-01-15 15:00:00",
        name: "Somename"
    }
];

function getAppoinments(staffID) {
    const appoinemntsToReturn = [];
    for(var i = 0; i < appoinments.length; i++) {
        if(appoinments[i].teamMemberID == staffID) {
            appoinemntsToReturn.push(appoinments[i]);
        }
    }
    return appoinemntsToReturn;
}

const rowHeightForHour = 100;
function calculateHeightOfAppoinment(fromTimeString, toTimeString) {
    let fromTimeValue = new Date(fromTimeString).getTime();
    let toTimeValue = new Date(toTimeString).getTime();
    let differenceMS = toTimeValue - fromTimeValue;
    let differenceHours = differenceMS / 1000 / 60 / 60;
    return differenceHours * rowHeightForHour;
}

function calculateTopOffsetOfAppoiment(fromTimeString) {
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
    return userSelectedDate.value.getTime() === dateNow.getTime() && hours > startWorkingDay && hours < endWorkingDay;
    // return true;
}

const hideCalendar = ref(true);

function toggleOpenCalendar() {
    hideCalendar.value = !hideCalendar.value;
}

const dateNow = new Date(Date.now());
dateNow.setHours(0, 0, 0, 0);
const userSelectedDate = ref(dateNow);

function selectDay(date) {
    if(hideCalendar.value == false) {
        hideCalendar.value = true;
    }
    console.log(date);
    userSelectedDate.value = date;
}

function formatSelectedDate(date) {
    const WEEK_DAYS = [
        "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
    ];
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return WEEK_DAYS[date.getDay()] + " " + day + "." + month + " ";
}

</script>

<template>
    <div class="staffPage">
        <nav class="nav">
            <button class="navButton" @click="logout">Logout</button>
            <button class="navButton calendarButton" @click="toggleOpenCalendar">{{ formatSelectedDate(userSelectedDate) }} &nbsp; 📅</button>
        </nav>
        <div class="contentContainer">
            <table>
                <tr class="timeLine" v-if="isTimeLineVisible()" :style="
                    'top: ' + timeLineTopOffset + 'px; '
                "></tr>
                <tr>
                    <th></th>
                    <th v-for="staff in staffMembers">{{ staff.name }}</th>
                </tr>
                <tr v-for="timeRow in generateDayTime()">
                    <th><p class="timeHeader" :isFullHour="timeRow.isFullHour">{{ timeRow.time }}</p></th>
                    <td v-for="staffID in Array.from(Array(staffMembers.length).keys())">
                        
                        <div style="position: relative; width: 100%; height: 0px; display: flex; align-items: center;">
                            <button v-if="timeRow.id == 0" style="font-size: 1.5em; font-weight: bold; color: var(--color-gray); position: absolute; display: flex; width: 100%; justify-content: center; align-items: center;">+</button>
                        </div>

                        <div v-if="timeRow.id == 0" v-for="appoiment in getAppoinments(staffID)" class="appoinmentContainer">
                            <button class="appoinment" :style="
                                'height: ' + calculateHeightOfAppoinment(appoiment.fromTime, appoiment.toTime) + 'px; top: ' + calculateTopOffsetOfAppoiment(appoiment.fromTime) + 'px; '
                            ">
                                11:15-13:05 <br/>
                                <h3>Helen</h3>
                                +1(111) 111-1111 <br/> 
                                Gel manicure
                            </button>
                        </div>
                    </td>
                </tr>
            </table>
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
</template>

<style scoped>
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
        padding: 0.75em 1em;
        border-radius: 10px;
        color: var(--color-white);
        font-weight: bold;
    }

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
        /* Don't forget to change this value in appoiment style too */
    }

    td, th {
        border: 2px solid var(--color-cold-white);
        width: 100vw;
        height: 50px;
    }

    th {
        font-weight: bold;
    }

    th:nth-child(1) {
        width: 100px;
        max-width: 100px;
    }

    .appoinment {
        background-color: var(--color-pink);
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
    }

    .appoinmentContainer {
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

    .contentContainer {
        display: flex;
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

    @media only screen and (max-width: 800px) {
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
</style>