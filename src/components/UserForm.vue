<script setup>
import { Form, userSelectedService, userSelectedDate } from '@/components/mainHandler.js';
const props = defineProps(['callback']);
import { ref } from 'vue';

function book() {
    const phoneElement = document.getElementById('phone-input');
    const forenameElement = document.getElementById('forename-input');
    const surnameElement = document.getElementById('surname-input');
    const commentElement = document.getElementById('comment-input');
    
    const phoneValue = phoneElement ? phoneElement.value : '';
    const forenameValue = forenameElement ? forenameElement.value : '';
    const surnameValue = surnameElement ? surnameElement.value : '';
    const commentValue = commentElement ? commentElement.value : '';
    
    props.callback(new Form(phoneValue, forenameValue, surnameValue, commentValue));
}

const textarea = ref(null)

function autoResize() {
    textarea.value.style.height = 'auto';
    textarea.value.style.height = (textarea.value.scrollHeight + 10).toString() + 'px';
}

// 26.12 um 11:00 (30Min.) 50,00€
function formatAppoimentInfo(date, service) {
    if(date == undefined || service == undefined) {
        return "Not valid appoiment";
    }
    
    const parsedDate = new Date(date);
    const day = parsedDate.getDate();
    const month = parsedDate.getMonth() + 1;
    const hours = parsedDate.getHours().toString().padStart(2, '0');
    const minutes = parsedDate.getMinutes().toString().padStart(2, '0');

    return day + '.' + month + " um " + hours + ':' + minutes + " " + service.duration + " " + service.price;
}

function test(test) {
    console.log(test);
    return test;
}

function validate() {
    return false;
}

</script>

<template>
    <div class="textContainer">
        <h3 class="title">{{ userSelectedService.name }}</h3>
        <p class="subTitle">{{ formatAppoimentInfo(userSelectedDate, userSelectedService) }}</p>
    </div>
    <form @submit.prevent="book">
        <label for="phone-input">Telefon:</label>
        <input id="phone-input" type="tel" value="" placeholder="e.g., +49123456789" pattern="(\+49)?[1-9][0-9]{1,14}" required>
        <label for="forename-input">Vorname:</label>
        <input id="forename-input" type="text" value="" placeholder="..." required>
        <label for="surname-input">Nachname:</label>
        <input id="surname-input" type="text" value="" placeholder="..." required>
        <label for="comment-input">Kommentar (max. 150 Symbolen):</label>
        <textarea ref="textarea" @input="autoResize" id="comment-input" maxlength="150" placeholder="..."></textarea>
        <div class="bookContainer">
            <input type="submit" class="bookButton" value="Termin buchen 📅"/>
        </div>
    </form>


</template>

<style scoped>
.textContainer {
    padding-top: 1em;
}

.title {
    display: flex;
    justify-content: center;
    font-weight: bold;
}

.subTitle {
    display: flex;
    justify-content: center;
    color: var(--color-gray);
}

form {
    display: flex;
    flex-direction: column;
    padding: 1em;
    max-width: 100%;
}

form label {
    color: var(--color-gray);
}

form input, form textarea {
    font-size: 1.25em;
    margin: 0em 0em 0.5em 0em;
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

.bookContainer {
    display: flex;
    justify-content: center;
    padding-top: 1em;

}

.bookButton {
    padding: 0.25em 1em;
    font-size: large;
    background-color: var(--color-pink);
    font-weight: bold;
    color: var(--color-white);
    border: 5px solid transparent;
    border-radius: 10px 10px;
    cursor: pointer;
    transition: background-color 0.25s;
}

.bookButton:hover {
    background-color: var(--color-red);
}
</style>