<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
     <box gap="10px 10px">
      <x-button :gradients="['#1D62F0', '#19D5FD']">iOS Gradients</x-button>
      <x-button :gradients="['#A644FF', '#FC5BC4']">iOS Gradients</x-button>
      <x-button :gradients="['#FF2719', '#FF61AD']">iOS Gradients</x-button>
      <x-button :gradients="['#6F1BFE', '#9479DF']">iOS Gradients</x-button>
      <x-button :gradients="['#FF5E3A', '#FF9500']">iOS Gradients</x-button>
    </box>
  </div>
</template>

<script>
import { XButton, Box } from 'vux'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    XButton,
    Box
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
@import '../static/styles/common.css';
@import '../static/styles/common.scss';
$color:red;



h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
  background-color:$bgcolor;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: $color;
}
</style>
