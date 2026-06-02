package br.com.safewallet.repositories;

import br.com.safewallet.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import br.com.safewallet.entity.TransactionType;    

public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {
    List<TransactionEntity> findBySourceWalletIdOrDestinationWalletIdOrderByCreatedAtDesc(UUID sourceId, UUID destId);
}