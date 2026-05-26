package com.food.user.controller;

import com.food.user.dto.AuthResponse;
import com.food.user.dto.LoginRequest;
import com.food.user.dto.RegisterRequest;
import com.food.user.dto.UserDto;
import com.food.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller layer exposing endpoints for register, authenticate, and profiles querying.
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("REST request to register new user Account");
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("REST request to login user: {}", request.email());
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/users/profile")
    public ResponseEntity<UserDto> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("REST request to query account profile info: {}", userDetails.getUsername());
        return ResponseEntity.ok(userService.getUserProfile(userDetails.getUsername()));
    }
}
