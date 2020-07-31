import { AsyncEvent, AsyncEventTarget } from "./ts/index";
import MPC from "@mpc/mpc";

export * from "./ts/index";

type AsyncEventConstructor = typeof AsyncEvent;
type AsyncEventTargetConstructor = typeof AsyncEventTarget;

declare module "@mpc/mpc" {
  interface MPC {
    AsyncEvent: AsyncEventConstructor;
    AsyncEventTarget: AsyncEventTargetConstructor;
  }
}

MPC.AsyncEvent = AsyncEvent;
MPC.AsyncEventTarget = AsyncEventTarget;
