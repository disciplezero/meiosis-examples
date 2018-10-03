const getFn = (component, prop) => component[prop] || (() => null)

export const wireActions = (component, update, actions = {}, updates = {}) => {
  Object.assign(updates, component.updates)
  Object.assign(actions, getFn(component, "actions")({ update, actions, updates }))
  Object.keys(component.dependencies || {}).forEach(key => {
    wireActions(component.dependencies[key], update, actions, updates)
  })
  return actions
}

export const wireView = (component, actions) => {
  const dependencies = {}
  Object.keys(component.dependencies || {}).forEach(key => {
    dependencies[key] = wireView(component.dependencies[key], actions)
  })
  return getFn(component, "view")(Object.assign({ actions }, dependencies))
}

export const wirem = ({ component, data, update }) => {
  const model = component.model ? () => component.model(data) : () => null
  const actions = wireActions(component, update)
  const view = wireView(component, actions)
  const state = component.state || (x => x)
  const nextAction = component.nextAction ? component.nextAction(actions) : () => null

  return { model, actions, view, state, nextAction }
}
