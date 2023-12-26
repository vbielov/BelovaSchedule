<script setup>
import { ref } from 'vue';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner.vue';
import { BACKEND_ADRESS } from './mainHandler.js';
const props = defineProps(['callback']);

var selectDay = ref(new Date(Date.now()));

selectDay.value.setHours(0);
selectDay.value.setMinutes(0);
selectDay.value.setSeconds(0);
selectDay.value.setMilliseconds(0);

var selectedTime = undefined;

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
    var currentDay = selectDay.value.getDate();
    var newDate = new Date(selectDay.value);
    newDate.setDate(currentDay + sign);
    selectDay.value = newDate;
    loadTimes(newDate);
}

function bookOnClick() {
    if(selectedTime) {
        props.callback(selectedTime);
    }
    else {
        alert("Kein Zeit gewählt!");
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
    var date = new Date(selectDay.value);
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
        date: formatDate(selectDay.value)
    }
    axios.get("http://" + BACKEND_ADRESS + "/api/freeTime", { params })
        .then((response) => {
            selectedTime = undefined;
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
        });
}
loadTimes(selectDay);

// NOTE: Made with id to handle isSelected, otherwise would be easier just to pass a date.
function selectTime(id) {
    for(var i = 0; i < loadedTimes.value.length; i++) {
        loadedTimes.value[i].isSelected = id == loadedTimes.value[i].id;
        if(id == loadedTimes.value[i].id) {
            selectedTime = loadedTimes.value[i].date;
        }
    }
}

</script>

<template>
    <div class="header">
        <button @click="pushDay(-1)">‹</button>
        <div class="title">
            <h3>  {{ getTitleHeader(selectDay) }} </h3>
            <p> {{ getSubTitle(selectDay) }} </p>
        </div>
        <button @click="pushDay(1)">›</button>
    </div>

    <div class="timesContainer">
        <LoadingSpinner class="loadingSpinner" v-show="loadingState == FetchStatus.Loading"/>
        <p v-show="loadingState == FetchStatus.Error"> {{ FetchStatus.Error }} </p>
        <p v-if="loadingState == FetchStatus.Success && loadedTimes.length == 0">Keine Termine</p>

        <button class="timeButton" 
                v-for="loadedTime in loadedTimes"
                @click="selectTime(loadedTime.id)" 
                :isSelected="loadedTime.isSelected"
        >
            {{ loadedTime.time }}
        </button>

    </div>

    <div class="bookContainer">
        <button class="bookButton" @click="bookOnClick()">Buchen</button>
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

    .header button {
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
        margin: 1em;
        display: flex;
        flex-direction: column;
        align-items: center;
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
        background-color: var(--color-pink);
        color: var(--color-white);
        border: 5px solid transparent;
        border-radius: 10px 10px;
        cursor: pointer;
        transition: background-color 0.25s;
    }

    .bookButton:hover {
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