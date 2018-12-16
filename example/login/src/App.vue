<template>
  <div id="app">
    <h1>Hello World</h1>
    <KakaoLoginComponent
      @login-humor="loginToHumor"
    ></KakaoLoginComponent>

    <div v-if="isNeedSignUp">
      <h1>More information Please To Finish Sign Up</h1>
      <div>
        Username<input v-model="username" placeholder="username">
        <button @click="signUp">sign up</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./App.ts"></script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
