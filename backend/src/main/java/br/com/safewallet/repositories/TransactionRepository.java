package br.com.safewallet.repositories;

import br.com.safewallet.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import br.com.safewallet.entity.TransactionType;    

public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {
    // Herdando o CRUD padrão do JpaRepository
}