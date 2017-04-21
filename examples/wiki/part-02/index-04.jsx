import flyd from "flyd";
import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import { trace } from "meiosis";
import meiosisTracer from "meiosis-tracer";

const nest = (update, path) => modelUpdate =>
  update(model => _.set(model, path, modelUpdate(_.get(model, path))));

const nestComponent = (create, update, path) => {
  const view = create(nest(update, path));
  return model => view(_.get(model, path));
};

const entry = {
  model: () => ({
    value: ""
  }),

  create: update => {
    const updates = {
      editEntryValue: value => update(model => _.set(model, "value", value))
    };

    const actions = {
      editEntryValue: evt => updates.editEntryValue(evt.target.value)
    };

    return model => (
      <div>
        <span>Entry number:</span>
        <input type="text" size="2" value={model.value} onChange={actions.editEntryValue}/>
      </div>
    );
  }
};

const date = {
  model: () => ({
    value: ""
  }),

  create: update => {
    const updates = {
      editDateValue: value => update(model => _.set(model, "value", value))
    };

    const actions = {
      editDateValue: evt => updates.editDateValue(evt.target.value)
    };

    return model => (
      <div>
        <span>Date:</span>
        <input type="text" size="10" value={model.value} onChange={actions.editDateValue}/>
      </div>
    );
  }
};

const temperature = {
  model: label => ({
    label,
    value: 20,
    units: "C"
  }),

  create: update => {
    const updates = {
      increase: value => update(model =>
        _.set(model, "value", model.value + value)),

      changeUnits: () => update(model => {
        if (model.units === "C") {
          model.units = "F";
          model.value = Math.round( model.value * 9 / 5 + 32 );
        }
        else {
          model.units = "C";
          model.value = Math.round( (model.value - 32) / 9 * 5 );
        }
        return model;
      })
    };

    const actions = {
      increase: value => evt => {
        evt.preventDefault();
        updates.increase(value);
      },
      changeUnits: evt => {
        evt.preventDefault();
        updates.changeUnits();
      }
    };

    return model => (
      <div className="row">
        <div className="col-md-3">
          <span>{model.label} Temperature: {model.value}&deg;{model.units} </span>
        </div>
        <div className="col-md-6">
          <button className="btn btn-sm btn-default" onClick={actions.increase(1)}>Increase</button>{" "}
          <button className="btn btn-sm btn-default" onClick={actions.increase(-1)}>Decrease</button>{" "}
          <button className="btn btn-sm btn-info" onClick={actions.changeUnits}>Change Units</button>
        </div>
      </div>
    );
  }
};

const app = {
  model: () => ({
    entry: entry.model(),
    date: date.model(),
    temperature: {
      air: temperature.model("Air"),
      water: temperature.model("Water")
    },
    saved: ""
  }),

  create: update => {
    const displayTemperature = temperature => temperature.label + ": " +
      temperature.value + "\xB0" + temperature.units;

    const updates = {
      save: () => update(model => {
        model.saved = " Entry #" + model.entry.value +
          " on " + model.date.value + ":" +
          " Temperatures: " +
          displayTemperature(model.temperature.air) + " " +
          displayTemperature(model.temperature.water);

        model.entry.value = "";
        model.date.value = "";

        return model;
      })
    };

    const actions = {
      save: evt => {
        evt.preventDefault();
        updates.save();
      }
    };

    const components = {
      entry: nestComponent(entry.create, update, "entry"),
      date: nestComponent(date.create, update, "date"),
      temperature: {
        air: nestComponent(temperature.create, update, "temperature.air"),
        water: nestComponent(temperature.create, update, ["temperature", "water"])
      }
    };

    return model => (
      <form>
        {components.entry(model)}
        {components.date(model)}
        {components.temperature.air(model)}
        {components.temperature.water(model)}
        <div>
          <button className="btn btn-primary" onClick={actions.save}>Save</button>
          <span>{model.saved}</span>
        </div>
      </form>
    );
  }
};

const initialModel = app.model();
const update = flyd.stream();
const applyUpdate = (model, modelUpdate) => modelUpdate(model);
const models = flyd.scan(applyUpdate, initialModel, update);

const element = document.getElementById("app");
const view = app.create(update);
models.map(model => ReactDOM.render(view(model), element));


trace({ update, dataStreams: [ models ]});
meiosisTracer({ selector: "#tracer" });