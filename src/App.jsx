import './App.css'

function App() {

  const todoList = [
    {id: 1, title: "Review this week's course materials"},
    {id: 2, title: "Finalize module notes"},
    {id: 3, title: "Read the topics on react.dev"}
  ]

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todoList.map(todo => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>
  )
}

export default App
