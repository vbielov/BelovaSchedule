<script setup>
const props = defineProps(['state']);

function reload() {
    location.reload();
}
</script>

<template>
    <div class="textBox" v-show="state == true">
        <h1 class="accepted">✓</h1>
        <h2>Ihre termin würde <br/> erfolgreich gebucht</h2>
        <p>Danke schön!</p>
    </div>
    <div class="textBox" v-show="state == false">
        <h1>⚠️</h1>
        <h2>Ihre termin würde leider nicht akzeptiert</h2>
        <p>Probieren sie nochmal</p>
    </div>
    <div class="backButton">
        <a @click="reload" href="/">Zurück</a>
    </div>
</template>

<style scoped>
    .textBox {
        padding: 1em;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    h2, h1 {
        color: var(--color-dark-blue);
        font-weight: bold;
    }

    .accepted {
        color: var(--color-lime);
    }

    .backButton {
        padding-bottom: 1em;
        display: flex;
        justify-content: center;
    }

    a {
        padding: 0.75em;
        background-color: var(--color-cold-white);
        width: 100px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        border: 5px solid transparent;
        border-radius: 5px 5px;
        opacity: 0.75;
        transition: opacity 0.25s;
    }

    a:hover {
        opacity: 1;
    }
</style>