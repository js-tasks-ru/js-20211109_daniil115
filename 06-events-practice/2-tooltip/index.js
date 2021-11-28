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
    document.addEventListener('mousemove', this.moveEvent.bind(this))
  }

  overEvent (e) {
    const isToolTip = e.target.dataset.tooltip

    if (isToolTip && isToolTip !== this.activeTooltip) {
      if (this.element) this.destroy()
      this.activeTooltip = isToolTip

      this.render(isToolTip)
    }
  }
  // TODO
  // Не понятно, почему при выводе в консоль срабатывает то undefined, то само значение data-tooltip.
  // И как таким образом скрывать tooltip, если он вышел за пределы этого data-tooltip?
  // Получилось только с pointerover.
  outEvent (e) {
    const isToolTip = e.target.dataset.tooltip
    console.log(isToolTip)
  }

  moveEvent (e) {
    if (this.element) {
      this.element.style.left = `${ Math.floor(e.clientX) }px`
      this.element.style.top = `${ Math.floor(e.clientY) }px`
    }
  }

  destroy () {
    this.element.remove()
  }
}

export default Tooltip;
