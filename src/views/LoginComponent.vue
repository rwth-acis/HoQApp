<template>
  <div class="login">
    <h1>Login successful.</h1>
  </div>
</template>
<script>
import PostService from '../PostService'
export default {
  created(){
    this.$router.push('/my-projects');
  },
}
</script>
<style>
</style>
