const operationsStatus = cc.Enum({
  INITIALIZING: 0,
  STARTING: 1,
  WAITING: 2,
  EXECUTING: 3,
});

class Renderer {
  constructor(renderer, mapping) {
    this._renderer = renderer;
    const {
      createElementCallback,
      drawElementCallback,
      destroyElementCallback,
      moveElementCallback,
      dispatchEventCallback,
    } = mapping;

    this._drawElementCallback = drawElementCallback;
    this._destroyElementCallback = destroyElementCallback;
    this._moveElementCallback = moveElementCallback;
    this._createElementCallback = createElementCallback;
    this._dispatchEventCallback = dispatchEventCallback;
    this._queue = [];
  }

  generateQueueKey() {
    const status =
      !this._queue.length ||
      this._queue[this._queue.length - 1].status === operationsStatus.EXECUTING
        ? operationsStatus.STARTING
        : operationsStatus.INITIALIZING;
    this._queue.push({ status });
    return this._queue.length - 1;
  }

  drawElement(key, element, position, ...args) {
    return this._drawElementCallback.call(
      this._renderer,
      element,
      position,
      ...args
    );
    // return new Promise((resolve, reject) => {
    //   try {
    //     this._drawElementCallback.call(
    //       this._renderer,
    //       element,
    //       position,
    //       resolve,
    //       ...args
    //     );
    //   } catch (err) {
    //     reject(err);
    //   }
    // });
  }
  destroyElement(key, element, ...args) {
    return new Promise((resolve, reject) => {
      try {
        this._destroyElementCallback.call(
          this._renderer,
          element,
          resolve,
          ...args
        );
      } catch (err) {
        reject(err);
      }
    });
  }
  createElement(key, ...args) {
    return this._createElementCallback.call(this._renderer, ...args);
    // return new Promise((resolve, reject) => {
    //   try {
    //     this._createElementCallback.call(this._renderer, resolve, ...args);
    //   } catch (err) {
    //     reject(err);
    //   }
    // });
  }
  moveElement(key, element, position, ...args) {
    return new Promise((resolve, reject) => {
      try {
        this._moveElementCallback.call(
          this._renderer,
          element,
          position,
          resolve,
          ...args
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  //implement dispatcher and pass it to tiles
  dispatchEvent(event, ...args) {
    return this._dispatchEventCallback.call(this._renderer, event, ...args);
  }

  closeInit(key) {
    // const operationsBlock = this._queue[key];
    // if (operationsBlock.status === operationsStatus.STARTING) {
    //   const { promises } = operationsBlock;
    //   Promise.all(promises).then(() => {
    //     this._queue.splice(key, 1);
    //     this.execute(this._queue[key]);
    //   });
    //   operationsBlock.status = operationsStatus.EXECUTING;
    // } else if (operationsBlock.status === operationsStatus.INITIALIZING)
    //   operationsBlock.status = operationsStatus.WAITING;
  }

  //тут что-то не так
  //надо сделать промис
  //и передать resolve как аргумент
  execute(operationsBlock) {
    if (!operationsBlock) return;
    const { operations } = operationsBlock;
    operations.forEach((operation) => {
      operation.func.call(this._renderer, ...operation.args);
    });
    delete operationsBlock.operations;
  }
}

export default Renderer;
