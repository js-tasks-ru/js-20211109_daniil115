export default class ColumnChart {
  constructor(props = {}) {
    this.props = props
    const { label = '', data = [], link = '', value = 0, formatHeading = (value) => value } = props
    this.label = label
    this.data = data
    this.link = link
    this.value = value
    this.CHART_HEIGHT = 50
    this.formatHeading = formatHeading
    this.render()


    // this.initEventListeners();
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

  update() {
    const columns = document.querySelector(`.column-chart__chart`)
    columns.innerHTML = this.makeColumns(this.data)
  }

  isEmptyProp() {
    return !Object.keys(this.props).length ? ' column-chart_loading' : ''
  }
}
