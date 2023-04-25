<script setup lang="ts">

import {toRef} from 'vue';

defineEmits<{
    (e: 'clicked', id: string): void
}>()

const props = defineProps<{
    id: string,
    name: string
}>()

const id = toRef(props, 'id')

</script>

<template>
    <v-btn block rounded="0" size="x-large" variant="tonal" @click="$emit('clicked',id)">{{ name }}</v-btn>
</template>
