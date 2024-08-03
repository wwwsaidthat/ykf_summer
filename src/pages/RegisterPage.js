import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // 使用相同的CSS文件

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post('/api/auth/register', { email, password });
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const { value } = e.target;
        setConfirmPassword(value);
        setPasswordsMatch(value === password);
    };

    const canRegister = email && password && passwordsMatch;

    // 定义内联样式对象
    const inputStyle = {
        color: '#fff',
        backgroundColor: '#333',
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        marginBottom: '10px'
    };



    const errorMessageStyle = {
        color: '#f00',
        marginBottom: '10px'
    };

    return (
        <div className="login-container">
            <h2 style={{ color: '#ffcc00' }}>Register</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={inputStyle}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={inputStyle}
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
                style={inputStyle}
            />
            {!passwordsMatch && <p style={errorMessageStyle}>Passwords do not match.</p>}
            <button onClick={handleRegister} disabled={!canRegister} >
                Register
            </button>
        </div>
    );
}

export default RegisterPage;
