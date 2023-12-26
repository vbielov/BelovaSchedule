<script setup>
    const props = defineProps(['title']);

</script>

<template>
    <li class="serviceElement">
        <button class="serviceButton">
            {{ props.title }}
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

        font-weight: bold;
        font-size: medium;
        color: var(--color-white);
        background-color: var(--color-pink);
        transition: background-color 0.25s;

        border: 5px solid transparent;
        border-radius: 10px 10px;
    }

    .serviceButton:hover {
        background-color: var(--color-red);
    }
</style>