<template>
  <div class="w-100 h-100">
    <div></div>
    <div class="desktop-window-area">
      <div
        v-for="(item, i) in apps"
        :key="i"
        class="desktop-shortcut"
        @click="openApp(item)"
      >
        <div class="desktop-shortcut-bg">
          <div class="desktop-shortcut-image">
            <img :src="'./images/weibiaoti-2-0' + (i + 1) + '.png'" />
          </div>
        </div>
        <div class="text-box">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import VueEvent from '../mitt'

export default {
  data () {
    return {
      apps: [
        {
          icon: "",
          name: "控制台",
          src: ""
        },
        {
          icon: "",
          name: "通知中心",
          src: ""
        }, {
          icon: "",
          name: "三维平台",
          src: ""
        }
      ]
    }
  },
  methods: {
    openApp (item) {
      item.show = true
      VueEvent.emit("openWin", item)
    }
  }
}
</script>

<style lang="scss" scoped>
.desktop-window-area {
  width: 1200px;
  margin: auto;
  display: flex;
  .desktop-shortcut {
    height: 200px;
    width: 175px;
    margin: 1rem;
    &:hover {
      .desktop-shortcut-image {
        top: 0.25rem;
      }
    }
    cursor: pointer;
  }
  .desktop-shortcut-bg {
    height: 7rem;
  }
  .desktop-shortcut-image {
    position: relative;
    top: 0.625rem;
    height: 6.25rem;
    width: 6.25rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.8);
    box-sizing: border-box;
    border-radius: 1.5rem;
    background-size: cover;
    margin: auto;
    transition: all 0.4s ease;
    background-color: rgba(235, 235, 235, 0.834);
    img {
      width: 80%;
      height: 80%;
      margin: auto;
    }
  }
  .text-box {
    color: #fff;
    text-align: center;
    height: 2rem;
    padding: 5px;
    margin: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
    font-weight: 700;
    font-size: 1.125rem;
    cursor: pointer;
  }
}
</style>