import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  constructor(props = {}) {
    this.props = props
    const { label = '', url = '', data = [], value = 0, range = {}, link = '', formatHeading = (value) => value } = props
    this.label = label
    this.url = url
    this.data = data
    this.value = value
    this.from = range.from ? range.from : new Date()
    this.to = range.to ? range.to : new Date()
    this.link = link
    this.formatHeading = formatHeading
    this.CHART_HEIGHT = 50
    this.render()
    this.dataElements = [...this.element.querySelectorAll('[data-element]')]

    try {
      this.update(this.from, this.to)
    } catch (e) {
      console.log(new Error(e))
    }
    // this.initEventListeners();
  }

  get subElements () {
    const elements = {}

    for (const el of this.dataElements) {
      elements[el.dataset.element] = el
    }

    return elements
  }

  async getData (from, to, api) {
    const uri = `${BACKEND_URL}/${api}?from=${from}&to=${to}`
    const backData = await fetchJson(uri)
    const data = Object.values(backData)
    const value = data.reduce((prev, current) => prev + current, 0)

    return {
      data,
      value,
      backData
    }
  }

  async update (from, to) {
    this.element.classList.add('column-chart_loading')
    const { data, value, backData } = await this.getData(from, to, this.url)
    this.data = data
    this.value = value
    this.subElements.body.innerHTML = this.makeColumns(this.data)
    this.subElements.header.innerHTML = this.formatHeading(this.value)
    this.element.classList.remove('column-chart_loading')
    return backData
  }

  getTemplate () {
    return `
       <div class="column-chart${ this.isEmptyProp() }" style="--chart-height: ${ this.chartHeight }">
        <div class="column-chart__title">
            ${ this.label }
            <a href="${ this.link }" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
             ${ this.formatHeading(this.value) }
            </div>
            <div data-element="body" class="column-chart__chart">
             ${ this.makeColumns() }
            </div>
        </div>
       </div>
    `
  }

  render() {
    const element = document.createElement('div'); // (*)

    element.innerHTML = this.getTemplate();
    // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
    // который мы создали на строке (*)
    this.element = element.firstElementChild;
  }

  initEventListeners () {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }

  get chartHeight() {
    return this.CHART_HEIGHT
  }

  makeColumns() {
    let columns = ``

    for (const column of this.getColumnProps(this.data)) {
      columns += `<div style="--value: ${ column.value }" data-tooltip="${ column.percent }"></div>`
    }

    return columns
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data)
    const scale = 50 / maxValue

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      }
    })
  }

  isEmptyProp() {
    return !this.data.length ? ' column-chart_loading' : ''
  }
}

