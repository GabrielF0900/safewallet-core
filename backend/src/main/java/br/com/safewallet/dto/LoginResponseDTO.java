package br.com.safewallet.dto;



public record LoginResponseDTO(
    String message,
    String token,
    String name
) 
    
{}
