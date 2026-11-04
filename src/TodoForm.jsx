import { useRef, useState } from "react";

function TodoForm({onAddTodo}) {

    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    const handleAddTodo = (event) => {
        event.preventDefault();

        // const todoTitle = event.target.todoTitle.value.trim();
        // if (workingTodoTitle) {
            onAddTodo(workingTodoTitle);
            // reset the input field
            setWorkingTodoTitle('');
            inputRef.current.focus();
        // }
    };
    
    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input
                ref={inputRef}
                type="text" 
                id="todoTitle"
                name="todoTitle"
                placeholder={"Todo text"}
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                required
            />
            <button type="submit">
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;


// // some tests to see the event obj
// console.log("event obj: ", event);
// console.log("event target: ", event.target);
// console.log("input value: ", event.target.todoTitle.value);