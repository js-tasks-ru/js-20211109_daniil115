class Tooltip {
  static checkInstance

  constructor() {
    if (!Tooltip.checkInstance) {
      Tooltip.checkInstance = this
    } else {
      return Tooltip.checkInstance
    }
  }

  get template () {
    return `
     <div class="tooltip">
       ${ this.tooltipInner }
     </div>
    `
  }

  render (value = '') {
    const element = document.createElement('div')
    this.tooltipInner = value
    element.innerHTML = this.template
    this.element = element.firstElementChild
    document.body.append(this.element)
  }

  initialize () {
    document.addEventListener('pointerover', this.overEvent.bind(this))
    document.addEventListener('pointerout', this.outEvent.bind(this))
  }

  overEvent (e) {
    const isToolTip = e.target.dataset.tooltip

    if (isToolTip) this.render(e.target.dataset.tooltip)
  }

  outEvent (e) {
    const isToolTip = e.target.dataset.tooltip

    if (isToolTip) {
      this.destroy()
      document.removeEventListener('pointerover', this.overEvent.bind(this))
      document.removeEventListener('pointerout', this.outEvent.bind(this))
    }
  }

  destroy () {
    this.element.remove()
  }
}

export default Tooltip;
