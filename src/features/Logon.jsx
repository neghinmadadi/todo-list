import { useState } from 'react';

function Logon({onSetEmail = () => {}, onSetToken = () => {}}) {

    // controlled form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // to display login failure
    const [authError, setAuthError] = useState('');
    // to show loading state during login
    const [isLoggingOn, setIsLoggingOn] = useState(false);

}