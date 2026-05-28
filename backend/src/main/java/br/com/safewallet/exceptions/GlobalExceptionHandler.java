package br.com.safewallet.exceptions;

import java.time.Instant;
import java.util.HashMap;
import java.util.logging.Handler;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import br.com.safewallet.dto.ApiErrorMessage;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.util.Map;

@ControllerAdvice

/**
 * Intercepta especificamente falhas de validação de DTOs (@Valid)
 */
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorMessage> handleValidationExceptions(MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        // Aqui você pode construir um ApiErrorMessage detalhado usando os erros de
        // validação
        // e retornar uma resposta personalizada para o cliente React.

        Map<String, String> validationErrors = new HashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            validationErrors.put(error.getField(), error.getDefaultMessage());
        }

        ApiErrorMessage errorPayload = new ApiErrorMessage(
                Instant.now(), // Timestamp do erro[
                HttpStatus.BAD_REQUEST.value(), // Status HTTP 400
                "Validation Failed", // Tipo de erro
                "Existem campos inválidos no payload", // Mensagem genérica
                validationErrors // Detalhes específicos dos campos que falharam
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorPayload);
    }
}
