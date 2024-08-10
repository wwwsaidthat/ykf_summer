import React, { useState, useEffect } from 'react';

const apiUrl = 'http://localhost:8080/api/projects';

function ProjectContentPage({ email }) {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [editedProject, setEditedProject] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [showTasks, setShowTasks] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch(`${apiUrl}/projects`);
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProject({ ...editedProject, [name]: value });
    };

    const handleAdd = async () => {
        const newName = prompt('Enter new project name:');
        const newDescription = prompt('Enter new project description:');
        const userEmail = localStorage.getItem('userEmail');

        if (newName && newDescription) {
            const newProject = {
                name: newName,
                description: newDescription,
                userEmail: userEmail  // 添加 userEmail 字段
            };

            try {
                const response = await fetch(`${apiUrl}/addProject`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newProject)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const savedProject = await response.json();
                setProjects([...projects, savedProject]);
            } catch (error) {
                console.error('Failed to add project:', error);
            }
        }
    };

    const handleSave = async () => {
        try {
            const projectId = editedProject.id;
            const response = await fetch(`${apiUrl}/editProject/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProject),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedProject = await response.json();
            setProjects(
                projects.map((project) =>
                    project.id === updatedProject.id ? updatedProject : project
                )
            );
            setIsEditing(false);
            setCurrentProject(null);
        } catch (error) {
            console.error('Failed to save project:', error);
        }
    };

    const handleEdit = (project) => {
        setEditedProject(project);
        setIsEditing(true);
    };

    const handleDelete = async (projectId) => {
        try {
            const response = await fetch(`${apiUrl}/deleteProject/${projectId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedProjects = projects.filter((project) => project.id !== projectId);
            setProjects(updatedProjects);

            if (currentProject && currentProject.id === projectId) {
                setCurrentProject(null);
                setShowTasks(false);
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    const handleAddTask = (projectId) => {
        const newTitle = prompt('Enter new task title:');
        // const newDescription = prompt('Enter new task description:');
        const newComment = prompt('Enter your comment:');
        if (newTitle && newComment) {
            const newTask = {
                name: newTitle,
                // description: newDescription,
                comment: newComment,  // 添加评论字段
            };

            fetch(`http://localhost:8080/api/tasks/add/${projectId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            })
                .then(response => response.json())
                .then(data => {
                    const updatedProjects = projects.map((project) => {
                        if (project.id === projectId) {
                            return { ...project, tasks: [...project.tasks, data] };
                        }
                        return project;
                    });
                    setProjects(updatedProjects);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };


    const handleModifyTask = (projectId, taskId) => {
        const newTitle = prompt('Enter modified task title:');
        const newComment = prompt('Enter modified comment:');
        const newProjectId = projectId; // 保持项目ID一致

        if (newTitle && newComment) {
            const updatedTask = {
                name: newTitle,
                comment: newComment,
                projectId: newProjectId,
            };

            fetch(`http://localhost:8080/api/tasks/edit/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const updatedProjects = projects.map(project => {
                        if (project.id === projectId) {
                            const updatedTasks = project.tasks.map(task => {
                                if (task.id === taskId) {
                                    return data;
                                }
                                return task;
                            });
                            return { ...project, tasks: updatedTasks };
                        }
                        return project;
                    });
                    setProjects(updatedProjects);

                    if (currentProject && currentProject.id === projectId) {
                        const updatedProject = updatedProjects.find(project => project.id === projectId);
                        setCurrentProject(updatedProject);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };


    const handleDeleteTask = (projectId, taskId) => {
        const updatedProjects = projects.map((project) => {
            if (project.id === projectId) {
                const updatedTasks = project.tasks.filter((task) => task.id !== taskId);
                return { ...project, tasks: updatedTasks };
            }
            return project;
        });
        setProjects(updatedProjects);

        // 如果当前显示的项目是被修改的项目，更新其状态
        if (currentProject && currentProject.id === projectId) {
            const updatedProject = updatedProjects.find(project => project.id === projectId);

            // 检查是否所有任务都被删除
            if (updatedProject.tasks.length === 0) {
                setCurrentProject(null); // 关闭项目详情
                setShowTasks(false); // 重置任务显示
            } else {
                setCurrentProject(updatedProject);
            }
        }
    };

    const toggleDeleteMode = () => {
        setDeleteMode(!deleteMode);
    };

    const navigateToProjectPage = (project) => {
        // Check if clicking the same project again
        if (currentProject && currentProject.id === project.id) {
            setCurrentProject(null); // Close the window
            setShowTasks(false); // Reset tasks display if needed
        } else {
            setCurrentProject(project);
            setShowTasks(false); // Reset tasks display
            setIsEditing(false); // Exit editing mode if open
        }
    };




    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSave2 = async (projectId, taskId) => {
        if (!file) {
            alert('请先选择一个文件！');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        // 添加 taskId 和 projectId 到 FormData
        formData.append('taskId', taskId);
        formData.append('projectId', projectId); // 如果需要 projectId

        try {
            const response = await fetch('http://localhost:8080/api/tasks/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('上传成功:', result);
                // 在这里可以处理返回的结果，例如更新 UI
            } else {
                const errorText = await response.text(); // 获取错误信息
                console.error('上传失败:', response.statusText, errorText);
            }
        } catch (error) {
            console.error('上传过程中发生错误:', error);
        }
    };
    // Function to create a file URL from Base64 data
    const createFileUrlFromBase64 = (base64Data, fileName) => {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const blob = new Blob([byteNumbers], { type: 'application/octet-stream' }); // Adjust MIME type as needed
        return URL.createObjectURL(blob);
    };

    const openAttachment = (fileUrl) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank'); // Open the file in a new tab
        } else {
            alert('没有可显示的附件！'); // Alert if no file URL is provided
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.projectListContainer}>
                {projects.map((project) => (
                    <div key={project.id} style={styles.projectContainer}>
                        {deleteMode && (
                            <div
                                style={styles.deleteDot}
                                onClick={() => handleDelete(project.id)}
                            >
                                &times;
                            </div>
                        )}
                        <h1
                            style={styles.title}
                            onClick={() => navigateToProjectPage(project)}
                        >
                            {project.name}
                        </h1>
                        <p style={styles.description}>{project.description}</p>
                        <p style={styles.meta}>User Email: {project.userEmail}</p> {/* 显示 userEmail */}
                        {!deleteMode && (
                            <div>
                                <button onClick={() => handleEdit(project)}>Edit</button>
                                <button onClick={() => handleAddTask(project.id)}>Add Task</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div style={styles.contentContainer}>
                {currentProject && !isEditing && (
                    <div style={styles.projectDetailContainer}>
                        <h1 style={styles.title}>{currentProject.name}</h1>
                        <p style={styles.description}>{currentProject.description}</p>
                        <p style={styles.meta}>User Email: {currentProject.userEmail}</p> {/* 显示 userEmail */}
                        <button onClick={() => setShowTasks(!showTasks)}>
                            {showTasks ? 'Hide Tasks' : 'Show Tasks'}
                        </button>
                        {showTasks && (
                            <ul>
                                {currentProject.tasks.map((task) => (
                                    <li key={task.id} style={styles.taskStyle}>
                                        {task.name}
                                        <p style={styles.comment}>{task.comment}</p>
                                        {!deleteMode && (
                                            <div>
                                                <button onClick={() => handleModifyTask(currentProject.id, task.id)}>
                                                    Modify
                                                </button>
                                                <button onClick={() => handleDeleteTask(currentProject.id, task.id)}>
                                                    Delete
                                                </button>
                                                <button onClick={() => openAttachment(createFileUrlFromBase64(task.fileData, 'task_file.txt'))}>
                                                    show Attachment
                                                </button>
                                                <div>
                                                    <input type="file" onChange={handleFileChange} />
                                                    <button onClick={() => handleSave2(currentProject.id, task.id)}>保存</button>

                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                {isEditing && (
                    <div style={styles.editorContainer}>
                        <input
                            type="text"
                            name="name"
                            value={editedProject.name}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        <textarea
                            name="description"
                            value={editedProject.description}
                            onChange={handleInputChange}
                            style={styles.textarea}
                        />
                        <button onClick={handleSave}>Save</button>
                    </div>
                )}
            </div>
            <div style={styles.buttonsContainer}>
                <button onClick={handleAdd}>Add Project</button>
                <button onClick={toggleDeleteMode}>
                    {deleteMode ? 'Exit Delete Mode' : 'Delete Project'}
                </button>
            </div>
        </div>
    )
}
const styles = {
    comment: {
        fontSize: '14px',
        color: '#555',
        marginTop: '5px',
        fontStyle: 'italic',
    },
    pageContainer: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    projectListContainer: {
        width: '80%',
        maxHeight: '400px',
        overflowY: 'scroll',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        padding: '10px',
        marginBottom: '20px',
    },
    projectContainer: {
        padding: '10px',
        borderBottom: '1px solid #ddd',
        position: 'relative',
    },
    deleteDot: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        width: '20px',
        height: '20px',
        backgroundColor: 'red',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'black', // 设置叉的颜色
        fontWeight: 'bold', // 设置叉的粗细
        fontSize: '16px', // 设置叉的大小
    },
    contentContainer: {
        width: '80%',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    projectDetailContainer: {
        width: '100%',
        maxWidth: '600px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },
    editorContainer: {
        width: '100%',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: '24px',
        marginBottom: '10px',
        color: 'black',
        cursor: 'pointer',
    },
    description: {
        fontSize: '16px',
        marginBottom: '10px',
        color: 'black',
    },
    meta: {
        fontSize: '14px',
        color: '#888',
        marginBottom: '10px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '8px',
        border: '1px solid #ddd',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '8px',
        border: '1px solid #ddd',
    },
    buttonsContainer: {
        display: 'flex',
        gap: '10px',
    },
    taskStyle: {
        color: 'black',
    },
};

export default ProjectContentPage;