function TodoList() {
    
    const todoList = [
            {id: 1, title: "Review this week's course materials"},
            {id: 2, title: "Finalize module notes"},
            {id: 3, title: "Read the topics on react.dev"}
        ]
    return (
        <ul>
        {todoList.map(todo => <li key={todo.id}>{todo.title}</li>)}
        </ul>
    );
}

export default TodoList;