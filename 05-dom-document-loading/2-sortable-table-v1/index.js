export default class SortableTable {
  constructor(headerConfig = [], { data = [] }) {
    this.data = data
    this.headerConfig = headerConfig
    this.flowSort = null
    this.typeSort = null
    this.render()

    this.dataElements = [...this.element.querySelectorAll('[data-element]')]
  }

  render () {
    const element = document.createElement('div')
    element.innerHTML = this.template
    this.element = element.firstElementChild
  }

  get template () {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${ this.createHeader(this.headerConfig) }
          </div>

          <div data-element="body" class="sortable-table__body">
            ${ this.createBody(this.data) }
          </div>

          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  get subElements () {
    const elements = {}

    for (const el of this.dataElements) {
      elements[el.dataset.element] = el
    }

    return elements
  }

  createHeader (header) {
    return header
      .map(head => {
        const columnTitle = `
        <div
          class="sortable-table__cell"
          data-id="${ head.id }"
          data-sortable="${ head.sortable }"
           >
          <span>${ head.title }</span>
        `
        const arrow = `
        <span
           data-element="arrow"
           class="sortable-table__sort-arrow"
           style="display: ${ head.arrow ? 'inline-flex' : 'none' }"
          >
          <span class="sort-arrow"></span>
        </span>
        </div>
        `
        return columnTitle
      })
      .join('')
  }

  createBody (data) {
    return data
      .map(row => {
        return `
        <a href="/products/${ row.id }" class="sortable-table__row">
          ${ this.isImgColumnExist(row.images) }
          <div class="sortable-table__cell">${ row.title }</div>
          ${ this.isBasicColumnExist(row.quantity) }
          <div class="sortable-table__cell">${ row.price }</div>
          <div class="sortable-table__cell">${ row.sales }</div>
        </a>
        `
      })
      .join('')
  }

  isImgColumnExist (column) {
    if (column) {
      return `
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${ column[0].url }">
        </div>
      `
    }
    return ''
  }

  isBasicColumnExist (column) {
    if (column) {
      return `
       <div class="sortable-table__cell">${ column }</div>
      `
    }
  }

  sort (type, flow) {
    if (this.flowSort !== flow || this.typeSort !== type) {
      this.flowSort = flow
      this.typeSort = type

      if (type === 'title') {
        this.data.sort((a, b) => {
          if (flow === 'desc') {
            const result = b[type].localeCompare(a[type], ['ru', 'en'], { caseFirst: 'upper' })
            return result !== 0 ? result : -1
          }

          return a[type].localeCompare(b[type], ['ru', 'en'], { caseFirst: 'upper' })
        })
      }

      if (type === 'price') {
        const direction = {
          asc: 1,
          desc: 0
        }

        this.data.sort((a, b) => direction[flow] ? a[type] - b[type] : b[type] - a[type])
      }

      const { body } = this.subElements
      body.innerHTML = this.createBody(this.data)
    }
  }

  destroy () {
    this.element.remove()
  }
}

