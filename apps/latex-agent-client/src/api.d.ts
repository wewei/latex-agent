import { EndpointApi } from "./endpoints/shared";
import { LatexApi } from "./latex/shared";

declare global {
  interface Window {
    electron: {
      endpoints: EndpointApi;
      latex: LatexApi;
    }
  }
}
