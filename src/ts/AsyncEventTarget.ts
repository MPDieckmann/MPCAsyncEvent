import AsyncEvent from "./AsyncEvent";

export class AsyncEventTarget {
  #listeners: TypeListenerMap = new Map();
  addAsyncEventListener<type extends string | symbol>(type: type, listener: (this: this, event: AsyncEvent<type>) => void | Promise<void>, once: boolean = false): boolean {
    if (!this.#listeners.has(type)) {
      this.#listeners.set(type, new Map());
    }
    let listenerOptionsMap = this.#listeners.get(type);
    if (listenerOptionsMap.has(listener)) {
      return false;
    }
    if (listenerOptionsMap.get(listener) == Boolean(once)) {
      return false;
    }
    listenerOptionsMap.set(listener, Boolean(once));
    return true;
  }
  async dispatchAsyncEvent(event: AsyncEvent<string | symbol>): Promise<boolean> {
    if (!this.#listeners.has(event.type)) {
      return true;
    }
    let listenerOptionsMap = this.#listeners.get(event.type);
    for (let [listener, once] of listenerOptionsMap) {
      if (once) {
        listenerOptionsMap.delete(listener);
      }
      await listener.call(this, event);
      if (event.propagationStopped) {
        break;
      }
    }
    return Boolean(event.defaultPrevented);
  }
  removeAsyncEventListener<type extends string | symbol>(type: type, listener: (this: this, event: AsyncEvent<type>) => void | Promise<void>, once: boolean = false): boolean {
    if (!this.#listeners.has(type)) {
      return false;
    }
    let listenerOptionsMap = this.#listeners.get(type);
    if (!listenerOptionsMap.has(listener)) {
      return false;
    }
    if (listenerOptionsMap.get(listener) != Boolean(once)) {
      return false;
    }
    listenerOptionsMap.delete(listener);
    return true;
  }
}
Object.defineProperty(AsyncEventTarget.prototype, Symbol.toStringTag, {
  value: "AsyncEventTarget"
});
export default AsyncEventTarget;

interface TypeListenerMap extends Map<string | symbol, ListenerOptionsMap> { }
interface ListenerOptionsMap extends Map<(this: AsyncEventTarget, event: AsyncEvent<string | symbol>) => void | Promise<void>, boolean> { }
