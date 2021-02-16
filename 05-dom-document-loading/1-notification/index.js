export default class NotificationMessage {
  static activeNotification;

  constructor(title, { type = 'success', duration = 2000 } = {}) {
    this.duration = duration;
    this.title = title;
    this.type = type;

    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.title}
        </div>
      </div>
    </div>`;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  show(targetElement = document.body) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    NotificationMessage.activeNotification = this.element;
    targetElement.append(this.element);
    this.timer = setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.timer = null;
    NotificationMessage.activeNotification = null;
  }
}
