import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useInactivityLogout = (timeout = 300000) => { // 5 minutes = 300,000 ms
    const navigate = useNavigate();

    useEffect(() => {
        const resetTimer = () => {
            clearTimeout(window.inactivityTimeout);
            window.inactivityTimeout = setTimeout(logout, timeout);
        };

        const logout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('fullName');
            localStorage.removeItem('emailAddress');
            alert('Session timed out due to inactivity.');
            navigate('/');
        };

        // Events that reset the timer
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
        events.forEach((event) => window.addEventListener(event, resetTimer));

        resetTimer(); // initialize timer on mount

        return () => {
            clearTimeout(window.inactivityTimeout);
            events.forEach((event) => window.removeEventListener(event, resetTimer));
        };
    }, [navigate, timeout]);
};

export default useInactivityLogout;