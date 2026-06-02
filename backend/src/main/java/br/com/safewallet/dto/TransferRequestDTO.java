package br.com.safewallet.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record TransferRequestDTO(
        @NotNull(message = "ID da carteira de destino é obrigatório") UUID destinationWalletId,

        @NotNull(message = "Valor é obrigatório") @DecimalMin(value = "0.01", message = "Valor deve ser maior que 0") BigDecimal amount) {
}
