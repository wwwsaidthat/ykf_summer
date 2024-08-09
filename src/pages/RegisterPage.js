import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // 保持使用原有的CSS文件

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [error, setError] = useState(''); // 用于显示错误信息
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault(); // 阻止表单的默认提交行为

        if (!passwordsMatch) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/demo/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'password': password,
                    'email': email
                }).toString()
            });

            if (response.ok) {
                navigate('/login'); // 注册成功后跳转到登录页面
            } else {
                setError('Registration failed'); // 注册失败显示错误信息
            }
        } catch (error) {
            console.error('Registration failed', error);
            setError('Registration failed'); // 发生错误时显示错误信息
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
            <form onSubmit={handleRegister}>
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
                <button type="submit" disabled={!canRegister} style={inputStyle}>
                    Register
                </button>
                {error && <p style={errorMessageStyle}>{error}</p>}
            </form>
        </div>
    );
}

export default RegisterPage;
