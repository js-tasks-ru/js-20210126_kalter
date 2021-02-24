export default class SortableTable {
  static SORT_TYPES = {
    number: 'number',
    string: 'string',
  };

  static SORT_ORDERS = {
    asc: 'asc',
    desc: 'desc',
  };

  subElements = {};

  constructor(headerData = [], { data = [] } = {}) {
    this.headerData = headerData;
    this.data = data;

    this.defaultSortingData = {
      orderType: SortableTable.SORT_ORDERS.asc,
      field: this.headerData.find((item) => item.sortable),
    };

    this.render();
    this.initEventListeners();
  }

  sort(field, order = SortableTable.SORT_ORDERS.asc, sortType) {
    this.changeArrowDirection(field, order);

    const newSortedRows = this.sortData(field, order, sortType);
    this.subElements.body.innerHTML = this.getBodyRows(newSortedRows);
  }

  changeArrowDirection(field, order, parent = document) {
    const headerReference = this.subElements.header || parent;
    const currentField = headerReference.querySelector(`[data-id=${field}]`);

    currentField.dataset.order = order;
  }

  sortData(field, order, sortType) {
    const collator = new Intl.Collator(['ru', 'en'], { caseFirst: 'upper' });

    const sort = (a, b, sortType) => {
      if (sortType === SortableTable.SORT_TYPES.number) {
        return a - b;
      } else if (sortType === SortableTable.SORT_TYPES.string) {
        return collator.compare(a, b);
      }
    };

    const newSortedRows = [...this.data];

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
          <div
            class="sortable-table__cell"
            data-id="${item.id}"
            data-sortable="${item.sortable}"
            data-order="${SortableTable.SORT_ORDERS.asc}"
           >
            <span>${item.title}</span>
            ${this.renderHeaderArrowIcon(item)}
          </div>
        `;
      })
      .join('');
  }

  renderHeaderArrowIcon(data) {
    if (data.id !== this.defaultSortingData.field.id) {
      return '';
    }

    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  getBody() {
    const sortedData = this.sortData(
      this.defaultSortingData.field.id,
      this.defaultSortingData.orderType,
      this.defaultSortingData.field.sortType,
    );

    return `
      <div data-element="body" class="sortable-table__body">
         ${this.getBodyRows(sortedData)}
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

    this.changeArrowDirection(this.defaultSortingData.field.id, this.defaultSortingData.orderType, element);

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleFieldClick);
  }

  removeEventListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleFieldClick);
  }

  handleFieldClick = (event) => {
    const field = event.target.closest('[data-sortable="true"]');

    if (!field) {
      return;
    }

    const fieldData = this.headerData.find((item) => item.id === field.dataset.id);
    const arrow = field.querySelector('.sortable-table__sort-arrow');
    let currentOrder = field.dataset.order;

    if (currentOrder === SortableTable.SORT_ORDERS.desc) {
      currentOrder = SortableTable.SORT_ORDERS.asc;
    } else {
      currentOrder = SortableTable.SORT_ORDERS.desc;
    }

    if (!arrow) {
      field.append(this.subElements.arrow);
    }

    this.sort(fieldData.id, currentOrder, fieldData.sortType);
  };

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}
