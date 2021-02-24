class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  getTemplate(tooltip = '') {
    return `
      <div class="tooltip">${tooltip}</div>
    `;
  }

  initialize() {
    document.addEventListener('pointerover', this.onMouseOverArea);
    document.addEventListener('pointerout', this.remove);
  }

  render(tooltip) {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate(tooltip);
    this.element = element.firstElementChild;
    document.body.append(this.element);
  }

  onMouseOverArea = (event) => {
    const tooltip = event.target.closest('[data-tooltip]').dataset.tooltip;

    if (!tooltip) {
      return;
    }

    this.render(tooltip);
    this.onMouseMove(event);
    document.addEventListener('pointermove', this.onMouseMove);
  };

  onMouseMove = (event) => {
    const { clientX, clientY } = event;

    // this.element.style.transform = `translate(${clientX}px, ${clientY}px)`;

    this.element.style.left = `${clientX + 10}px`;
    this.element.style.top = `${clientY + 10}px`;
  };

  remove = () => {
    if (this.element) {
      this.element.remove();
    }

    document.removeEventListener('pointermove', this.ц);
  };

  destroy() {
    document.removeEventListener('pointerover', this.onMouseOverArea);
    document.removeEventListener('pointerout', this.remove);

    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
