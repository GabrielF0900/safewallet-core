package br.com.safewallet.repositories;
import java.util.Optional;
import java.util.UUID;  
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.safewallet.entity.UserEntity;



@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    /**
     * RF-004: Busca um usuário pelo e-mail corporativo.
     * O Spring gerará automaticamente o SQL: SELECT * FROM tb_users WHERE email = ?
     */
    Optional<UserEntity> findByEmail(String email);

    /**
     * Método otimizado para validação de existência.
     * Retorna apenas true ou false na rede, consumindo menos memória do banco de dados.
     */
    boolean existsByEmail(String email);

    
}
