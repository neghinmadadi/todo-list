import { useRef, useState } from "react";

function TodoForm({onAddTodo}) {

    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    const handleAddTodo = (event) => {
        event.preventDefault();

        onAddTodo(workingTodoTitle);
        console.log(workingTodoTitle);
        // reset the input field
        setWorkingTodoTitle('');
        inputRef.current.focus();
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
            <button type="submit" disabled={!workingTodoTitle.trim()}>
                Add Todo
            </button>
            {/**check whether input field updates as user types (don't forget to comment out after success)*/}
            {/* <p>{workingTodoTitle ? `Adding ${workingTodoTitle.trim()}` : "Add todo above"}</p> */}
        </form>
    );
}

export default TodoForm;


// // some tests to see the event obj
// console.log("event obj: ", event);
// console.log("event target: ", event.target);
// console.log("input value: ", event.target.todoTitle.value);