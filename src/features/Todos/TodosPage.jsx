import { useState } from "react";
import TodoList from "./features/Todos/TodoList/TodoList.jsx";
import TodoForm from "./features/Todos/TodoForm.jsx";

function TodosPage() {

    const [todoList, setTodoList] = useState([]);

    function addTodo(todoTitle) {
        const newTodo = {
        id: Date.now(),
        title: todoTitle,
        isCompleted: false
        }
        // update todoList
        setTodoList(previous => [newTodo, ...previous]);
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
