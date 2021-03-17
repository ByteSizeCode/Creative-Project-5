<template>
<div id="app">
  <div class="content">
    <router-view />
  </div>
</div>
</template>

<style>
/* green yellow red orange */
/* 96ceb4 ffeead d9534f ffad60 */
body {
  margin: 0px;
  background: #F7F5F7;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main {
  padding: 20px 100px;
}


h1 {
  font-size: 16px;
}

h2 {
  font-size: 12px;
}

.space-right {
  margin-right: 10px;
}

a {
  color: #ffad60;
}


</style>
