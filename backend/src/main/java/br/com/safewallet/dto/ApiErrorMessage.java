package br.com.safewallet.dto;

import java.time.Instant;
import java.util.Map;

/**
 * RNF-005: Objeto imutável de resposta para erros corporativos.
 * Centraliza e padroniza o contrato de falhas enviado ao React.
 */
public record ApiErrorMessage(
    Instant timestamp,
    Integer status,
    String error,
    String message,
    Map<String, String> errors // Guarda os campos específicos que falharam (Ex: "email" -> "O email é inválido")
) {}