
import { useState } from "react";
import TodoList from "./TodoList.jsx";
import TodoForm from "./TodoForm.jsx";
import './App.css'

// const todos = [
//             {id: 1, title: "Review this week's course materials"},
//             {id: 2, title: "Finalize module notes"},
//             {id: 3, title: "Read the topics on react.dev"}
//         ]

function App() {

  const [todoList, setTodoList] = useState([]);

  function addTodo({todoTitle}) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
    }
    // update todoList
    setTodoList(previous => [newTodo, ...previous])
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} />
    </div>
  )
}

export default App
