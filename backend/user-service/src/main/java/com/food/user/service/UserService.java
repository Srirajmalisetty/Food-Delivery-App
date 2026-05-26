package com.food.user.service;

import com.food.user.config.JwtService;
import com.food.user.dto.AuthResponse;
import com.food.user.dto.LoginRequest;
import com.food.user.dto.RegisterRequest;
import com.food.user.dto.UserDto;
import com.food.user.model.User;
import com.food.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Enterprise service layer managing user profiles and security workflows.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Processing registration request for user: {}", request.email());

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email address is already in use");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .role(request.role())
                .build();

        User savedUser = userRepository.save(user);
        String jwtToken = jwtService.generateToken(savedUser);

        return new AuthResponse(jwtToken, mapToDto(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Processing authentication request for user: {}", request.email());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.email()));

        String jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken, mapToDto(user));
    }

    public UserDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User profile not found with email: " + email));
        return mapToDto(user);
    }

    private UserDto mapToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole()
        );
    }
}
