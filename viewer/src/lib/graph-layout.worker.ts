import { calculateLayout, type LayoutRequest } from "./graph-layout";
self.onmessage = (event: MessageEvent<LayoutRequest>) => {
  self.postMessage(calculateLayout(event.data));
};
