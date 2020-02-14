function generateId() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
}
// Library Code
function createStore(reducer) {
    // The store should have four parts
    // 1. The state
    // 2. Get the state.
    // 3. Listen to changes on the state.
    // 4. Update the state

    let state
    let listeners = []

    const getState = () => state

    const subscribe = (listener) => {
        listeners.push(listener)
        return () => {
            listeners = listeners.filter((l) => l !== listener)
        }
    }

    const dispatch = (action) => {
        state = reducer(state, action)
        listeners.forEach((listener) => listener())
    }

    return {
        getState,
        subscribe,
        dispatch,
    }
}

// App Code
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'

function addTodoAction(todo) {
    return {
        type: ADD_TODO,
        todo,
    }
}

function removeTodoAction(id) {
    return {
        type: REMOVE_TODO,
        id,
    }
}

function toggleTodoAction(id) {
    return {
        type: TOGGLE_TODO,
        id,
    }
}

function addGoalAction(goal) {
    return {
        type: ADD_GOAL,
        goal,
    }
}

function removeGoalAction(id) {
    return {
        type: REMOVE_GOAL,
        id,
    }
}

function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return state.concat([action.todo])
        case REMOVE_TODO:
            return state.filter((todo) => todo.id !== action.id)
        case TOGGLE_TODO:
            return state.map((todo) => todo.id !== action.id ? todo :
                Object.assign({}, todo, { complete: !todo.complete }))
        default:
            return state
    }
}

function goals(state = [], action) {
    switch (action.type) {
        case ADD_GOAL:
            return state.concat([action.goal])
        case REMOVE_GOAL:
            return state.filter((goal) => goal.id !== action.id)
        default:
            return state
    }
}

function app(state = {}, action) {
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action),
    }
}

const store = createStore(app)

store.subscribe(() => {

    const { goals, todos } = store.getState();
    document.getElementById('todos').innerHTML = '';
    document.getElementById('goals').innerHTML = '';
    todos.forEach(addTodoDom);
    goals.forEach(addGoalDom);
})
// store.dispatch(removeGoalAction(0))
function addTodo() {
    const input = document.getElementById('todo');
    let name = input.value;
    input.value = '';
    store.dispatch(addTodoAction({
        name,
        complete: false,
        id: generateId()
    }))
}
function addGoal() {
    const input = document.getElementById('goal');
    let name = input.value;
    input.value = '';

    store.dispatch(addGoalAction({
        name,
        id: generateId()
    }))
}
document.getElementById('todoBtn')
    .addEventListener('click', addTodo);
document.getElementById('goalBtn')
    .addEventListener('click', addGoal);

function createRomveBtn(onClick) {
    const btn = document.createElement('button');
    btn.classList.add('listButton')
    btn.addEventListener('click', onClick);

    return btn;
}
function addTodoDom(todo) {
    const node = document.createElement('li');
    const text = document.createTextNode(todo.name);
    const span = document.createElement('span');
    const complete = document.createElement('span');
    
    node.appendChild(complete);
    span.appendChild(text);
    node.appendChild(span);

    const removeBtn = createRomveBtn(() => {
        store.dispatch(removeTodoAction(todo.id))
    });
    node.appendChild(removeBtn);

    node.classList.add('itemList');
    todo.complete
        ? complete.style.backgroundImage = 'url(./assets/complete.png)'
        : complete.style.backgroundImage = 'url(./assets/non-complete.png)'
    complete.classList.add('complete');

    node.addEventListener('click', () => {
        store.dispatch(toggleTodoAction(todo.id))
    })


    document.getElementById('todos').appendChild(node);
}
function addGoalDom(goal) {
    const node = document.createElement('li');
    const text = document.createTextNode(goal.name);
    const span = document.createElement('span');
    span.appendChild(text);
    node.appendChild(span);
    
    node.classList.add('itemList');
    const removeBtn = createRomveBtn(() => {
        store.dispatch(removeGoalAction(goal.id))
    })
    node.appendChild(removeBtn);

    document.getElementById('goals').appendChild(node);
}