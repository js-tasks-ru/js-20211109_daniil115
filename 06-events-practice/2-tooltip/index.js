class Tooltip {
  static isInstanceExist

  constructor() {
    this.activeTooltip = null
    this.counter = 0

    if (!Tooltip.isInstanceExist) {
      Tooltip.isInstanceExist = this
    } else {
      return Tooltip.isInstanceExist
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
    document.addEventListener('pointermove', this.moveEvent.bind(this))
  }

  overEvent (e) {
    const isToolTip = e.target.dataset.tooltip

    if (isToolTip && isToolTip !== this.activeTooltip) {
      this.previosTooltip = this.activeTooltip
      this.activeTooltip = isToolTip

      this.render(isToolTip)
    }
  }

  outEvent (e) {
    const isToolTip = e.target.dataset.tooltip

    if (isToolTip !== this.previosTooltip) {
      this.destroy()
      this.activeTooltip = null
    }
  }

  moveEvent (e) {
    if (this.element) {
      this.element.style.left = `${ Math.ceil(e.clientX + 7) }px`
      this.element.style.top = `${ Math.ceil(e.clientY - 5) }px`
    }
  }

  destroy () {
    this.element.remove()
  }
}

export default Tooltip;
