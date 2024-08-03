import React, { useState } from 'react';

const initialProjects = [
    {
        id: 1,
        name: 'Project A',
        description: 'This is the initial project named Project A.',
        createdAt: new Date().toLocaleDateString(),
        tasks: [
            { id: 1, title: 'Task 1', description: 'Task 1 description' },
            { id: 2, title: 'Task 2', description: 'Task 2 description' },
        ],
    },
    {
        id: 2,
        name: 'Project B',
        description: 'This is the initial project named Project B.',
        createdAt: new Date().toLocaleDateString(),
        tasks: [
            { id: 1, title: 'Task 1', description: 'Task 1 description' },
            { id: 2, title: 'Task 2', description: 'Task 2 description' },
        ],
    },
];

function ProjectContentPage() {

    const [projects, setProjects] = useState(initialProjects);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [editedProject, setEditedProject] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [showTasks, setShowTasks] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProject({ ...editedProject, [name]: value });
    };

    const handleSave = () => {
        setProjects(
            projects.map((project) =>
                project.id === editedProject.id ? editedProject : project
            )
        );
        setIsEditing(false);
        setCurrentProject(null);
    };

    const handleEdit = (project) => {
        setEditedProject(project);
        setIsEditing(true);
    };

    const handleDelete = (projectId) => {
        setProjects(projects.filter((project) => project.id !== projectId));
        if (currentProject && currentProject.id === projectId) {
            setCurrentProject(null); // 如果删除的是当前显示的项目，关闭项目详情
            setShowTasks(false); // 重置任务显示
        }
    };


    const handleAddTask = (projectId) => {
        const newTitle = prompt('Enter new task title:');
        const newDescription = prompt('Enter new task description:');
        if (newTitle && newDescription) {
            const newTask = {
                id: projects.find(p => p.id === projectId).tasks.length + 1,
                title: newTitle,
                description: newDescription,
            };
            const updatedProjects = projects.map((project) => {
                if (project.id === projectId) {
                    return { ...project, tasks: [...project.tasks, newTask] };
                }
                return project;
            });
            setProjects(updatedProjects);
        }
    };

    const handleModifyTask = (projectId, taskId) => {
        const newTitle = prompt('Enter modified task title:');
        const newDescription = prompt('Enter modified task description:');
        if (newTitle && newDescription) {
            const updatedProjects = projects.map((project) => {
                if (project.id === projectId) {
                    const updatedTasks = project.tasks.map((task) => {
                        if (task.id === taskId) {
                            return { ...task, title: newTitle, description: newDescription };
                        }
                        return task;
                    });
                    return { ...project, tasks: updatedTasks };
                }
                return project;
            });
            setProjects(updatedProjects);

            // 直接更新当前显示的项目
            if (currentProject && currentProject.id === projectId) {
                const updatedProject = updatedProjects.find(project => project.id === projectId);
                setCurrentProject(updatedProject);
            }
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


    const handleAdd = () => {
        const newName = prompt('Enter new project name:');
        const newDescription = prompt('Enter new project description:');
        if (newName && newDescription) {
            const newProject = {
                id: projects.length + 1,
                name: newName,
                description: newDescription,
                createdAt: new Date().toLocaleDateString(),
                tasks: [],
            };
            setProjects([...projects, newProject]);
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

    return (
        <div style={styles.pageContainer}>
            <div style={styles.projectListContainer}>
                {projects.map((project) => (
                    <div key={project.id} style={styles.projectContainer}>
                        {deleteMode && (
                            <div
                                style={styles.deleteDot}
                                onClick={() => handleDelete(project.id)}
                            ></div>
                        )}
                        <h1
                            style={styles.title}
                            onClick={() => navigateToProjectPage(project)}
                        >
                            {project.name}
                        </h1>
                        <p style={styles.description}>{project.description}</p>
                        <p style={styles.meta}>Created on: {project.createdAt}</p>
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
                        <p style={styles.meta}>Created on: {currentProject.createdAt}</p>
                        <button onClick={() => setShowTasks(!showTasks)}>
                            {showTasks ? 'Hide Tasks' : 'Show Tasks'}
                        </button>
                        {showTasks && (
                            <ul>
                                {currentProject.tasks.map((task) => (
                                    <li key={task.id} style={styles.taskStyle}>
                                        {task.title} - {task.description}
                                        {!deleteMode && (
                                            <div>
                                                <button onClick={() => handleModifyTask(currentProject.id, task.id)}>
                                                    Modify
                                                </button>
                                                <button onClick={() => handleDeleteTask(currentProject.id, task.id)}>
                                                    Delete
                                                </button>
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
    );
}
const styles = {
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
