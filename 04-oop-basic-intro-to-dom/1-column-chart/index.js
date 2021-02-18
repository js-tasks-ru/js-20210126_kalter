export default class ColumnChart {
  chartHeight = 50;

  constructor({ data = [], label = "", link = "", value = 0 } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;

    this.render();
  }

  getSubElements(element) {
    const elements = element.querySelectorAll("[data-element]");

    return [...elements].reduce((subElements, item) => {
      subElements[item.dataset.element] = item;

      return subElements;
    }, {});
  }

  getChartsHeight() {
    const maxValue = Math.max(...this.data);
    const scaleMultiply = this.chartHeight / maxValue;

    return this.data.map((item) => {
      return {
        percent: ((item / maxValue) * 100).toFixed(0) + "%",
        value: String(Math.floor(item * scaleMultiply)),
      };
    });
  }

  renderLink() {
    return this.link
      ? `<a href="/${this.link}" class="column-chart__link">View all</a>`
      : "";
  }

  renderChartsItem() {
    const chartsHeight = this.getChartsHeight();

    return this.data
      .map((item, index) => {
        return `<div style="--value: ${chartsHeight[index].value}" data-tooltip=${chartsHeight[index].percent}></div>`;
      })
      .join("");
  }

  get template() {
    return `
       <div class="column-chart ${
         this.data.length ? "" : "column-chart_loading"
       }" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.renderLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${
            this.value
          }</div>
          <div data-element="body" class="column-chart__chart">
            ${this.renderChartsItem()}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
  }

  update({
    data = this.data,
    label = this.label,
    link = this.link,
    value = this.value,
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;

    this.subElements.body.innerHTML = this.renderChartsItem();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
