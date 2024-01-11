<script setup>
import { ref } from 'vue';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner.vue';
import { BACKEND_ADRESS, openCalendar, userSelectedDay, selectDay, userSelectedDate } from './mainHandler.js';
const props = defineProps(['callback']);

function getTitleHeader(date) {
    const WEEK_DAYS = [
        "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
    ];

    var weekDayIndex = date.getDay();
    return  date.getDate().toString() + ". " + WEEK_DAYS[weekDayIndex];
}

function getSubTitle(date) {
    return date.toLocaleDateString('en-GB').replaceAll('/', '.');
}

function pushDay(sign) {
    var currentDay = userSelectedDay.value.getDate();
    var newDate = new Date(userSelectedDay.value);
    newDate.setDate(currentDay + sign);
    selectDay(newDate);
}

function refreshTimes() {
    userSelectedDate.value = undefined;
    loadTimes(userSelectedDay.value);
}

document.addEventListener("onSelectDay", () => refreshTimes());

function bookOnClick() {
    if(userSelectedDate.value) {
        props.callback();
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const FetchStatus = {
    Success: "Success",
    Loading: "Loading",
    Error: "Error"
}

var loadingState = ref(FetchStatus.Loading);
var loadedTimes = ref([]);

// input: 09:00:00
function parseLocalTimeStringToDate(time) {
    const timeArr = time.split(':');
    var date = new Date(userSelectedDay.value);
    date.setHours(timeArr[0]);
    date.setMinutes(timeArr[1]);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    return date;
}

function loadTimes(date) {
    // Fetch data from your backend API
    loadingState.value = FetchStatus.Loading;
    const params = {
        date: formatDate(date)
    }
    axios.get("http://" + BACKEND_ADRESS + "/api/freeTime", { params })
        .then((response) => {
            var newTimes = []
            for(var i = 0; i < response.data.length; i++) {
                var dateOption = parseLocalTimeStringToDate(response.data[i].fromTime);
                newTimes.push({
                    id: i,
                    time: response.data[i].fromTime.slice(0, 5),
                    date: dateOption,
                    isSelected: false
                });
            }
            loadedTimes.value = newTimes;
            loadingState.value = FetchStatus.Success;
        })
        .catch((error) => {
            console.error(error);
            FetchStatus.Error = error.code;
            loadingState.value = FetchStatus.Error;
        }
    );
}
loadTimes(userSelectedDay.value);

// NOTE: Made with id to handle isSelected, otherwise would be easier just to pass a date.
function selectTime(date) {
    userSelectedDate.value = date;
}

</script>

<template>
    <div class="header">
        <button @click="pushDay(-1)" class="chevron">‹</button>
        <div class="title">
            <h3>  {{ getTitleHeader(userSelectedDay) }} </h3>
            <p> {{ getSubTitle(userSelectedDay) }} </p>
        </div>
        <button @click="pushDay(1)" class="chevron">›</button>
    </div>

    <div class="timesContainer">
        <LoadingSpinner class="loadingSpinner" v-show="loadingState == FetchStatus.Loading"/>
        <p v-show="loadingState == FetchStatus.Error"> {{ FetchStatus.Error }} </p>
        <p v-if="loadingState == FetchStatus.Success && loadedTimes.length == 0">Keine Termine</p>

        <button class="timeButton" 
                v-for="loadedTime in loadedTimes"
                @click="selectTime(loadedTime.date)" 
                :isSelected="userSelectedDate && userSelectedDate.getTime() == loadedTime.date.getTime()"
        >
            {{ loadedTime.time }}
        </button>

    </div>

    <div class="bookContainer">
        <button class="bookButton" @click="bookOnClick()" :isEnabled="userSelectedDate != undefined">{{ userSelectedDate ? "Weiter" : "Wählen Sie bitte Zeit" }}</button>
    </div>
</template>

<style scoped>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0em 2em;
        text-wrap: nowrap;
    }

    .chevron {
        height: 0px;
        line-height: 0px;
        margin: 0.5em;
        background-color: transparent;
        border: none;
        font-size: 2em;
        font-weight: bold;
        color: var(--color-pink);
        cursor: pointer;
    }

    .title {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 5em;
        margin: 1em;
    }

    .title h3 {
        color: var(--color-dark-blue);
        font-weight: bold;
    }

    .title p {
        color: var(--color-gray);
    }

    .bookContainer {
        display: flex;
        justify-content: center;
        padding: 1em;
    }

    .bookButton {
        padding: 0.25em 1em;
        font-weight: bold;
        font-size: large;
        background-color: var(--color-cold-white);
        color: var(--color-white);
        border: 5px solid transparent;
        border-radius: 10px 10px;
        color: var(--color-gray);
        width: 225px;
        text-wrap: nowrap;
        overflow: hidden;
        transition: width 0.1s ease-out;
    }

    .bookButton[isEnabled=true] {
        background-color: var(--color-pink);
        cursor: pointer;
        color: var(--color-white);
        width: 100px;
    }

    .bookButton:hover[isEnabled=true] {
        background-color: var(--color-red);
    }

    .timesContainer {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;  
    }

    .timeButton {
        margin: 0.5em;
        border: 5px solid transparent;
        font-weight: bold;
        border-radius: 5px 5px;
        cursor: pointer;
        background-color: var(--color-cold-white);
        padding: 0.5em 1em;
        transition: padding 0.25s;
    }

    .timeButton[isSelected=true] {
        border: 2px solid var(--color-dark-blue);
        padding: 0.5em 1.5em;
    }

    .loadingSpinner {
        scale: 0.5;
    }
</style>