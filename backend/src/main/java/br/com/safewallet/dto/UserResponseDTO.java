package br.com.safewallet.dto;

/**DTO para padronizar o payload de response da requisição do login do usuario */

public record UserResponseDTO (
    String name,
    String email
) {
}