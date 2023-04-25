<script setup lang="ts">
import Option from "./Option.vue";

import {ref} from 'vue';

const count = ref(0)
const rights = ref(0)
const quote = ref('')
const quoteId = ref(0)
const options = ref([])
const finished = ref(false)

async function getQuestion() {
    const ref = await (await fetch('https://real-heavy-paneer.glitch.me/question')).json()
    quote.value = ref.subject
    quoteId.value = ref.id
    options.value = ref.choices
}

function restart() {
    getQuestion().then(() => {
        rights.value = 0
        count.value = 0
        finished.value = false
    })
}

async function sendResponse(id: string) {
    const answer = await (await fetch(`https://real-heavy-paneer.glitch.me/verify?id=${quoteId.value}&answer=${id}`)).json()
    console.log(answer)

    if (answer.result === 'right') rights.value++

    if (++count.value < 10) {
        const ref = await (await fetch('https://real-heavy-paneer.glitch.me/question')).json()
        quote.value = ref.subject
        quoteId.value = ref.id
        options.value = ref.choices
    } else {
        finished.value = true
        // teleport
    }

}

getQuestion()

const props = defineProps({
    quote: String
})
</script>

<template>
    <Suspense>
        <Component v-if=!finished>

            <v-container fluid class="w-100">
                <h2 class="pb-2">Who said:</h2>
                <h3>&ldquo;&nbsp;{{ quote }}&nbsp;&rdquo;</h3>

            </v-container>

            <v-divider class="mt-2"></v-divider>

            <main>
                <v-container class="text-center">
                    <v-row justify="center">
                        <v-col v-for="option in options" cols="12" sm="6">
                            <Option
                                @clicked="sendResponse"
                                v-bind:id="option.id"
                                v-bind:name="option.name"/>
                        </v-col>
                    </v-row>
                </v-container>
            </main>
        </Component>
        <Component v-else>

            <v-container fluid class="w-100 text-center">
                <h2 class="pb-2">Finished</h2>
                <h3>Your score:</h3>

            </v-container>

            <v-divider class="mt-2"></v-divider>

            <main>
                <v-container class="text-center">
                    <h1 class="text-h1 mt-3">{{ rights }}/10</h1>
                    <h5 v-if="rights <= 3" class="mt-3">That was terrible.</h5>
                    <h5 v-else-if="rights <= 5" class="mt-3">Not bad, not good.</h5>
                    <h5 v-else-if="rights <= 7" class="mt-3">Very good, but you can do better.</h5>
                    <h5 v-else-if="rights <= 9" class="mt-3">Awesome</h5>
                    <h5 v-else class="mt-3">Wow, just wow.</h5>

                    <v-btn class="mt-8" block size="x-large" variant="tonal" @click="restart">Try Again!</v-btn>
                </v-container>
            </main>
        </Component>
    </Suspense>
</template>

<style scoped>
</style>
