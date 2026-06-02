package br.com.safewallet.services;

import br.com.safewallet.entity.*;
import br.com.safewallet.repositories.*;
import br.com.safewallet.dto.TransactionResponseDTO;
import br.com.safewallet.dto.TransactionHistoryDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    @Transactional(readOnly = true)
    public List<TransactionHistoryDTO> getHistory(UUID userId) {
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carteira não encontrada para o usuário."));

        List<TransactionEntity> transactions = transactionRepository
                .findBySourceWalletIdOrDestinationWalletIdOrderByCreatedAtDesc(wallet.getId(), wallet.getId());

        return transactions.stream().map(tx -> {
            String type = tx.getType().name();
            if ("WITHDRAW".equals(type)) {
                type = "WITHDRAWAL";
            }
            return new TransactionHistoryDTO(
                    tx.getId(),
                    type,
                    tx.getAmount(),
                    BigDecimal.ZERO, // balanceAfter não é armazenado nativamente, mantendo 0 para compatibilidade
                    tx.getSourceWalletId(),
                    tx.getDestinationWalletId(),
                    tx.getCreatedAt());
        }).collect(Collectors.toList());
    }

    @Transactional
    public TransactionResponseDTO deposit(UUID userId, BigDecimal amount) {
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carteira não encontrada para o usuário."));

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        TransactionEntity tx = TransactionEntity.builder()
                .destinationWalletId(wallet.getId())
                .amount(amount)
                .type(TransactionType.DEPOSIT)
                .createdAt(LocalDateTime.now())
                .build();
        transactionRepository.save(tx);

        return new TransactionResponseDTO(
                "✅ Depósito realizado com sucesso!",
                "DEPOSIT",
                amount,
                wallet.getBalance());
    }

    @Transactional
    public TransactionResponseDTO withdraw(UUID userId, BigDecimal amount) {
        WalletEntity wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Carteira não encontrada para o usuário."));

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalStateException("Saldo insuficiente para realizar o saque.");
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        TransactionEntity tx = TransactionEntity.builder()
                .sourceWalletId(wallet.getId())
                .amount(amount)
                .type(TransactionType.WITHDRAW)
                .createdAt(LocalDateTime.now())
                .build();
        transactionRepository.save(tx);

        return new TransactionResponseDTO(
                "✅ Saque realizado com sucesso!",
                "WITHDRAW",
                amount,
                wallet.getBalance());
    }

    @Transactional
    public TransactionResponseDTO transfer(UUID sourceUserId, UUID destinationWalletId, BigDecimal amount) {
        WalletEntity sourceWallet = walletRepository.findByUserId(sourceUserId)
                .orElseThrow(() -> new IllegalArgumentException("Carteira de origem não encontrada."));

        if (sourceWallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalStateException("Saldo insuficiente para realizar a transferência.");
        }

        WalletEntity destinationWallet = walletRepository.findById(destinationWalletId)
                .orElseThrow(() -> new IllegalArgumentException("Carteira de destino não encontrada."));

        sourceWallet.setBalance(sourceWallet.getBalance().subtract(amount));
        destinationWallet.setBalance(destinationWallet.getBalance().add(amount));

        walletRepository.save(sourceWallet);
        walletRepository.save(destinationWallet);

        TransactionEntity tx = TransactionEntity.builder()
                .sourceWalletId(sourceWallet.getId())
                .destinationWalletId(destinationWallet.getId())
                .amount(amount)
                .type(TransactionType.TRANSFER)
                .createdAt(LocalDateTime.now())
                .build();
        transactionRepository.save(tx);

        return new TransactionResponseDTO(
                "✅ Transferência realizada com sucesso!",
                "TRANSFER",
                amount,
                sourceWallet.getBalance());
    }
}