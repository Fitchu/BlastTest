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

  renderElement(element, position) {
    return this._renderElementCallback.call(this._renderer, element, position);
  }
  destroyElement(element) {
    return this._destroyElementCallback.call(this._renderer, element);
  }
  createElement() {
    return this._createElementCallback.call(this._renderer);
  }
  moveElement(element, position) {
    return this._moveElementCallback.call(this._renderer, element, position);
  }
  dispatchEvent(event) {
    return this._dispatchEventCallback.call(this._renderer, event);
  }
}

module.exports = Renderer;
