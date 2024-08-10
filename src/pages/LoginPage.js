import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // useEffect 在组件加载时检查 /demo/all 路由的条件
    useEffect(() => {
        const checkDemoAll = async () => {
            try {
                const response = await axios.get('http://localhost:8080/demo/all');
                // 假设 response.data 是一个数组，并检查是否满足某个条件
                if (response.data.some(user => user.isActive)) { // 假设 someConditionMet 替换为具体的条件
                    window.location.href = 'http://localhost:3000/content'; // 外部链接重定向
                }
            } catch (error) {
                console.error('Error checking /demo/all', error);
            }
        };
        checkDemoAll();
    }, []);

    const handleLogin = async () => {
        try {
            // 检查 /demo/all 路由中是否有响应的邮箱和密码
            const allResponse = await axios.get('http://localhost:8080/demo/all');
            const userExists = allResponse.data.some(user => user.email === email && user.password === password);

            if (userExists) {
                // 如果匹配到用户，则重定向到 content 页面
                localStorage.setItem('userEmail', email);
                navigate('/content');
            } else {
                // 如果没有匹配到用户，则显示请注册的错误信息
                setError('User not found. Please register.');
            }
        } catch (error) {
            console.error('Login failed', error);
            setError('An error occurred during login. Please try again.;%s', error);
        }
    };
    const handleDelete = async () => {
        try {
            // 通过获取所有用户找到匹配的用户ID
            const allResponse = await axios.get('http://localhost:8080/demo/all');
            const user = allResponse.data.find(user => user.email === email);

            if (user) {
                // 发送 DELETE 请求删除用户
                await axios.delete(`http://localhost:8080/demo/delete/${user.id}`);
                setError('User deleted successfully.');
            } else {
                setError('User not found.');
            }
        } catch (error) {
            console.error('Delete failed', error);
            setError('An error occurred during deletion. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>Hi, 欢迎来到敏捷看板</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleLogin}>Login</button>
            <button className="register-button" onClick={() => navigate('/register')}>Register</button>
            <button className="delete-button" onClick={handleDelete}>Delete Account</button>
        </div>
    );
}

export default LoginPage;
