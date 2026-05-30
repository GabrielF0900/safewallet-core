package br.com.safewallet.dto;
import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
/*DTO para padronização de dados para registro de usuarios */

public record UserRequestDTO (
    @NotBlank(message = "O nome é obrigatório")
    String name,

    
    @Email(message = "O email é inválido")
    @NotBlank(message = "O email é obrigatório")
    String email,

    
    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve conter no mínimo 6 caracteres")
    String password
) {

    public UUID id() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'id'");
    }
}
