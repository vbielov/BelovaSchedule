<script setup>
const props = defineProps(['service']);

function formatDuration(minutes) {
    return "(" + minutes + " min.)";
}

function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + '€';
}

</script>

<template>
    <li class="serviceElement">
        <button class="serviceButton">
            {{ props.service.name }}
            <p>{{ formatDuration(props.service.durationMinutes) }} {{ formatPrice(props.service.price) }}</p>
        </button>
    </li>
</template>

<style scoped>
    .serviceElement {
        list-style: none;
        margin: 0em 1em 1em;
        text-align: center;
    }
    
    .serviceButton {
        cursor: pointer;
        width: 100%;
        height: 100%;
        padding: 0.75em 1.0em;
        background-color: transparent;

        font-family: "Source Sans Pro", "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
        font-weight: bold;
        font-size: medium;

        color: var(--color-white);
        background-color: var(--color-pink);
        transition: background-color 0.25s;

        border: 5px solid transparent;
        border-radius: 10px 10px;
    }

    .serviceButton p {
        color: var(--color-light-gray)
    }

    .serviceButton:hover {
        background-color: var(--color-red);
    }
</style>