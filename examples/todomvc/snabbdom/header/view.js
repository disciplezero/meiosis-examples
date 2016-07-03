/*global define, exports, module, require*/

// This boilerplate is to support running this code with either, just the browser, or RequireJS,
// or node.js / npm (browserify, webpack, etc.) Do not think this boilerplate is necessary to run
// Meiosis. It is for convenience to be able to run the example with your preferred module system.
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["meiosis-snabbdom"], function(meiosisSnabbdom) {
      return (root.headerView = factory(meiosisSnabbdom));
    });
  }
  else if (typeof module === "object" && module.exports) {
    module.exports = (root.headerView = factory(require("meiosis-snabbdom")));
  }
  else {
    root.headerView = factory(root.meiosisSnabbdom);
  }
}(this || window, // ^^ the code above is boilerplate. the "real" code starts below. vv

  function(meiosisSnabbdom) {
    return function(model, actions) {
      var h = meiosisSnabbdom.renderer.h;

      return h("header.header", [
        h("h1", "todos"),
        h("input.new-todo", {props: {placeholder: "What needs to be done?", autoFocus: true,
          value: model.newTodo}, on: {keyup: actions.events.onNewTodoKeyUp}})
      ]);
    };
  }
));
