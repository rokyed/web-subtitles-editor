class Snap extends Eventable {
  el = null;
  ref = null;
  refElement = null;
  subtitleManager = null;

  els = {};
  constructor(refElement, subRef, subtitleManager) {
    super({});
    this.subtitleManager = subtitleManager;
    this.refElement = refElement;
    this.ref = subRef;
    this.render();
  }

  onScroll(top, bottom) {
    let bounds = this.el.getBoundingClientRect();
    let allOccludable = [...this.el.querySelectorAll('.occludable')];

    if (bounds.top < -1000 || bounds.bottom > 2000) {
      allOccludable.map(e => e.classList.add('hidden'));
    } else {
      allOccludable.map(e => e.classList.remove('hidden'));
    }
  }

  render() {
    this.el = document.createElement('tr');
    this.el.innerHTML= `
      <td class="occludable">
        <div class="snap-control-container">
          <div class="snap-control-buttons">
            <button class="snap-add-before">+</button>
            <button class="snap-remove">-</button>
            <button class="snap-add-after">+</button>
          </div>
          <input class="snap-order" value="${subtitleManager.getIndexOfSubtitle(this.ref)+1}" type="text">
        </div>
      </td>
      <td class="occludable"><input class="snap-start-ts" value="${this.ref.start}" type="text"></td>
      <td class="occludable"><input class="snap-end-ts" value="${this.ref.end}" type="text"></td>
      <td class="occludable"><textarea class="snap-content">${this.ref.content.join('\n')}</textarea></td>
    `;
    this.els.content = this.el.querySelector('.snap-order');
    this.els.start = this.el.querySelector('.snap-start-ts');
    this.els.end = this.el.querySelector('.snap-end-ts');
    this.els.content = this.el.querySelector('.snap-content');
    this.els.addBefore = this.el.querySelector('.snap-add-before');
    this.els.addAfter = this.el.querySelector('.snap-add-after');
    this.els.remove = this.el.querySelector('.snap-remove');


    this.els.start.addEventListener('change', this.onStartChange.bind(this));
    this.els.end.addEventListener('change', this.onEndChange.bind(this));
    this.els.content.addEventListener('change', this.onContentChange.bind(this));
    this.els.addBefore.addEventListener('click', this.onAddBefore.bind(this));
    this.els.addAfter.addEventListener('click', this.onAddAfter.bind(this));
    this.els.remove.addEventListener('click', this.onRemove.bind(this));
    this.refElement.appendChild(this.el);

    // this.onScroll();
  }

  onAddAfter() {
    let secs = Utils.convertStringTimestampToSeconds(this.ref.end);
    secs += Utils.DIFF_SECONDS_STEP;
    this.subtitleManager.addSubtitle(Utils.convertSecondsToStringTimestamp(secs), this.ref, true);
  }
  onAddBefore() {
    let secs = Utils.convertStringTimestampToSeconds(this.ref.start);
    secs -= Utils.DIFF_SECONDS_STEP;
    this.subtitleManager.addSubtitle(Utils.convertSecondsToStringTimestamp(secs), this.ref);
  }
  onRemove() {
    this.subtitleManager.removeSubtitle(this.ref);
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
