package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

//    @CrossOrigin(origins = "http://localhost:3000/content")
//    @GetMapping("/comments")
//    public List<Comment> getAllComments() {
//        return commentRepository.findAll();
//    }

    // 添加评论到特定任务
    @CrossOrigin(origins = "http://localhost:3000/content")
    @PostMapping("/add2/{taskId}")
    public ResponseEntity<Comment> addComment(@PathVariable Long taskId, @RequestBody Comment comment) {
        Task task = taskRepository.findById(taskId).orElse(null);

        if (task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        comment.setTask(task);
        Comment savedComment = commentRepository.save(comment);
        return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
    }


    // 修改评论
    @CrossOrigin(origins = "http://localhost:3000/content")
    @PutMapping("/editComment/{taskId}")
    public ResponseEntity<Task> editComment(@PathVariable Long taskId, @RequestBody Task updatedTask) {
        return taskRepository.findById(taskId)
                .map(task -> {
                    task.setComment(updatedTask.getComment());
                    Task savedTask = taskRepository.save(task);
                    return new ResponseEntity<>(savedTask, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

}
