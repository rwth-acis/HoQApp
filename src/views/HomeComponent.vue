<template>
  <div>
    <h1>Welcome to (AppName)!</h1>
  </div>
</template>

<script>

export default {
  name: 'HomeComponent',
  async created () {
    document.title = "Home";
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
