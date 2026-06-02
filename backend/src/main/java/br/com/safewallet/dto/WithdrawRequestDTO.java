package br.com.safewallet.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record WithdrawRequestDTO(
    @NotNull(message = "O valor não pode ser nulo.")
    @Positive(message = "O valor do saque deve ser maior que zero.")
    BigDecimal amount
) {}