const allCompleted = state => {
  let result = true

  for (let i = 0, t = state.todoIds.length; i < t; i++) {
    if (!state.todosById[state.todoIds[i]].completed) {
      result = false
      break
    }
  }
  return result
}

const computeState = state => {
  const result = {}

  result.allCompleted = allCompleted(state)

  const notCompleted = todoId => !state.todosById[todoId].completed
  const itemsLeft = state.todoIds.filter(notCompleted).length

  result.itemsLeftText = itemsLeft > 0 ?
    (String(itemsLeft) + " item" + (itemsLeft === 1 ? "" : "s") + " left") : ""

  result.clearCompletedVisible = (state.todoIds.length - itemsLeft) > 0

  const all = state.filterBy === "all"
  const completed = state.filterBy === "completed"
  result.filteredTodoIds = state.todoIds.filter(id =>
    all || (state.todosById[id].completed === completed))

  return result
}

export const service = () => {
  return state => {
    const newState = computeState(state)
    return Object.assign(state, newState)
  }
}
