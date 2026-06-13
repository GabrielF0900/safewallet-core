package br.com.safewallet.CreateUserService;

import br.com.safewallet.dto.UserRequestDTO;
import br.com.safewallet.dto.UserResponseDTO;
import br.com.safewallet.entity.UserEntity;
import br.com.safewallet.repositories.UserRepository;
import br.com.safewallet.repositories.WalletRepository;
import br.com.safewallet.services.CreateUserService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;




//ESQUELETO PADRONIZADO PARA TESTE DE SOFTWARE.

    /*TODO TESTE DE SOFTWARE INDEPENDENTE DO NIVEL, DEVE SEGUIR ESSA ORDEM:
    
    1: DADO(GIVEN/ARRANGE): É A FASE DE PREPARAÇÃO DO TESTE. É ONDE COLOCAMOS AS VARIVEIS, OS DTOS, CONFIGURAMOS
    OS DADOS MOCKADOS E DEFINIMOS SEU COMPORTAMENTO.
    
    2:QUANDO(WHEN/ACT): É A PARTE DE EXECUÇÃO. É ONDE EXECUTMOS A LINHA DE CODIGO QUE CHAMA O SERVICE EXATO
    QUE QUEREMOS TESTAR. ENTAO, SE EU QUERO TESTAR O SERVICE DE CreateUserService ENTAO NESSA ETAPA EU VOU CHMAR
    O SERVICE CreateUserService QUE TEM O ALGORITMO.
    
    3: ENTÃO(THEN/ASSERT): É A PARTE ONDE VERIFICMOS SE O RESULTADO É ESPERADO OU NAO.*/


@ExtendWith(MockitoExtension.class)
public class CreateUserServiceTest {
    
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private WalletRepository walletRepository;

    @InjectMocks
    private CreateUserService createUserService;

    @Test
    public void testCreateUserSucess(){
        //DADO
        UserRequestDTO userRequestDTO = new UserRequestDTO(
        "Gabriel Falcao", 
        "Gabrielcfonline0900@gmail.com",
        "10668889730"); //CRIANDO UMA INSTANCIA DO DTO E INICIALIZANDO COM DADOS MOCKADOS.

        UserEntity userSalvo = new UserEntity(userRequestDTO);
        userSalvo.setId(UUID.randomUUID());
        userSalvo.setPassword("10668889730");
        userSalvo.setEmail("Gabrielcfonline0900@gmail.com");
        userSalvo.setName("Gabriel Falcao");

        //ENSINANDO OS MOCKS COMO SE COMPORTAR
        when(passwordEncoder.encode(userRequestDTO.password())).thenReturn("10668889730");
        when(userRepository.save(any(UserEntity.class))).thenReturn(userSalvo);

        //QUANDO (EXECUÇÃO DE AÇÃO PRINCIPAL)
        UserResponseDTO response = createUserService.execute(userRequestDTO);


        //ENTAO (THEN/ASSERT) - Auditoria dos resultados.
        assertNotNull(response, "A resposta nao deveria ser nula");
        assertNotNull(response.id(), "O ID do usuario criado nao deveria ser nulo");
        assertEquals(userRequestDTO.name(), response.name(), "O nome retornado não bate com o esperado");
        assertEquals(userRequestDTO.email(), response.email(), "O email retornado não bate com o esperado");
    }
}
