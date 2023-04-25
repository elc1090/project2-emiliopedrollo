<script setup lang="ts">
import Question from './components/Question.vue'
</script>

<template>
    <v-card max-width="900">
        <v-layout>
            <v-app-bar
                    height="80"
                    class="justify-center"
            >
                <template v-slot:image>
                    <v-img gradient="-1deg, rgba(78,39,40,.9), rgba(226,88,34,.9)">
                        <img
                            class="v-img__img--cover w-100 bg-transparent"
                            height="80"
                            alt="The One Quiz" src="./assets/logo.svg">
                    </v-img>
                </template>

                <v-app-bar-title class="w-100 h-100 align-center justify-center d-flex ma-0">
                    <h2 class="text-h2 font-weight-medium title w-100 d-inline-block" id="title">Who said it?</h2>
                </v-app-bar-title>

            </v-app-bar>
            <v-main class="pa-5">
                <Question quote="teste"/>
            </v-main>
        </v-layout>
    </v-card>
</template>

<style scoped>
header h2#title{
    font-family: Ringbearer,sans-serif !important;
    padding: 0 10px;
    color: #FBC841;
    text-shadow: -1px -2px 6px #FBDF7A, 1px 1px 3px #472b19, 0 0 10px rgba(0,0,0,1), 0 0 2px red;
}
@media (min-width: 1024px) {
}
</style>
