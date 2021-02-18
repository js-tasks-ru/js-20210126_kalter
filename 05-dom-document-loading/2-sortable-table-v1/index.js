export default class SortableTable {
  static SORT_TYPES = {
    number: 'number',
    string: 'string',
  };

  constructor(headerData = [], { data = [] } = {}) {
    this.subElements = {};
    this.headerData = headerData;
    this.data = data;

    this.render();
  }

  sort(field, order = 'asc') {
    const headerReference = this.subElements.header;
    const currentColumn = headerReference.querySelector(`[data-id=${field}]`);

    for (const element of headerReference.children) {
      element.dataset.order = '';
    }

    const newSortedRows = this.sortData(field, order);

    currentColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getBodyRows(newSortedRows);
  }

  sortData(field, order) {
    const collator = new Intl.Collator(['ru', 'en'], { caseFirst: 'upper' });

    const sort = (a, b, sortType) => {
      if (sortType === SortableTable.SORT_TYPES.number) {
        return a - b;
      } else if (sortType === SortableTable.SORT_TYPES.string) {
        return collator.compare(a, b);
      }
    };

    const newSortedRows = [...this.data];
    const { sortType } = this.headerData.find((item) => item.id === field);

    return newSortedRows.sort((a, b) => {
      if (order === 'desc') {
        return sort(a[field], b[field], sortType) * -1;
      }

      return sort(a[field], b[field], sortType);
    });
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((subElements, item) => {
      subElements[item.dataset.element] = item;

      return subElements;
    }, {});
  }

  get containerTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          ${this.getHeader()}

          ${this.getBody()}
        </div>
       </div>
    `;
  }

  getHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.getHeaderRow(this.headerData)}
      </div>
    `;
  }

  getHeaderRow(data) {
    return data
      .map((item) => {
        return `
          <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
            <span>${item.title}</span>
            ${this.headerArrowIcon}
          </div>
        `;
      })
      .join('');
  }

  get headerArrowIcon() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  getBody() {
    return `
      <div data-element="body" class="sortable-table__body">
         ${this.getBodyRows(this.data)}
      </div>
    `;
  }

  getBodyRows(data) {
    return data
      .map((item) => {
        return this.getRowTemplate(item);
      })
      .join('');
  }

  getRowTemplate(data) {
    const cells = this.headerData
      .map(({ id, template }) => {
        return template ? template(data[id]) : `<div class="sortable-table__cell">${data[id]}</div>`;
      })
      .join('');

    return `
      <a href="products/${data.id}" class="sortable-table__row">
        ${cells}
      </a>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.containerTemplate;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
