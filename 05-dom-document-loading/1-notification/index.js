export default class NotificationMessage {
  static isElementExist

  constructor (message = '', { duration = 0, type = 'error' } = {}) {
    this.duration = duration
    this.type = type
    this.message = message

    this.render()
  }

  get getTemplate () {
    return `
      <div class="notification ${ this.type }" style="--value:${ this.humanTime }">
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

  render () {
    const element = document.createElement('div')
    element.innerHTML = this.getTemplate
    this.element = element.firstElementChild
  }

  show (div = document.body) {
    if (NotificationMessage.isElementExist) {
      NotificationMessage.isElementExist.destroy()
    }

    NotificationMessage.isElementExist = this
    div.append(this.element)
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
