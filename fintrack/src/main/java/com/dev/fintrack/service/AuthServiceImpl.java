package com.dev.fintrack.service;

import com.dev.fintrack.dto.auth.AuthResponse;
import com.dev.fintrack.dto.auth.LoginRequest;
import com.dev.fintrack.dto.auth.RegisterRequest;
import com.dev.fintrack.entity.Role;
import com.dev.fintrack.entity.User;
import com.dev.fintrack.enums.UserStatus;
import com.dev.fintrack.exception.BadRequestException;
import com.dev.fintrack.exception.ResourceNotFoundException;
import com.dev.fintrack.repository.RoleRepository;
import com.dev.fintrack.repository.UserRepository;
import com.dev.fintrack.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtil jwtUtil;

	@Override
	public AuthResponse register(RegisterRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new BadRequestException("Email already registered");
		}

		Role role = roleRepository.findByName(request.getRole())
				.orElseThrow(() -> new ResourceNotFoundException("Role not found"));

		User user = new User();
		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setStatus(UserStatus.ACTIVE);
		user.setRole(role);

		userRepository.save(user);

		String token = jwtUtil.generateToken(user.getEmail());

		return new AuthResponse(token, "User registered successfully", user.getRole().getName().name(),
				user.getEmail());
	}

	@Override
	public AuthResponse login(LoginRequest request) {
		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		String token = jwtUtil.generateToken(user.getEmail());

		return new AuthResponse(token, "Login successful", user.getRole().getName().name(), user.getEmail());
	}
}