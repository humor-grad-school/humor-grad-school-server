<template>
  <div>
    <h1>Facebook</h1>
    <div
      class="fb-login-button"
      data-max-rows="1"
      data-size="large"
      data-button-type="continue_with"
      data-show-faces="false"
      data-auto-logout-link="false"
      data-use-continue-as="false"
    ></div>
    <p>Facebook Login Status : {{isLoginSuccessful}}</p>
  </div>
</template>
<script lang="ts" src="./FacebookLoginComponent.ts"></script>
<style>
</style>
