package br.com.safewallet.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.safewallet.dto.LoginRequestDTO;
import br.com.safewallet.entity.UserEntity;
import br.com.safewallet.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import javax.naming.AuthenticationException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserEntity execute(LoginRequestDTO LoginRequestDTO) throws AuthenticationException {
        UserEntity userEntity = userRepository.findByEmail(LoginRequestDTO.email())
                .orElseThrow(() -> new AuthenticationException("E-mail ou senha incorretos."));


        if (!passwordEncoder.matches(LoginRequestDTO.password(), userEntity.getPassword())) {
            throw new AuthenticationException("E-mail ou senha incorretos.");
        }
        return userEntity;
    }

}
