package br.com.safewallet.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record BalanceResponseDTO(
        BigDecimal balance,
        UUID walletId) {
}
