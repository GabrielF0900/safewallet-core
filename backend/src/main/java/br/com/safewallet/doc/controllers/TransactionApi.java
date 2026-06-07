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
import br.com.safewallet.dto.ApiErrorMessage;
import io.swagger.v3.oas.annotations.media.Schema;
@Tag(name = "Módulo de Transações", description = "Endpoints relacionados a transações financeiras, incluindo depósitos, saques, transferências e consulta de saldo.")
public interface TransactionApi {

    @Operation(summary = "Realizar um depósito", description = "Permite que o usuário deposite um valor em sua conta.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Depósito realizado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = TransactionResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: valor negativo).", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class))),
            @ApiResponse(responseCode = "401", description = "Não autorizado (usuário não autenticado).", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class)))
    })
    ResponseEntity<TransactionResponseDTO> deposit(@RequestBody DepositRequestDTO depositRequestDTO);

    @Operation(summary = "Realizar um saque", description = "Permite que o usuário saque um valor de sua conta.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Saque realizado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = TransactionResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: valor negativo ou saldo insuficiente).", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class))),
            @ApiResponse(responseCode = "401", description = "Não autorizado (usuário não autenticado).", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class)))
    })
    ResponseEntity<TransactionResponseDTO> withdraw(@RequestBody WithdrawRequestDTO withdrawRequestDTO);

    @Operation(summary = "Realizar uma transferência", description = "Permite que o usuário transfira um valor para outra conta.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transferência realizada com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = TransactionResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: valor negativo, saldo insuficiente ou conta destinatária inexistente).", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class))),
            @ApiResponse(responseCode = "401", description = "Não autorizado (usuário não autenticado).", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class)))
    })
    ResponseEntity<TransactionResponseDTO> transfer(@RequestBody TransferRequestDTO transferRequestDTO);

    @Operation(summary = "Consultar saldo", description = "Permite que o usuário consulte o saldo de sua conta.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Saldo consultado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BalanceResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Não autorizado (usuário não autenticado).", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno no servidor.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class)))
    })
    ResponseEntity<BalanceResponseDTO> getBalance();

    @Operation(summary = "Testar autenticação das rotas", description = "Endpoint de telemetria interna para validar a integridade do Token JWT no contexto financeiro.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Filtro de segurança validado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Token ausente, inválido ou expirado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class)))
    })
    ResponseEntity<String> testAuth();

    @Operation(summary = "Obter dados consolidados da carteira", description = "Retorna o estado atual da Wallet do usuário autenticado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dados da carteira carregados.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BalanceResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class))),
            @ApiResponse(responseCode = "500", description = "Erro ao buscar registros da carteira.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class)))
    })
    ResponseEntity<BalanceResponseDTO> getMyWallet();

    @Operation(summary = "Consultar extrato de transações", description = "Retorna o histórico completo e cronológico de movimentações de débito e crédito.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Extrato gerado com sucesso.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = TransactionHistoryDTO.class))),
            @ApiResponse(responseCode = "401", description = "Acesso perimetral negado.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class))),
            @ApiResponse(responseCode = "500", description = "Falha interna ao processar o histórico.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorMessage.class)))
    })
    ResponseEntity<List<TransactionHistoryDTO>> getHistory();
}