import { useRef } from "react";

function TodoForm({onAddTodo}) {

    const inputRef = useRef();

    const handleAddTodo = (event) => {
        event.preventDefault();

        // // some tests to see the event obj
        // console.log("event obj: ", event);
        // console.log("event target: ", event.target);
        // console.log("input value: ", event.target.todoTitle.value);

        const todoTitle = event.target.todoTitle.value.trim();
        if (todoTitle) {
            onAddTodo(todoTitle);
            // reset the input field
            event.target.reset();
            inputRef.current.focus();
        }
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
                required
            />
            <button type="submit">
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;