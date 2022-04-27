class Eventable {
  eventListeners = {};

  constructor() {

  }

  genUID() {
    return `${Date.now()}${Math.random()}${Math.random()}`.replace(/\.*/g, '');
  }

  addListener(name, callback, scope) {
    let uid = this.genUID();
    this.eventListeners[uid] = {
      name, callback, scope
    };

    return uid;
  }

  removeListener(id) {
      delete this.eventListeners[id];
  }

  fireEvent(name, ...values) {
    for (let k in this.eventListeners) {
      let listener = this.eventListeners[k];

      if (listener.name == name) {
        listener.callback.call(listener.scope, ...values);
      }
    }
  }
}
