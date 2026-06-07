package br.com.safewallet.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;    
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final SecurityFilter securityFilter;
    private static final String[] SWAGGER_LIST = {
        "/swagger-ui/**", //TUDO QUE VIER DEPOIS DE SWAGGER-UI VAI SER LIBERADO
        "/v3/api-docs/**", //TUDO QUE VIER DEPOIS DE V3/API-DOCS VAI SER LIBERADO
        "/swagger-resources/**", // LIBERAÇÃO PARA O SWAGGER RESOURCES, QUE É O QUE CARREGA OS CSS E JS DO SWAGGER UI   
    };

    // Injeta o guarda perimetral que você desenvolveu
    public SecurityConfig(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http .csrf(csrf -> csrf.disable())
                    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .requestMatchers(SWAGGER_LIST).permitAll() // 🟢 LIBERA O SWAGGER UI
                        .requestMatchers("/error").permitAll() // 🟢 LIBERA A ROTA DE ERRO PRO HANDLER FUNCIONAR
                        .anyRequest().authenticated()
                    )
                    // 🟢 ATIVA O SEU LEITOR DE CRACHÁS NA LINHA DE FRENTE
                    .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                    .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}