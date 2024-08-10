package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(path="/demo")
@CrossOrigin(origins = "http://localhost:3000")
public class MainController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<String> addNewUser(@RequestParam String password, @RequestParam String email) {
        if (userRepository.findByEmail(email) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
        }
        User n = new User();
        n.setPassword(password);
        n.setEmail(email);
        userRepository.save(n);
        return ResponseEntity.ok("Saved");
    }

    @GetMapping("/all")
    public @ResponseBody Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    @CrossOrigin(origins = "http://localhost:3000/login")
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
    @CrossOrigin(origins = "http://localhost:3000/login")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }
}
