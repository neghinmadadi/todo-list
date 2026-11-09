import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel.jsx";

function TodoForm({onAddTodo}) {

    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    const handleAddTodo = (event) => {
        event.preventDefault();

        onAddTodo(workingTodoTitle);
        // reset the input field
        setWorkingTodoTitle('');
        inputRef.current.focus();
    };
    
    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel
                ref={inputRef}
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                elementId="todoTitle"
                labelText="Todo"
            />
            
            <button type="submit" disabled={!workingTodoTitle.trim()}>
                Add Todo
            </button>
            {/**check whether input field updates as user types (commented out after success)*/}
            {/* <p>{workingTodoTitle ? `Adding ${workingTodoTitle.trim()}` : "Add todo above"}</p> */}
        </form>
    );
}

export default TodoForm;


// // some tests to see the event obj
// console.log("event obj: ", event);
// console.log("event target: ", event.target);
// console.log("input value: ", event.target.todoTitle.value);