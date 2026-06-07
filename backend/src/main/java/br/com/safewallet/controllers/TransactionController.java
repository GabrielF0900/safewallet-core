package br.com.safewallet.controllers;
import br.com.safewallet.doc.controllers.TransactionApi;
import br.com.safewallet.dto.*;
import br.com.safewallet.entity.UserEntity;
import br.com.safewallet.entity.WalletEntity;
import br.com.safewallet.repositories.WalletRepository;
import br.com.safewallet.services.TransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController implements TransactionApi {

    private final TransactionService transactionService;
    private final WalletRepository walletRepository;


    @Override
    @GetMapping("/test-auth")
    public ResponseEntity<String> testAuth() {
        UUID userId = extractUserId();
        return ResponseEntity.ok("✅ Autenticado! User ID: " + userId);
    }

    @Override
    @GetMapping("/my-wallet")
    public ResponseEntity<BalanceResponseDTO> getMyWallet() {
        UUID userId = extractUserId();
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carteira não encontrada para o usuário."));
        return ResponseEntity.ok(new BalanceResponseDTO(wallet.getBalance(), wallet.getId()));
    }

    @Override
    @GetMapping("/balance")
    public ResponseEntity<BalanceResponseDTO> getBalance() {
        UUID userId = extractUserId();
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carteira não encontrada para o usuário."));
        return ResponseEntity.ok(new BalanceResponseDTO(wallet.getBalance(), wallet.getId()));
    }

    @Override
    @GetMapping("/history")
    public ResponseEntity<List<TransactionHistoryDTO>> getHistory() {
        UUID userId = extractUserId();
        List<TransactionHistoryDTO> history = transactionService.getHistory(userId);
        return ResponseEntity.ok(history);
    }

    @Override
    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponseDTO> deposit(@RequestBody @Valid DepositRequestDTO dto) {
        UUID userId = extractUserId();
        TransactionResponseDTO response = transactionService.deposit(userId, dto.amount());
        return ResponseEntity.ok(response);
    }

    @Override
    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponseDTO> withdraw(@RequestBody @Valid WithdrawRequestDTO dto) {
        UUID userId = extractUserId();
        TransactionResponseDTO response = transactionService.withdraw(userId, dto.amount());
        return ResponseEntity.ok(response);
    }

    @Override
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponseDTO> transfer(@RequestBody @Valid TransferRequestDTO dto) {
        UUID sourceUserId = extractUserId();
        TransactionResponseDTO response = transactionService.transfer(sourceUserId, dto.destinationWalletId(),
                dto.amount());
        return ResponseEntity.ok(response);
    }

    private UUID extractUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("Usuário não autenticado.");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserEntity)) {
            throw new SecurityException("Usuário não autenticado ou tipo de principal inválido.");
        }

        UserEntity user = (UserEntity) principal;
        if (user.getId() == null) {
            throw new SecurityException("Usuário não identificado no contexto da requisição.");
        }

        return user.getId();
    }
}