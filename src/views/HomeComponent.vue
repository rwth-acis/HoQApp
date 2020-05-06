<template>
  <div>
    <h1>House of Quality app</h1>
    <div class=container4>
      <p style="max-width:950px;">
        The House of Quality application is an extension to the functionalities of the Requirements Bazaar. It allows users, marked as developers from the <a href="https://requirements-bazaar.org/" target="_blank">Requirements Bazaar</a>, to use the method of Quality Function Deployment (QFD) in a form of a diagram called the House of Quality. The main idea is to translate the customer requirements into technical specifications and goals.
      </p>
    </div>
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

div.container4 {
  height: 10em;
  position: relative;
}
div.container4 p {
  font-size: 22px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

</style>
