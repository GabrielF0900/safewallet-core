package br.com.safewallet.services;
import org.springframework.stereotype.Service;
import br.com.safewallet.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import br.com.safewallet.dto.UserRequestDTO;
import br.com.safewallet.dto.UserResponseDTO;
import br.com.safewallet.entity.UserEntity;
@Service
public class CreateUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CreateUserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

        public UserResponseDTO execute(UserRequestDTO dto) {
            if(userRepository.existsByEmail(dto .email())) {
                throw new IllegalArgumentException("Email já registrado");
            }


            UserEntity userEntity = new UserEntity(dto);
            userEntity.setName(dto.name());
            userEntity.setEmail(dto.email());
            userEntity.setPassword(passwordEncoder.encode(dto.password()));

            String newPassword = passwordEncoder.encode(dto.password());
            userEntity.setPassword(newPassword);

            userRepository.save(userEntity);

            return new UserResponseDTO(userEntity.getId(), userEntity.getName(), userEntity.getEmail());
    }

    

}
