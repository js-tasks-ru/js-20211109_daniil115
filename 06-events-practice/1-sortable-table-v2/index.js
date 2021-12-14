export default class SortableTable {
  constructor(headerConfig = [], { data = [], sorted = {} } = {}, isSortLocally = true) {
    this.data = data
    this.headerConfig = headerConfig
    this.foundColumn = this.getFoundColumn(this.headerConfig)
    this.flowSort = sorted.order || 'asc'
    this.typeSortId = sorted.id || this.foundColumn.id || 'title'
    this.typeSort = this.foundColumn.sortType
    this.isSortLocally = isSortLocally
    this.activeColumnElement = null
    this.isFirstSort = true

    this.init()
  }

  render () {
    const element = document.createElement('div')
    element.innerHTML = this.template
    this.element = element.firstElementChild
    this.dataElements = [...this.element.querySelectorAll('[data-element]')]

    const subElementsToArr = [...this.subElements.header.children]
    this.activeColumnElement = subElementsToArr.filter(el => el.dataset.id === this.typeSortId)[0]
    this.addArrow()
  }

  init () {
    if (this.headerConfig.length) {
      this.render()

      this.sort(this.typeSortId, this.flowSort, this.typeSort)

      this.initializeListeners()
    }
  }

  getFoundColumn (columns) {
    return columns.find(item => item.sortable)
  }

  initializeListeners () {
    const { header } = this.subElements

    header.addEventListener('pointerdown', this.pointerDownEvent.bind(this), true)
  }

  pointerDownEvent (e) {
    const sortId = e.target.closest(".sortable-table__cell").dataset.id
    let flow = e.target.closest(".sortable-table__cell").dataset.order

    if (sortId) {
      this.foundColumn = this.headerConfig.find(column => column.id === sortId)

      if (flow === 'asc') {
        flow = 'desc'
      } else {
        flow = 'asc'
      }

      if (e.target.closest(".sortable-table__cell") !== this.activeColumnElement) {
        this.activeColumnElement = e.target
        this.addArrow()
      }

      e.target.closest(".sortable-table__cell").dataset.order = flow
      this.sort(this.foundColumn.id, flow, this.foundColumn.sortType)
    }
  }

  sortOnClient(typeId, flow, sortType) {
    if (this.isFirstSort || this.flowSort !== flow || this.typeSortId !== typeId) {
      this.flowSort = flow
      this.typeSortId = typeId
      if (this.isFirstSort) this.isFirstSort = false

      if (sortType === 'string') {
        this.data.sort((a, b) => {
          if (flow === 'desc') {
            const result = b[typeId].localeCompare(a[typeId], ['ru', 'en'], { caseFirst: 'upper' })
            return result !== 0 ? result : -1
          }

          return a[typeId].localeCompare(b[typeId], ['ru', 'en'], { caseFirst: 'upper' })
        })
      }

      if (sortType === 'number') {
        const direction = {
          asc: 1,
          desc: 0
        }

        this.data.sort((a, b) => direction[flow] ? a[typeId] - b[typeId] : b[typeId] - a[typeId])
      }

      const { body } = this.subElements
      body.innerHTML = this.createBody(this.data)
    }
  }

  sort (typeId, flow, sortType) {
    if (this.isSortLocally) {
      this.sortOnClient(typeId, flow, sortType)
    }
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

  createArrow () {
    const element = document.createElement('div')
    element.innerHTML = `
     <span
       data-element="arrow"
       class="sortable-table__sort-arrow"
       >
        <span class="sort-arrow"></span>
     </span>
    `
    return element.firstElementChild
  }

  addArrow () {
    if (this.arrow) this.arrow.remove()
    this.arrow = this.createArrow()
    this.activeColumnElement.append(this.arrow)
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
          data-order="asc"
           >
          <span>${ head.title }</span>
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

  destroy () {
    this.element.remove()
  }
}
