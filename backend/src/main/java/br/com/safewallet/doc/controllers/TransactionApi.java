package br.com.safewallet.doc.controllers;

//FAMILIA DO OPENAPI, PARA DOCUMENTAÇÃO DE API COM SWAGGER
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

//FAMILIA DO SPRING WEB, PARA DOCUMENTAÇÃO DE API COM SWAGGER
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;


//FAMILIA DE DADOS ONDE VAMOS IMPORTAR OS DTOS.
import br.com.safewallet.dto.DepositRequestDTO;
import br.com.safewallet.dto.TransactionHistoryDTO;
import br.com.safewallet.dto.TransactionResponseDTO;
import br.com.safewallet.dto.WithdrawRequestDTO;
import br.com.safewallet.dto.TransferRequestDTO;
import br.com.safewallet.dto.BalanceResponseDTO;

//IMPORTANDO O JAVA UTIL LIST PARA USAR COMO RETORNO DE LISTA DE TRANSAÇÕES
import java.util.List;

@Tag(name = "Módulo de Transações", description = "Endpoints relacionados a transações financeiras, incluindo depósitos, saques, transferências e consulta de saldo.")
public interface TransactionApi {

    @Operation(summary = "Realizar um depósito", description = "Permite que o usuário deposite um valor em sua conta.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Depósito realizado com sucesso."),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: valor negativo).", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "401", description = "Não autorizado (usuário não autenticado).", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor.", content = @Content(mediaType = "application/json"))
    })
    ResponseEntity<TransactionResponseDTO> deposit(@RequestBody DepositRequestDTO depositRequestDTO);

    @Operation(summary = "Realizar um saque", description = "Permite que o usuário saque um valor de sua conta.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Saque realizado com sucesso."),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: valor negativo ou saldo insuficiente).", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "401", description = "Não autorizado (usuário não autenticado).", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor.", content = @Content(mediaType = "application/json"))
    })
    ResponseEntity<TransactionResponseDTO> withdraw(@RequestBody WithdrawRequestDTO withdrawRequestDTO);

    @Operation(summary = "Realizar uma transferência", description = "Permite que o usuário transfira um valor para outra conta.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transferência realizada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: valor negativo, saldo insuficiente ou conta destinatária inexistente).", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "401", description = "Não autorizado (usuário não autenticado).", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor.", content = @Content(mediaType = "application/json"))
    })
    ResponseEntity<TransactionResponseDTO> transfer(@RequestBody TransferRequestDTO transferRequestDTO);

    @Operation(summary = "Consultar saldo", description = "Permite que o usuário consulte o saldo de sua conta.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Saldo consultado com sucesso."),
            @ApiResponse(responseCode = "401", description = "Não autorizado (usuário não autenticado).", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor.", content = @Content(mediaType = "application/json"))
    })
    ResponseEntity<BalanceResponseDTO> getBalance();

    ResponseEntity<String> testAuth();

	ResponseEntity<BalanceResponseDTO> getMyWallet();

    ResponseEntity<List<TransactionHistoryDTO>> getHistory();
}
