
import TodoListItem from "./TodoListItem.jsx"

function TodoList({todoList, onCompleteTodo, onUpdateTodo}) {
    // remove completed todos from todoList (keep only todos with isCompleted = false)
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted)
    
    return (
        (filteredTodoList.length === 0 ? 
            <p>Add todo above to get started</p> : 
            <ul>
                {filteredTodoList.map(todo => (
                    <TodoListItem
                        key={todo.id}
                        todo={todo}
                        onCompleteTodo={onCompleteTodo}
                        onUpdateTodo={onUpdateTodo}
                    />
                ))}
            </ul>
        )
    );
}

export default TodoList;


