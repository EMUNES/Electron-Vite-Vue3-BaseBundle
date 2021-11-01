<template>
  <div>
    <router-link to="/">Color was set tailwind css:</router-link> | 

    <router-link to="/landing/">LandingPage</router-link>
  </div>

  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
}
</script>
