package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @CrossOrigin(origins = "http://localhost:3000/content")
    @GetMapping("/tasks")
    public Iterable<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // 添加新的任务到指定项目
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/add/{projectId}")
    public ResponseEntity<Task> addTaskToProject(@PathVariable Long projectId, @RequestBody Task task) {
        return projectRepository.findById(projectId).map(project -> {
            task.setProjectId(project.getId());  // 设置 Task 的 projectId 为 Project 的 ID
            task.setProject(project);
            Task savedTask = taskRepository.save(task);
            return ResponseEntity.ok().body(savedTask);
        }).orElse(ResponseEntity.notFound().build());
    }


    // 获取指定项目的所有任务
    @CrossOrigin(origins = {"http://localhost:3000/content","http://localhost:3000"})
    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProjectId(@PathVariable Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    // 修改指定任务
    @CrossOrigin(origins = {"http://localhost:3000/content","http://localhost:3000"})
    @PutMapping("/edit/{taskId}")
    public ResponseEntity<Task> editTask(@PathVariable Long taskId, @RequestBody Task updatedTask) {
        return taskRepository.findById(taskId).map(task -> {
            task.setName(updatedTask.getName());
            task.setComment(updatedTask.getComment());
            task.setProjectId(updatedTask.getProjectId());  // 更新 Task 的 projectId
            if (updatedTask.getProject() != null) {
                task.setProject(updatedTask.getProject());  // 更新 Task 的 Project
            }
            Task savedTask = taskRepository.save(task);
            return ResponseEntity.ok().body(savedTask);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 删除指定任务
    @CrossOrigin(origins = {"http://localhost:3000/content","http://localhost:3000"})
    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        return taskRepository.findById(taskId).map(task -> {
            taskRepository.delete(task);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = {"http://localhost:3000/content","http://localhost:3000"})
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("taskId") Long taskId) {
        // 确保文件不为空
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("文件为空");
        }

        try {
            // 将文件转换为字节数组
            byte[] fileData = file.getBytes();

            // 更新任务的 fileData
            Task task = taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("任务未找到"));
            task.setFileData(fileData);
            taskRepository.save(task);


            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\": \"文件上传成功\"}");

        } catch ( IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("文件上传失败");
        }
    }
    @CrossOrigin(origins = "http://localhost:3000/content")

    @GetMapping("/tasks/{taskId}/file")
    public ResponseEntity<?> getFile(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("任务未找到"));
        byte[] fileData = task.getFileData();

        if (fileData == null) {
            return ResponseEntity.notFound().build();
        }

        // Convert byte array to Base64 string
        String base64FileData = Base64.getEncoder().encodeToString(fileData);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"fileData\": \"" + base64FileData + "\"}");
    }


}
