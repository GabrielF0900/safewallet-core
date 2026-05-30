package br.com.safewallet.dto;
import java.util.UUID;
/**DTO para padronizar o payload de response da requisição do login do usuario */



public record UserResponseDTO (
    UUID id,
    String name,
    String email
) {
}