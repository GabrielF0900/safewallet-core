package br.com.safewallet.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import br.com.safewallet.repositories.UserRepository;
import br.com.safewallet.repositories.WalletRepository;
import br.com.safewallet.dto.UserRequestDTO;
import br.com.safewallet.dto.UserResponseDTO;
import br.com.safewallet.entity.UserEntity;
import br.com.safewallet.entity.WalletEntity;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CreateUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WalletRepository walletRepository;

    @Transactional // Garante a propriedade ACID: Se a carteira falhar, o banco aplica rollback no
                   // usuário
    public UserResponseDTO execute(UserRequestDTO dto) {
        // Intercepção preventiva de duplicidade de e-mail[cite: 3, 6]
        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email já registrado");
        }

        UserEntity userEntity = new UserEntity(dto);
        userEntity.setName(dto.name());
        userEntity.setEmail(dto.email());
        userEntity.setPassword(passwordEncoder.encode(dto.password())); // Processamento do hash seguro

        // Salva o usuário primeiro para gerar o UUID gerado pelo banco de dados
        UserEntity savedUser = userRepository.save(userEntity);

        // Vínculo automático: Cria e persiste a carteira zerada vinculada ao novo
        // usuário
        WalletEntity wallet = WalletEntity.builder()
                .userId(savedUser.getId())
                .balance(BigDecimal.ZERO) // Inicializa a conta sem saldo
                .build();

        walletRepository.save(wallet);

        return new UserResponseDTO(savedUser.getId(), savedUser.getName(), savedUser.getEmail());
    }
}