class Renderer {
  constructor(renderer, mapping) {
    this._renderer = renderer;
    const {
      createElementCallback,
      renderElementCallback,
      destroyElementCallback,
      moveElementCallback,
      dispatchEventCallback,
    } = mapping;

    this._renderElementCallback = renderElementCallback;
    this._destroyElementCallback = destroyElementCallback;
    this._moveElementCallback = moveElementCallback;
    this._createElementCallback = createElementCallback;
    this._dispatchEventCallback = dispatchEventCallback;
  }

  //TODO: СДЕЛАТЬ ВСЕ МЕТОДЫ ПРОМИСАМИ

  renderElement(element, position, ...args) {
    return this._renderElementCallback.call(
      this._renderer,
      element,
      position,
      args
    );
  }
  destroyElement(element, ...args) {
    return this._destroyElementCallback.call(this._renderer, element, ...args);
  }
  createElement(...args) {
    return this._createElementCallback.call(this._renderer, ...args);
  }
  moveElement(element, position, ...args) {
    return this._moveElementCallback.call(
      this._renderer,
      element,
      position,
      ...args
    );
  }
  dispatchEvent(event, ...args) {
    return this._dispatchEventCallback.call(this._renderer, event, ...args);
  }
}

module.exports = Renderer;
