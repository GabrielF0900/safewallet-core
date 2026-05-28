package br.com.safewallet.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.safewallet.dto.UserRequestDTO;
import br.com.safewallet.dto.UserResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/users")
public class UserController {

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRequestDTO request
){
    UserResponseDTO response = new UserResponseDTO(request.name(), request.email());    
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> LoginUser(@Valid @RequestBody UserRequestDTO request){
        UserResponseDTO response = new UserResponseDTO(request.name(), request.email());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
}
