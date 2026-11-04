
function TodoListItem({todo, onCompleteTodo}) {

    return (
        <li>
            <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={onCompleteTodo}
            />
            {todo.title}
        </li>
    );
}

export default TodoListItem;