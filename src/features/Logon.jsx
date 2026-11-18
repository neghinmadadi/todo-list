import { useState } from 'react';

function Logon({onSetEmail = () => {}, onSetToken = () => {}}) {

    // controlled form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // to display login failure
    const [authError, setAuthError] = useState('');
    // to show loading state during login
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoggingOn(true);
        setAuthError('');

        try {
            const response = await fetch('/api/users/logon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            if (response.status === 200 && data.email && data.csrfToken) {
                onSetEmail(data.email);
                onSetToken(data.csrfToken);
            } else {
                setAuthError(`Authentication failed: ${data?.message}`);
            }
        } catch(error) {
            setAuthError(`Error: ${error.name} | ${error.message}`);
        } finally {
            setIsLoggingOn(false);
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            
            {/* display authentication error if exists */}
            {authError && <div>{authError}</div>}

            <div>
                <label htmlFor='userEmail'>Email</label>
                <input 
                    type='email'
                    id='userEmail'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor='userPassword'>Password</label>
                <input 
                    type='password'
                    id='userPassword'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
            </div>

            <button 
                type='submit'
                disabled={isLoggingOn}
            >
                {isLoggingOn ? 'Logging in...' : 'Log in'}
            </button>
        </form>
    )
}

export default Logon;