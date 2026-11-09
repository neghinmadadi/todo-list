
import { useState } from "react";
import TodoList from "./TodoList.jsx";
import TodoForm from "./features/TodoForm.jsx";
import './App.css'


function App() {

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
  
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo}/>
    </div>
  )
}

export default App;
