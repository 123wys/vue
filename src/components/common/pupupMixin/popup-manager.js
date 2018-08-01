import Vue from 'vue'
import overlayOpt from './overlay'
import {getDOM, getZIndex} from './utils'
const Overlay = Vue.extend(overlayOpt)

const PopupManager = {
  instances: [],
  overlay: false,
  //  入参instance为模态框内容
  open (instance) {
    if (!instance || this.instances.indexOf(instance) !== -1) return
    if (this.instances.length === 0) {
      this.showOverlay(instance.overlayColor, instance.overlayOpacity)
    }
    this.instances.push(instance)
    this.overlay.zIndex = getZIndex();
    this.changeOverlayStyle()
    const dom = getDOM(instance.$el)
    dom.style.zIndex = getZIndex();
  },

  close (instance) {
    let index = this.instances.indexOf(instance)
    if (index === -1) return
    Vue.nextTick(() => {
      this.instances.splice(index, 1)
      if (this.instances.length === 0) {
        this.closeOverlay()
      }
      if (this.overlay) {
        this.overlay.zIndex = this.overlay.zIndex - 2;
      }
      this.changeOverlayStyle()
    })
  },

  showOverlay (color, opacity) {
    let overlay = this.overlay = new Overlay().$mount();
    overlay.fixed = true
    overlay.color = color
    overlay.opacity = opacity
    overlay.onClick = this.handlerOverlayClick.bind(this)
    // overlay.$appendTo(document.body)
    document.body.appendChild(overlay.$el)

    // body 操作
    this.bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  },

  closeOverlay () {
    if (!this.overlay) return
    document.body.style.overflow = this.bodyOverflow
    let overlay = this.overlay
    this.overlay = null
    // overlay.$remove(() => {
    //   overlay.$destroy()
    // })
    overlay.$el.remove();
  },

  changeOverlayStyle () {
    if (!this.overlay || this.instances.length === 0) return
    const instance = this.instances[this.instances.length - 1]
    this.overlay.color = instance.overlayColor
    this.overlay.opacity = instance.overlayOpacity
  },

  handlerOverlayClick () {
    if (this.instances.length === 0) return
    const instance = this.instances[this.instances.length - 1]
    if (instance.overlayClick) {
      instance.overlayClick()
    }
  }
}

window.addEventListener('keydown', function (event) {
  if (event.keyCode === 27) { // ESC
    if (PopupManager.instances.length > 0) {
      const topInstance = PopupManager.instances[PopupManager.instances.length - 1]
      if (!topInstance) return
      if (topInstance.escPress) {
        topInstance.escPress()
      }
    }
  }
})

export default PopupManager
