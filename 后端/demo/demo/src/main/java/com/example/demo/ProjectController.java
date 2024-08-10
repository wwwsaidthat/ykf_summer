package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000") // 允许从React应用的特定页面进行跨域请求
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;
    @CrossOrigin(origins = "http://localhost:3000/content")
    @GetMapping("/projects")
    public Iterable<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @CrossOrigin(origins = "http://localhost:3000/content")
    @PostMapping("/addProject")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project savedProject = projectRepository.save(project);
        return ResponseEntity.ok(savedProject);
    }

    @CrossOrigin(origins = "http://localhost:3000/content")
    @GetMapping("/{userEmail}")
    public ResponseEntity<List<Project>> getProjectsByUserEmail(@RequestParam String userEmail) {
        List<Project> projects = projectRepository.findByUserEmail(userEmail);
        return ResponseEntity.ok(projects);
    }
    @CrossOrigin(origins = "http://localhost:3000/content")
    @DeleteMapping("/deleteProject/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            return ResponseEntity.notFound().build();
        }
        projectRepository.deleteById(projectId);
        return ResponseEntity.noContent().build();
    }
    @CrossOrigin(origins = "http://localhost:3000/content")
    @PutMapping("/editProject/{projectId}")
    public ResponseEntity<Project> editProject(@PathVariable Long projectId, @RequestBody Project projectDetails) {
        Optional<Project> optionalProject = projectRepository.findById(projectId);
        if (!optionalProject.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Project project = optionalProject.get();
        project.setName(projectDetails.getName());


        Project updatedProject = projectRepository.save(project);
        return ResponseEntity.ok(updatedProject);
    }
}
