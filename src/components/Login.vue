<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { BACKEND_ADRESS } from '@/components/mainHandler.js'

const formData = ref({
    username: '',
    password: ''
});

if(document.cookie != null && document.cookie != undefined && document.cookie.indexOf("sessionKey=") != -1) {
    axios.get("https://" + BACKEND_ADRESS + "/api/user", { withCredentials: true })
    .then((response) => {
        console.log(response.data);
        window.location.replace("/team-schedule");
    })
    .catch((e) => {

    });
}

function login() {
    const username = formData.value.username;
    const password = formData.value.password;

    axios.defaults.withCredentials = true;
    axios.post("https://" + BACKEND_ADRESS + "/api/login", { username, password }, { withCredentials: true, crossDomain: true })
        .then(response => {
            // Handle successful login
            document.cookie = "sessionKey=" + response.data + ";";
            window.location.replace("/team-schedule");
            console.log(response.data);
        })
        .catch(error => {
            // Handle login error
            console.error(error);
        }
    );
}

</script>

<template>
    <form @submit.prevent="login">
        <h2>Login</h2>
        <label for="username">Username:</label>
        <input v-model="formData.username" type="text" id="username" name="username" required autocomplete="username">

        <label for="password">Password:</label>
        <input v-model="formData.password" type="password" id="password" name="password" required autocomplete="current-password">

        <div class="submitContainer">
            <button type="submit">Login</button>
        </div>
    </form>
</template>

<style scoped>
    form {
        max-width: 300px;
        margin: 0 auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
    }

    input {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
    }

    button {
        background-color: var(--color-pink);
        color: #fff;
        padding: 10px 15px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        min-width: 100px;
    }

    .submitContainer {
        margin-top: 1em;
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>