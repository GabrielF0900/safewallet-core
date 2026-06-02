package br.com.safewallet.dto;

import java.math.BigDecimal;

public record TransactionResponseDTO(
        String message,
        String type,
        BigDecimal amount,
        BigDecimal newBalance) {
}
