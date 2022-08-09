<template>
  <div class="win-buttons" :disabled="disabled" @mousedown.stop>
    <div class="button" @click="hidewindow">&minus;</div>
    <div class="button" @click="maxwindow">&square;</div>
    <div class="button" @click="closewindow">&times;</div>
  </div>
</template>

<script> 
import VueEvent from '../mitt';

export default {
  props: {
    id: { type: String, require: true },
    disabled: { type: Boolean, default: false },
  },
  data () {
    return {
      hover: false,
      active: false,
    };
  },
  computed: {

  },
  methods: {
    hidewindow () {
      VueEvent.emit('hidewindow', this.id)
    },
    maxwindow () {
      VueEvent.emit('maxwindow', this.id)
    },
    closewindow () {
      VueEvent.emit('closewindow', this.id)
    }
  },
};
</script>


<style lang="scss" scoped>
.win-buttons {
  display: flex;
}
.button {
  background-color: transparent;
  border: none;
  font-size: medium;
  width: 1.5rem;
  margin: 2px;
  border-radius: 2pt;
  cursor: pointer;
  text-align: center;
  &:hover {
    background-color: rgba(149, 149, 149, 0.6);
    color: #fff;
  }
}
</style>
