import { useEffect, useState } from "react";

export function useDebounce(value, delay) {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // set up a timer to update the debounced value after delay
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay);
        // return a cleanup function to clear the timer
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;