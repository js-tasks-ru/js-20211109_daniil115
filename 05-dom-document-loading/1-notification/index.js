export default class NotificationMessage {
  constructor (message, { duration = 0, type = 'error' } = {}) {
    this.duration = duration
    this.type = type
    this.message = message
    this.id = 'added'
    this.show()
  }

  getTemplate () {
    return `
      <div id="${ this.id }" class="notification ${ this.type }" style="--value:${ this.humanTime }">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">
              ${ this.type }
          </div>
          <div class="notification-body">
              ${ this.message }
          </div>
        </div>
      </div>
    `
  }

  show (div) {
    const element = !div ? document.createElement('div') : div
    element.innerHTML = this.getTemplate()
    this.element = element.firstElementChild
    const isExist = document.querySelector(`#${ this.id }`)
    !isExist ? document.body.append(this.element) : null

    this.remove()
  }

  destroy () {
    this.element.remove()
  }

  get humanTime () {
    return `${this.duration / 1000}s`
  }

  remove () {
    setTimeout(() => {
      this.destroy()
    }, this.duration)
  }
}
