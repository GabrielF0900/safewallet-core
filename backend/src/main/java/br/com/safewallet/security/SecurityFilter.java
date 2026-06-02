package br.com.safewallet.security;

import br.com.safewallet.entity.UserEntity;
import br.com.safewallet.repositories.UserRepository;
import br.com.safewallet.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserRepository userRepository;

    public SecurityFilter(TokenService tokenService, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Extrai o cabeçalho Authorization da requisição HTTP
        String authorizationHeader = request.getHeader("Authorization");
        System.out.println("🔐 [SecurityFilter] Authorization header: " + authorizationHeader);

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Remove a palavra "Bearer " (7 caracteres) para isolar a string pura do JWT
            String token = authorizationHeader.substring(7);
            System.out.println(
                    "🔐 [SecurityFilter] Token extraído: " + token.substring(0, Math.min(20, token.length())) + "...");

            try {
                // 2. Valida o token e recupera o ID do usuário (enviado como String no Subject)
                String userId = tokenService.validateToken(token);
                System.out.println("🔐 [SecurityFilter] UserId do token: " + userId);

                if (userId != null) {
                    // 3. Converte a String de volta para UUID e busca no PostgreSQL
                    var userOptional = userRepository.findById(UUID.fromString(userId));
                    System.out.println("🔐 [SecurityFilter] Usuário encontrado: " + userOptional.isPresent());

                    if (userOptional.isPresent()) {
                        UserEntity user = userOptional.get();

                        // 4. Cria o contrato oficial de autenticação aceito pelo Spring Security
                        var authentication = new UsernamePasswordAuthenticationToken(user, null,
                                Collections.emptyList());

                        // 5. Injeta o usuário autenticado no contexto da requisição atual
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out
                                .println("✅ [SecurityFilter] Autenticação setada com sucesso para: " + user.getName());
                    }
                }
            } catch (Exception e) {
                // Caso o token esteja corrompido ou ocorra falha física, corta a requisição com
                // 401 Unauthorized
                System.out.println("❌ [SecurityFilter] Erro ao validar token: " + e.getMessage());
                SecurityContextHolder.clearContext();
            }
        } else {
            System.out.println("⚠️ [SecurityFilter] Nenhum token Bearer fornecido");
        }

        // 6. Passa o bastão para o próximo filtro da eclusa do Spring
        filterChain.doFilter(request, response);
    }
}