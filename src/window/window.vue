<template>
  <transition
    name="fade"
    @after-leave="$emit('close')"
    @after-enter="$emit('open')"
  >
    <div
      v-show="isOpen"
      class="window"
      :style="styleWindow"
      ref="window"
      @mousedown="activate"
      @touchstart="activate"
    >
      <div class="titlebar" :style="styleTitlebar" ref="titlebar">
        <div class="title">
          <template v-if="$slots.title">
            <slot name="title" />
          </template>
          <template v-else>{{ title }}</template>
        </div>
        <template v-if="closeButton">
          <buttons :id="id"></buttons>
        </template>
      </div>
      <div class="content" :style="styleContent" ref="content">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script> 
import { ZElement } from './z_element'
import DraggableHelper from './draggable_helper'
import { ResizableHelper } from "./resizable_helper";
import { windows, fixPosition } from './windows'
import { naturalSize } from "./dom";
import VueEvent from '../mitt';
import buttons from './buttons.vue'

var instances = []
function css2num (s) {
  return s !== null ? parseFloat(s) : 0
}


function contentSize (el) {
  const s = window.getComputedStyle(el)
  const width = Math.ceil([s.paddingLeft, s.width, s.paddingRight].map(css2num).reduce((a, b) => a + b))
  const height = Math.ceil([s.paddingTop, s.height, s.paddingBottom].map(css2num).reduce((a, b) => a + b))
  return { width, height }
}


export class WindowResizeEvent {
  constructor(width, height) {
    this.width = width
    this.height = height
  }
}


function leftTop (w) {
  const el = w.windowElement()
  const left = parseFloat(el.style.left || 'NaN')
  const top = parseFloat(el.style.top || 'NaN')
  if (!isNaN(left) && !isNaN(top))
    return { left, top }
  return null
}


