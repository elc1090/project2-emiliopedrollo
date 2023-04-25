<script setup lang="ts">

import {toRef} from 'vue';

defineEmits<{
    (e: 'clicked', id: string): void
}>()

const props = defineProps({
    question: String,
    id: String,
    name: String
})

const id = toRef(props, 'id')

</script>

<template>
    <v-btn block rounded="0" size="x-large" variant="tonal" @click="$emit('clicked',this.id)">{{ name }}</v-btn>
</template>
