package br.com.safewallet.entity;

import br.com.safewallet.dto.UserRequestDTO;    
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "tb_users")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // Exigido pelo JPA/Hibernate para reflexão
@AllArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Estratégia nativa e resiliente de UUID
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 100) // Restrição física de e-mail único
    private String email;

    @Column(nullable = false)
    private String password;

    // Construtor semântico: Converte o contrato de entrada na entidade física
    public UserEntity(UserRequestDTO dto) {
        this.name = dto.name();
        this.email = dto.email();
        this.password = dto.password(); // Nota: No próximo vertical slice injetaremos a criptografia aqui
    }
}