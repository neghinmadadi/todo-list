import { useEffect, useState } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function TodosPage({token}) {

    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    useEffect(() => {
            async function fetchTodos() {
                setIsTodoListLoading(true);
                setError('');

                try {
                    const params = new URLSearchParams({
                        limit: 100,
                    });
                    const response = await fetch(`/api/tasks?${params}`, {
                        headers: {
                            'X-CSRF-TOKEN': token,
                        },
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const fetchedTodos = data.tasks.map(({id, title, isCompleted}) => ({id, title, isCompleted}));
                        setTodoList(fetchedTodos)
                    } else if (response.status === 401) {
                        throw new Error('Unauthorized Access');
                    } else {
                        throw new Error(`Failed to fetch todos: ${response.status}`);
                    }
                } catch(error) {
                    setError(`Error: ${error.name} | ${error.message}`);
                } finally {
                    setIsTodoListLoading(false);
                }
            }

            if (token) {
                fetchTodos();
            }
    }, [token]); 

    async function addTodo(todoTitle) {
        setError('');

        const newTodo = {
            id: Date.now(),
            title: todoTitle,
            isCompleted: false
        }
        // update todoList
        setTodoList(previous => [newTodo, ...previous]);

        try {
            const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
            body: JSON.stringify({title: newTodo.title, isCompleted: newTodo.isCompleted})
            })
            if (response.ok) {
                // create the verified todo
                const {id, title, isCompleted} = await response.json();
                // const verifiedTodo = {
                //     id: data.id,
                //     title: data.title,
                //     isCompleted: data.isCompleted
                // }
                setTodoList(previous => (previous.map(todo => todo.id === newTodo.id ? {id, title, isCompleted} : todo)));

            } else {
                // setTodoList(previous => (previous.filter(todo => todo.id !== newTodo.id)));
                throw new Error(`Failed to add the new todo: ${response.status}`);
            }
        } catch(error) {
            setTodoList(previous => (previous.filter(todo => todo.id !== newTodo.id)));
            setError(`Error: ${error.name} | ${error.message}`);
        }
    }

    function completeTodo(id) {
        setTodoList(previous => previous.map(todo => todo.id === id ? {...todo, isCompleted: true} : todo));
    }

    function updateTodo(editedTodo) {
        const updatedTodos = todoList.map(todo => todo.id === editedTodo.id ? {...editedTodo} : todo);
    
        setTodoList(updatedTodos);
    }

    return (
        <div>
        <TodoForm onAddTodo={addTodo} />
        <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} />
        </div>
    )
}

export default TodosPage;
