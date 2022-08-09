<template>
  <div class="desktop h-100">
    <div style="height: 75px">
      <TopBar msg="Welcome to Your Vue.js App" />
    </div>
    <div style="calc(100% - 75px)">
      <WindowArea />
      <div calss="windows-arae">
        <window
          class=""
          :windowStyle="style"
          v-for="(item, i) in windows"
          :key="i"
          :id="i"
          v-show="item.show"
        >
          sss</window
        >
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import WindowArea from './components/WindowArea.vue'

import window from "./window/window.vue";
import { StyleBlack } from './window/style'
import VueEvent from './mitt'

export default {
  name: 'Desktop',
  components: {
    TopBar,
    WindowArea,
    window
  },
  data () {
    return {
      style: StyleBlack,
      windows: []
    }
  },
  created () {
    VueEvent.on("openWin", this.openWin)
    VueEvent.on("hidewindow", this.hidewindow)
    VueEvent.on("maxwindow", this.maxwindow)
    VueEvent.on("closewindow", this.closewindow)
  },
  methods: {
    openWin (v) {
      this.windows.push(v)
    },
    hidewindow (i) {
      this.windows[i].show = false
    },
    maxwindow (i) {
      this.windows[i].max = true
    },
    closewindow (i) {
      this.windows.splice(i, 1)
    }
  },
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
#app {
  height: 100%;
}
.desktop {
  background-color: rgb(127, 212, 255);
  background-image: url(/images/bg_08.jpg);
  background-repeat: round;
}
.windows {
  position: absolute;
}
.windows-arae {
  position: absolute;
}
.d-flex {
  display: flex;

  .flex-shrink-1 {
    flex-shrink: 1;
  }
}
.h-100 {
  height: 100% !important;
}
.h-75 {
  height: 750% !important;
}
.h-50 {
  height: 50% !important;
}
.h-25 {
  height: 25% !important;
}
.w-100 {
  width: 100% !important;
}
.w-75 {
  width: 75% !important;
}
.w-50 {
  width: 50% !important;
}
.w-25 {
  width: 25% !important;
}
</style>
