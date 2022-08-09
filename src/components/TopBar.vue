<template>
  <div class="topbar w-100">
    <div class="k-box-inner h-100">
      <div class="k-host-name h-100"></div>
      <div class="k-main-menu-btn"></div>
      <div class="k-window-dock"></div>
      <div class="k-search"></div>
      <div class="k-user"></div>
      <div class="k-toolbar-btn"></div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.topbar {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.1);
  height: 75px;
}
.k-box-inner {
  overflow: hidden;
  position: relative;
  left: 0;
  top: 0;
}
.k-box-inner {
  .k-host-name {
    width: 2rem;
    opacity: 0.8;
    background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0),
      3%,
      rgba(255, 255, 255, 0.9)
    );
  }
  .k-main-menu-btn {
  }
}
</style>