const operationsStatus = cc.Enum({
  INITIALIZING: "INITIALIZING",
  STARTING: "STARTING",
  WAITING: "WAITING",
  EXECUTING: "EXECUTING",
});

class Renderer {
  constructor(renderer, mapping) {
    this._renderer = renderer;
    const { drawElementCallback, destroyElementCallback, moveElementCallback } =
      mapping;

    this._drawElementCallback = drawElementCallback;
    this._destroyElementCallback = destroyElementCallback;
    this._moveElementCallback = moveElementCallback;
    this._queue = [];
  }

  generateQueueKey() {
    const status = !this._queue.length
      ? operationsStatus.STARTING
      : operationsStatus.INITIALIZING;
    this._queue.push({ status, operations: [], promises: [] });
    return this._queue.length - 1;
  }

  addOperationToQueue(key, func, ...args) {
    const operationsBlock = this._queue[key];
    const { status } = operationsBlock;
    if (status === operationsStatus.INITIALIZING) {
      const { operations } = operationsBlock;
      operations.push({
        func,
        args,
      });
    } else if (status === operationsStatus.STARTING) {
      const { promises } = operationsBlock;
      const promise = new Promise((resolve, reject) => {
        try {
          func.call(this._renderer, ...args, resolve);
        } catch (er) {
          reject(er);
        }
      });
      promises.push(promise);
    }
  }

  drawElement(key, element, position, options) {
    this.addOperationToQueue(
      key,
      this._drawElementCallback,
      element,
      position,
      options
    );
  }
  destroyElement(key, element, options) {
    this.addOperationToQueue(
      key,
      this._destroyElementCallback,
      element,
      options
    );
  }

  moveElement(key, element, position, options) {
    this.addOperationToQueue(
      key,
      this._moveElementCallback,
      element,
      position,
      options
    );
  }

  closeInit(key, onFinishedCallback) {
    cc.log("closeInit", key);
    const operationsBlock = this._queue[key];
    operationsBlock.onFinishedCallback = onFinishedCallback;
    cc.log(operationsBlock.status, "=>");
    if (operationsBlock.status === operationsStatus.STARTING) {
      operationsBlock.status = operationsStatus.EXECUTING;
      this.createOnFinishedPromise(
        key,
        operationsBlock.promises,
        operationsBlock.onFinishedCallback
      );
    } else if (operationsBlock.status === operationsStatus.INITIALIZING)
      operationsBlock.status = operationsStatus.WAITING;
    cc.log(operationsBlock.status);
  }

  execute(key) {
    cc.log("execute", key);
    const operationsBlock = this._queue[key];
    if (!operationsBlock) return;
    cc.log(operationsBlock.status, "=>");
    const { operations } = operationsBlock;
    if (operations.length) {
      const { promises } = operationsBlock;
      operations.forEach((operation) => {
        const { func, args } = operation;
        promises.push(
          new Promise((resolve, reject) => {
            try {
              func.call(this._renderer, ...args, resolve);
            } catch (er) {
              reject(er);
            }
          })
        );
      });
      delete operationsBlock.operations;
    }
    if (operationsBlock.status === operationsStatus.WAITING) {
      operationsBlock.status = operationsStatus.EXECUTING;
      this.createOnFinishedPromise(
        key,
        operationsBlock.promises,
        operationsBlock.onFinishedCallback
      );
    } else operationsBlock.status = operationsStatus.STARTING;
    cc.log(operationsBlock.status);
  }

  createOnFinishedPromise(key, promises, onFinishedCallback) {
    Promise.all(promises).then(() => {
      this._queue.splice(key, 1);
      if (onFinishedCallback) onFinishedCallback();
      cc.log("FINISHED");
      this.execute(key);
    });
  }

  inProgress() {
    cc.log(this._queue);
    return Boolean(this._queue.length);
  }
}

export default Renderer;
