export default class ColumnChart {
  constructor({ data = [], label = '', link = '', value = 0 } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.chartHeight = 50;

    this.render();
  }

  getChartHeight() {
    const maxValue = Math.max(...this.data);
    const scaleMultiply = this.chartHeight / maxValue;

    return this.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scaleMultiply))
      };
    });
  }

  renderLink() {
    if (this.link) {
      return `<a href="/${this.link}" class="column-chart__link">View all</a>`;
    }

    return '';
  }

  renderChartItem(chartsHeight) {
    let string = '';
    this.data.forEach((item, index) => {
      string += `<div style="--value: ${chartsHeight[index].value}" data-tooltip=${chartsHeight[index].percent}></div>`;
    });

    return string;
  }

  render() {
    const element = document.createElement('div');
    const chartsHeight = this.getChartHeight();

    element.innerHTML = `
       <div class="column-chart ${this.data.length ? '' : 'column-chart_loading'}" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.renderLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.value}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.renderChartItem(chartsHeight)}
          </div>
        </div>
      </div>
    `;

    this.element = element.firstElementChild;
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

    this.render();
  }

  initEventListeners() {

  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
