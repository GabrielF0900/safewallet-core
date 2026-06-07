package br.com.safewallet.doc.controllers;

//FAMILIA DO OPENAPI, PARA DOCUMENTAÇÃO DE API COM SWAGGER
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

//FAMILIA DO SPRING WEB, PARA DOCUMENTAÇÃO DE API COM SWAGGER
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;

//FAMILIA DE DADOS ONDE VAMOS IMPORTAR OS DTOS.
import br.com.safewallet.dto.LoginRequestDTO;
import br.com.safewallet.dto.LoginResponseDTO;
import br.com.safewallet.dto.UserRequestDTO;
import br.com.safewallet.dto.UserResponseDTO;

//IMPORTANDO PARA DOCUMENTAR O ESQUEMA DE VALIDAÇÃO DOS CAMPOS DO DTO
import io.swagger.v3.oas.annotations.media.Schema;
import br.com.safewallet.dto.ApiErrorMessage;

@Tag(name = "Módulo de Autenticação", description = "Endpoints relacionados à autenticação de usuários, incluindo login e registro.")
public interface UserApi {
    @Operation(summary = "Registrar um novo usuário", description = "Criar um novo usuário com as informações fornecidas.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class))),
            @ApiResponse(responseCode = "409", description = "Conflito - email já registrado", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class)))
    })
    ResponseEntity<UserResponseDTO> registerUser(UserRequestDTO userRequestDTO);



    @Operation(summary = "Autenticar um usuário", description = "Valida as credenciais do usuário e retorna um token JWT válido para acessar recursos protegidos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login efetuado com sucesso, token retornado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas (e-mail ou senha incorretos).", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor.", content = @Content(mediaType = "application/json"))
    })
    ResponseEntity<LoginResponseDTO> loginUser(LoginRequestDTO loginRequestDTO) throws Exception;
}
