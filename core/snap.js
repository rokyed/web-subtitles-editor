class Snap {
  el = null;
  ref = null;
  refElement = null;
  els = {};
  constructor(refElement, subRef, subtitleManager) {
    this.refElement = refElement;
    this.ref = subRef;
    this.render();
  }

  render() {
    this.el = document.createElement('tr');
    this.el.innerHTML= `
      <td>
        <div class="snap-control-container">
          <div class="snap-control-buttons">
            <button>+</button>
            <button>-</button>
            <button>+</button>
          </div>
          <input class="snap-order" value="${subtitleManager.getIndexOfSubtitle(this.ref)}" type="text">
        </div>
      </td>
      <td><input class="snap-start-ts" value="${this.ref.start}" type="text"></td>
      <td><input class="snap-end-ts" value="${this.ref.end}" type="text"></td>
      <td><textarea class="snap-content">${this.ref.content.join('\n')}</textarea></td>
    `;
    this.refElement.appendChild(this.el);
    this.els.content = this.el.querySelector('.snap-order');
    this.els.start = this.el.querySelector('.snap-start-ts');
    this.els.end = this.el.querySelector('.snap-end-ts');
    this.els.content = this.el.querySelector('.snap-content');
    this.els.start.addEventListener('change', this.onStartChange.bind(this));
    this.els.end.addEventListener('change', this.onEndChange.bind(this));
    this.els.content.addEventListener('change', this.onContentChange.bind(this));


  }

  onStartChange(e) {
      this.ref.start = e.target.value;

  }

  onEndChange(e) {
    this.ref.end = e.target.value;
  }

  onContentChange(e) {
    this.ref.content = e.target.value.split('\n');
  }

  remove() {
    this.refElement.removeChild(this.el);
    this.ref = null;
    this.refElement = null;
    this.subtitleManager = null;
    this.el = null;
  }




}
