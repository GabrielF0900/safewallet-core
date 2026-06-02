package br.com.safewallet.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import br.com.safewallet.entity.UserEntity;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import java.util.Date;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secretKey;

    public String generateToken(UserEntity user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            return JWT.create()
                    .withSubject(user.getId().toString())
                    .withClaim("email", user.getEmail())
                    .withClaim("name", user.getName())
                    .withExpiresAt(new Date(System.currentTimeMillis() + 3600000)) // Token válido por 1 hora
                    .sign(algorithm);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar token JWT", e);
        }

    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            return JWT.require(algorithm)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (Exception e) {
            System.out.println("❌ [TokenService] Erro ao validar token: " + e.getMessage());
            return null;
        }
    }

}
