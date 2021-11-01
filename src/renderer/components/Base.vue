<template>
  <div class="text-green-500">
    This is the base content.
  </div>

  <div class="text-blue-500">
    {{ message }}
  </div>
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()

const message = store.state.message
</script>

<script>
export default {
  name: 'TopBar'
}
</script>