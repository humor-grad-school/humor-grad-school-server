<template>
  <div id="app">
    <h1>Hello World</h1>
    <div :id="googleLoginWrapperId"></div> <!-- this is custom button by google! -->
    <div class="g-signin2" data-onsuccess="global_function"></div> <!-- this is default button by google! -->
    <div v-if="isLoginFinished">
      <div v-if="isLoginSuccessful">
        <h1>Welcome to the Humor Grad School with Google!</h1>
        <button @click="signOut">Google Logout Button</button>

        <div v-if="isNeedSignUp">
          <h1>More information Please To Finish Sign Up</h1>
          <div>
            Username<input v-model="username" placeholder="username">
            <button @click="signUp">sign up</button>
          </div>
        </div>
      </div>
      <div v-else>
        fail reason : {{googleLoginError}}
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
