package br.com.safewallet.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransactionHistoryDTO(
        UUID id,
        String type,
        BigDecimal amount,
        BigDecimal balanceAfter,
        UUID sourceWalletId,
        UUID destinationWalletId,
        LocalDateTime createdAt) {
}