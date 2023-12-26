<script setup>
import { Form } from '@/components/mainHandler.js';
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

</script>

<template>
    <form>
        <label for="phone-input">Telefon:</label>
        <input id="phone-input" type="tel" value="" placeholder="+4911111111111">
        <label for="forename-input">Vorname:</label>
        <input id="forename-input" type="text" value="" placeholder="...">
        <label for="surname-input">Nachname:</label>
        <input id="surname-input" type="text" value="" placeholder="...">
        <label for="comment-input">Kommentar (max. 150 Symbolen):</label>
        <textarea ref="textarea" @input="autoResize" id="comment-input" maxlength="150" placeholder="..."></textarea>
    </form>
    <div class="bookContainer">
        <button @click="book()" class="bookButton">Termin buchen 📅</button>
    </div>

</template>

<style scoped>
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
    padding: 1em;

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