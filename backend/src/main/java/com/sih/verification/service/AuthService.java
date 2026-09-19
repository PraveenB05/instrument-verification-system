package com.sih.verification.service;

import com.sih.verification.dto.LoginRequest;
import com.sih.verification.dto.RegisterRequest;
import com.sih.verification.dto.UserResponse;
import com.sih.verification.entity.Role;
import com.sih.verification.entity.User;
import com.sih.verification.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        // Direct password check suitable for college demonstration
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }

        return toUserResponse(user);
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("An account with email " + request.getEmail() + " already exists.");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.INSTRUMENT_OWNER;
        User user = new User(request.getName(), request.getEmail(), request.getPassword(), role);
        User savedUser = userRepository.save(user);

        return toUserResponse(savedUser);
    }

    public User findEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
