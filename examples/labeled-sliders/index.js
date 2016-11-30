import { createComponent, run } from "meiosis";
import { renderer } from "meiosis-snabbdom";
import { component as sliderContainer } from "./sliderContainer";

const rootComponent = createComponent(sliderContainer());
run({ renderer: renderer().intoId(document, "app"), rootComponent });