
import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

function TodoList({todoList, onCompleteTodo, onUpdateTodo, dataVersion}) {
    // remove completed todos from todoList (keep only todos with isCompleted = false)
    // const filteredTodoList = todoList.filter(todo => !todo.isCompleted);
    // create a memoized filteredTodoList
    const filteredTodoList = useMemo(() => {
        console.log(`"Recalculating filtered todos (v${dataVersion})"`);
        return {
            version: dataVersion,
            todos: todoList.filter(todo => !todo.isCompleted)
        }
    }, [dataVersion, todoList]);
    
    return (
        (filteredTodoList.length === 0 ? 
            <p>Add todo above to get started</p> : 
            <ul>
                {filteredTodoList.todos.map(todo => (
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


