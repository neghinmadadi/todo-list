import { useEffect, useState } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function TodosPage({token}) {

    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    useEffect(() => {
        async function fetchTodos() {
            setIsTodoListLoading(true);
            setError('');

            try {
                const params = new URLSearchParams({
                    sortBy,
                    sortDirection,
                    limit: 100,
                });
                const options = {
                    headers: {
                        'X-CSRF-TOKEN': token,
                    },
                    credentials: 'include',
                };
                const response = await fetch(`/api/tasks?${params}`, options);
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
    }, [token, sortBy, sortDirection]); 

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

   async function completeTodo(id) {
        setError('');
        // store the original todo for potential rollback
        const previousTodo = todoList.find(todo => todo.id === id);
        // optimistically update the todo as completed in the list
        setTodoList(previous => previous.map(todo => todo.id === id ? {...todo, isCompleted: true} : todo));

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'include',
                body: JSON.stringify({isCompleted: true})
            })
            if (!response.ok) {
                throw new Error(`Failed to update the task as completed: ${response.status}`);
            }
        } catch(error) {
            setTodoList(previous => (previous.map(todo => todo.id === id ? previousTodo : todo)));
            setError(`Error: ${error.name} | ${error.message}`);
        }
    }

    async function updateTodo(editedTodo) {
        setError('');
        // store the original todo for potential rollback
        const originalTodo = todoList.find(todo => todo.id === editedTodo.id);
        // Optimistically update todoList
        setTodoList(previous => previous.map(todo => todo.id === editedTodo.id ? editedTodo : todo));

        try {
            const response = await fetch(`/api/tasks/${editedTodo.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'include',
                body: JSON.stringify({title: editedTodo.title, isCompleted: editedTodo.isCompleted})
            })
            if (!response.ok) {
                throw new Error(`Failed to edit the task: ${response.status}`);
            }
        } catch(error) {
            setTodoList(previous => (previous.map(todo => todo.id === editedTodo.id ? originalTodo : todo)));
            setError(`Error: ${error.name} | ${error.message}`);
        }  
    }

    return (
        <div>
            {/* add error display section */}
            {(error) && 
                <>
                    <div role='alert'>{error}</div>
                    <button
                        type='button'
                        onClick={() => setError('')}
                    >
                        Clear Error
                    </button>
                </>
            }
            {/* add loading indicator */}
            {isTodoListLoading && <p>Loading todos...</p>}
            <TodoForm onAddTodo={addTodo} />
            <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} />
        </div>
    )
}

export default TodosPage;
