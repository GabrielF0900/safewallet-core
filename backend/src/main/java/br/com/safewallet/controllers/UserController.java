package br.com.safewallet.controllers;

import br.com.safewallet.dto.LoginRequestDTO;
import br.com.safewallet.dto.UserRequestDTO;
import br.com.safewallet.dto.UserResponseDTO;
import br.com.safewallet.services.AuthService;
import br.com.safewallet.services.CreateUserService;
import br.com.safewallet.services.TokenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.safewallet.dto.LoginResponseDTO;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final CreateUserService createUserService;
    private final AuthService authService;
    private final TokenService tokenService;

    public UserController(CreateUserService createUserService, AuthService authService, TokenService tokenService) {
        this.createUserService = createUserService;
        this.authService = authService;
        this.tokenService = tokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRequestDTO request) {
        UserResponseDTO response = this.createUserService.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@Valid @RequestBody LoginRequestDTO request) throws Exception {
        System.out.println("🚀 [TELEMETRIA] 1. Requisição de login recebida para o e-mail: " + request.email());

        var userEntity = this.authService.execute(request);
        System.out.println("🚀 [TELEMETRIA] 2. Usuário autenticado no banco. Nome: " + userEntity.getName());
        
        String jwtToken = this.tokenService.generateToken(userEntity);
        System.out.println("🚀 [TELEMETRIA] 3. STRING DO TOKEN GERADA NO JAVA: " + jwtToken);

        LoginResponseDTO loginInfo = new LoginResponseDTO(
            "Login efetuado com sucesso!",
            jwtToken,
            userEntity.getName()
        );
        
        System.out.println("🚀 [TELEMETRIA] 4. Enviando token dentro do .body()");
        return ResponseEntity.status(HttpStatus.OK).body(loginInfo);
    }
}