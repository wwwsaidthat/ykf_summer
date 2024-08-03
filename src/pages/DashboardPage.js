import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DashboardPage() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await axios.get('/api/projects', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProjects(response.data);
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <div>
                {projects.map(project => (
                    <div key={project._id}>
                        <h3>{project.name}</h3>
                        {/* 项目中的任务展示 */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardPage;