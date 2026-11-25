import { useCallback, useEffect, useState } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import SortBy from '../../shared/SortBy.jsx';
import { useDebounce } from '../../utils/useDebounce.js';
import FilterInput from '../../shared/FilterInput.jsx';

function TodosPage({token}) {

    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    const [filterTerm, setFilterTerm] = useState('');
    const debouncedFilterTerm = useDebounce(filterTerm, 300);

    const [dataVersion, setDataVersion] = useState(0);

    const [filterError, setFilterError] = useState('');


    useEffect(() => {
        async function fetchTodos() {
            setIsTodoListLoading(true);
            setError('');

            try {
                const paramsObject = {
                    sortBy,
                    sortDirection,
                    limit: 100,
                }
                if (debouncedFilterTerm) {
                    paramsObject.find = debouncedFilterTerm;
                }
                const params = new URLSearchParams(paramsObject);
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
                    setTodoList(fetchedTodos);
                    setFilterError('');
                } else if (response.status === 401) {
                    throw new Error('Unauthorized Access');
                } else {
                    throw new Error(`Failed to fetch todos: ${response.status}`);
                }
            } catch(error) {
                if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
                    setFilterError(`Error filtering/sorting todos: ${error.message}`);
                } else {
                    setError(`Error fetching todos: ${error.message}`);
                }
            } finally {
                setIsTodoListLoading(false);
            }
        }

        if (token) {
            fetchTodos();
        }
    }, [token, sortBy, sortDirection, debouncedFilterTerm]);

    // create a function to reset all the filters
    const handleResetFilters = () => {
        setFilterTerm('');
        setSortBy('createdAt');
        setSortDirection('desc');
        setFilterError('');
    };

    // create a function to invalidate cache
    const invalidateCache = useCallback(() => {
        console.log("Invalidating memo cache after todo mutation");
        setDataVersion(previous => previous + 1);
    }, []);

    // create a handler for new filter term
    const handleFilterChange = (newTerm) => {
        setFilterTerm(newTerm);
    };

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
                invalidateCache();

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
            } else {
                invalidateCache();
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
            } else {
                invalidateCache();
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
                <div>
                    <p>{error}</p>
                    <button
                        type='button'
                        onClick={() => setError('')}
                    >
                        Clear Error
                    </button>
                </div>
            }
            {/* filter error section */}
            {(filterError) && 
                <div>
                    <p>{filterError}</p>
                    <button
                        type='butto'
                        onClick={() => setFilterError('')}
                    >
                        Clear Filter Error
                    </button>
                    <button
                        type='button'
                        onClick={handleResetFilters}
                    >
                        Reset Filters
                    </button>
                </div>
            }
            {/* add loading indicator */}
            {isTodoListLoading && <p>Loading todos...</p>}
            <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={setSortBy} onSortDirectionChange={setSortDirection}/>
            <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange}/>
            <TodoForm onAddTodo={addTodo} />
            <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} dataVersion={dataVersion} />
        </div>
    )
}

export default TodosPage;
