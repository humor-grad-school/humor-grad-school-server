<template>
  <div id="app">
    <h1>{{username}}'s Avatar</h1>
    <div>{{avatarUrl}}</div>>
    <input type="file" @change="fileChange($event.target.files[0])"
      accept="image/*|video/*">
  </div>
</template>
<script lang="ts" src="./Avatar.ts"></script>
<style scoped>

</style>
