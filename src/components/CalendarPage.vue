<script setup>
import { ref } from 'vue';
import { userSelectedDay, selectDay } from './mainHandler';

const calendarRows = ref([]);
const calendarMonth = ref(new Date(userSelectedDay.value));

// proper % for negative values
function mod(x, y) {
    return x - y * Math.floor(x / y);
}

function generateCalender() {
    calendarRows.value = [];
    var offsetDays = -mod((calendarMonth.value.getDay() - 1), 7);
    for(var i = 0; i < 6; i++) {
        const calendarDays = [];
        for(var j = 0; j < 7; j++) {
            var calendarDayDate = new Date(calendarMonth.value);
            calendarDayDate.setDate(calendarDayDate.getDate() + offsetDays);
            calendarDays.push({
                id: i * 7 + j,
                text: calendarDayDate.getDate(),
                date: calendarDayDate
            });
            offsetDays++;
        }
       
        calendarRows.value.push(calendarDays);
    }
}
generateCalender();

function pushMonth(sign) {
    const tempDate = new Date(calendarMonth.value);
    tempDate.setMonth(tempDate.getMonth() + sign);
    tempDate.setDate(1);
    calendarMonth.value = tempDate;
    generateCalender();
}

function selectCalendarDay(id) {
    const button = calendarRows.value[Math.floor(id / 7)][id % 7];
    selectDay(button.date);
}

function isToday(date) {
    var tempDate = new Date(date);
    tempDate.setHours(0, 0, 0, 0);
    var nowDate = new Date(Date.now());
    nowDate.setHours(0, 0, 0, 0);
    return tempDate.getTime() === nowDate.getTime();
}

function getTitle(date) {
    const months = [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember"
    ];
    return months[date.getMonth()] + " " + date.getFullYear();
}

</script>

<template>
<div class="container">
    <div class="bar">
        <p>{{getTitle(calendarMonth)}}</p>
        <div class="chevronsContainer">
            <button @click="pushMonth(-1)">‹</button>
            <button @click="pushMonth( 1)">›</button>
        </div>
    </div>
    <table>
        <tr>
            <th><span>Mo.</span></th>
            <th><span>Di.</span></th>
            <th><span>Mi.</span></th>
            <th><span>Do.</span></th>
            <th><span>Fr.</span></th>
            <th><span>Sa.</span></th>
            <th><span>So.</span></th>
        </tr>
        <tr v-for="calendarRow in calendarRows">
            <td v-for="calendarButton in calendarRow">
                <button 
                    class="calendarButton" 
                    @click="selectCalendarDay(calendarButton.id)" 
                    :selectedMonth="calendarButton.date.getMonth() === calendarMonth.getMonth()"
                    :selectedDay="calendarButton.date.getTime() === userSelectedDay.getTime()"
                    :isToday="isToday(calendarButton.date)"
                    :isWeekend="calendarButton.date.getDay() === 0"
                >
                    {{ calendarButton.text }}
                </button>
            </td>
        </tr>
    </table>
</div>
</template>

<style scoped>
    .container {
        padding: 1em;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    table {
        width: 100%;
        border-spacing: 0px;
    }

    span,p {
        font-weight: bold;
    }

    .bar {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 0.5em;

        align-items: center;
    }

    .chevronsContainer button {
        margin-left: 10px;
        width: 45px;
        height: 45px;

        line-height: 0px;
        background-color: transparent;
        border: none;
        font-size: 1.5em;
        font-weight: bold;
        cursor: pointer;
    }

    table button,span {
        height: 40px;
        width: 40px;

        background-color: transparent;
        border: none;
        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .calendarButton[selectedMonth=false][selectedDay=false] {
        opacity: 0.4;
    }

    .calendarButton[selectedDay=true] {
        background-color: var(--color-pink);
        color: var(--color-white);
        font-weight: bold;
        border-radius: 15px;
        border: 2px solid transparent;
    }

    .calendarButton[selectedDay=false][isToday=true] {
        border-radius: 15px;
        border: 2px solid var(--color-cold-white);
    }



    .calendarButton[selectedDay=false]:hover {
        border-radius: 15px;
        border: 2px solid var(--color-pink);
    }

    .calendarButton[isWeekend=true][selectedDay=false] {
        color: var(--color-red);
    }
</style>