function distance2 (x1, y1, x2, y2) {
  const dx = x1 - x2
  const dy = y1 - y2
  return dx * dx + dy * dy
}
export default {
  components: {
    buttons
  },
  props: {
    id: { type: String, default: '' },
    isOpen: { type: Boolean, default: true },
    title: { type: String, default: '' },
    closeButton: { type: Boolean, default: true },
    resizable: { type: Boolean, default: true },
    isScrollable: { type: Boolean, default: false },
    padding: { type: Number, default: 8 },
    activateWhenOpen: { type: Boolean, default: true },
    positionHint: { type: String },
    zGroup: { type: Number, default: 0 },
    overflow: { type: String, default: 'visible' },
    left: { type: Number },
    top: { type: Number },
    width: { type: Number, default: 300 },
    height: { type: Number, default: 200 },
    minWidth: { type: Number, default: 200 },
    minHeight: { type: Number, default: 150 },
    maxWidth: { type: Number },
    maxHeight: { type: Number },
    windowStyle: { type: Object },


  },
  data () {
    return {
      zIndex: 'auto',
      openCount: 0
    }
  },
  inject () {

  },
  methods: {
    activate () {
      this.zElement.raise()
      this.$emit('activate')
    },
    initResizeHelper () {
      const { height: titlebarHeight } = naturalSize(this.titlebarElement())
      this.resizableHelper = new ResizableHelper(this.windowElement(), {
        onResize: () => this.onWindowResize(),
        onResizeStart: () => this.$emit('resize-start'),
        onResizeEnd: () => this.$emit('resize-end'),
        minWidth: this.minWidth,
        minHeight: this.minHeight + titlebarHeight,
        maxWidth: this.maxWidth,
        maxHeight: this.maxHeight ? this.maxHeight + titlebarHeight : undefined,
      })
    },

    onWindowResize (emitUpdateEvent = true) {
      const w = this.windowElement()
      const t = this.titlebarElement()
      const c = this.contentElement()
      const { width: cW0, height: cH0 } = contentSize(c)
      const { width: wW, height: wH } = contentSize(w)
      const tH = contentSize(t).height
      const cW1 = wW - (c.offsetWidth - cW0)
      const cH1 = (wH - tH - (c.offsetHeight - cH0))
      c.style.width = `${cW1}px`
      c.style.height = `${cH1}px`
      fixPosition()
      this.$emit('resize', new WindowResizeEvent(cW1, cH1))
      if (emitUpdateEvent) {
        this.$emit('update:width', cW1)
        this.$emit('update:height', cH1)
      }
    },
    fixPosition () {
      const w = this.windowElement()
      const rect = w.getBoundingClientRect()
      if (rect.left < 0) w.style.left = `0px`
      if (rect.top < 0) w.style.top = `0px`
      if (rect.right > window.innerWidth) w.style.left = `${window.innerWidth - rect.width}px`
      if (rect.bottom > window.innerHeight) w.style.top = `${window.innerHeight - rect.height}px`

    },
    onWindowMove (emitUpdateEvent = true) {
      this.fixPosition()
      const { left, top } = this.windowElement().getBoundingClientRect()
      if (emitUpdateEvent) {
        this.$emit('update:left', left)
        this.$emit('update:top', top)
      }
    },
    setInitialPosition () {
      const el = this.windowElement()
      const { width, height } = naturalSize(el)
      let left
      let top
      if ((this.left !== undefined) != (this.top !== undefined)) {
        throw new Error(`Either of left or top is specified. Both must be set or not set.`)
      }
      if (typeof this.left == 'number') {
        left = this.left
        top = this.top
      }
      else {
        const positionString = this.positionHint || 'auto'
        switch (positionString) {
          case 'auto':
            {
              let x = 20
              let y = 50
              let nTries = 0
              do {
                if (instances.every(j => {
                  if (!j.isOpen || this == j)
                    return true
                  const p = leftTop(j)
                  if (p == null)
                    return true
                  const { left, top } = p
                  return distance2(left, top, x, y) > 16
                })) {
                  break
                }
                x = (x + 40) % (window.innerWidth - 200)
                y = (y + 40) % (window.innerHeight - 200)
              } while (++nTries < 100)
              left = x
              top = y
            }
            break
          case 'center':
            left = (window.innerWidth - width) / 2
            top = (window.innerHeight - height) / 2
            break
          default:
            try {
              const nums = positionString.split('/').map(Number)
              if (nums.length != 2)
                throw null
              const [x, y] = nums
              if (!isFinite(x) || !isFinite(y))
                throw null
              left = x >= 0 ? x : window.innerWidth - width + x
              top = y >= 0 ? y : window.innerHeight - height + y
            }
            catch (e) {
              throw new Error(`invalid position string: ${positionString}`)
            }
        }
      }
      el.style.left = `${left}px`
      el.style.top = `${top}px`
    },
    closeButtonClick () {
      VueEvent.emit('closebuttonclick')
      VueEvent.emit('update:isOpen', false)
    },
    setWindowRect ({ width, height, top, left }) {
      const w = this.windowElement()
      if (width != undefined) {
        w.style.width = `${width}px`
      }
      if (height != undefined) {
        const tHeight = contentSize(this.titlebarElement()).height
        w.style.height = `${height + tHeight}px`
      }
      if (left != undefined) {
        w.style.left = `${left}px`
      }
      if (top != undefined) {
        w.style.top = `${top}px`
      }
    },
    windowElement () {
      return this.$refs.window
    },
    titlebarElement () {
      return this.$refs.titlebar
    },

    contentElement () {
      return this.$refs.content
    },
    onIsOpenChange (isOpen) {
      if (isOpen) {
        this.$nextTick(() => {
          if (this.openCount++ == 0) {
            this.setWindowRect(this)
            this.setInitialPosition()
          }
          this.resizable && this.onWindowResize()
          this.onWindowMove()
          this.draggableHelper = new DraggableHelper(this.titlebarElement(), this.windowElement(), {
            onMove: () => this.onWindowMove(),
            onMoveStart: () => this.$emit('move-start'),
            onMoveEnd: () => this.$emit('move-end'),
          })
          this.resizable && this.initResizeHelper()
        })
        this.activateWhenOpen && this.activate()
      }
    }
  },
  watch: {
    resizable () {

    },
    isOpen: function (isOpen) {
      this.onIsOpenChange(isOpen)
    },
    zGroup: function () {
      this.zElement.group = this.zGroup
    },
    left: function (val) {
      this.setWindowRect({ val })
      this.onWindowMove(false)
    },
    top (top) {
      this.setWindowRect({ top })
      this.onWindowMove(false)
    },
    width (width) {
      this.setWindowRect({ width })
      this.onWindowResize(false)
    },
    height (height) {
      this.setWindowRect({ height })
      this.onWindowResize(false)
    }
  },
  computed: {


    styleWindow () {
      return { ...this.windowStyle.window, zIndex: this.zIndex, overflow: this.overflow }
    },
    styleTitlebar () {
      return this.windowStyle.titlebar
    },
    styleContent () {
      const style = { ...this.windowStyle.content };

      if (this.resizable) {
        style.padding = '0';
      } else if (this.padding != undefined) {
        style.padding = `${this.padding}px`
      }

      if (this.isScrollable) {
        style.overflow = 'auto';
      }

      return style;
    },

  },
  mounted () {
    instances.push(this)
    this.zElement = new ZElement(this.zGroup, zIndex => this.zIndex = `${zIndex}`)
    this.isOpen && this.onIsOpenChange(true)
    windows.add(this)
  },
  beforeUnmount () {
    windows.delete(this)
    this.zElement.unregister()
    this.resizableHelper && this.resizableHelper.teardown()
    this.draggableHelper && this.draggableHelper.teardown()
    instances.splice(instances.indexOf(this), 1)
  }
}

window.addEventListener('resize', () => fixPosition())
</script>

<style lang="scss" scoped>
.window {
  display: flex;
  flex-flow: column;
  position: absolute;
  border-radius: 4pt 4pt 0 0;
}

.titlebar {
  display: flex;
  flex-flow: row nowrap;
  border-radius: 4pt 4pt 0 0;
  font-family: sans-serif;
  flex: 0 0 auto;
}

.title {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content {
  flex-grow: 1;
  padding: 0.5em;
}

.draggable-handle {
  cursor: inherit;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.2s;
}
</style>
