import AsyncEventTarget from "./AsyncEventTarget";

export class AsyncEvent<type extends string | symbol = string|symbol, data = never, target extends AsyncEventTarget = AsyncEventTarget> {
  constructor(type: type, eventInitDict?: AsyncEventInit<data>) {
    this.#type = type;
    if (typeof eventInitDict == "object" && eventInitDict) {
      if ("cancelable" in eventInitDict) {
        this.#cancelable = Boolean(eventInitDict.cancelable);
      }
      if ("data" in eventInitDict) {
        this.data = eventInitDict.data;
      }
    }
  }
  target: target = null;
  data: data = null;
  #type: type;
  get type() { return this.#type; }
  #cancelable: boolean = true;
  get cancelable() { return this.#cancelable; }
  #defaultPrevented: boolean = false;
  get defaultPrevented() { return this.#defaultPrevented; }
  #propagationStopped: boolean = false;
  get propagationStopped() { return this.#propagationStopped; }
  preventDefault() {
    if (this.#cancelable) {
      this.#defaultPrevented = true;
    }
  }
  stopPropagation() {
    this.#propagationStopped = true;
  }
}
Object.defineProperty(AsyncEvent.prototype, Symbol.toStringTag, {
  value: "AsyncEvent"
});
export default AsyncEvent;
export interface AsyncEventInit<data> {
  cancelable: boolean;
  data: data;
}