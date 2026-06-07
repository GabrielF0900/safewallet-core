package br.com.safewallet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
@SpringBootApplication
@OpenAPIDefinition(
	info = @Info(
		title = "Safewallet API",
		description = "API para o Safewallet, um aplicativo de gerenciamento de senhas e informações sensíveis.",	
		version = "1.0"
	)
)
public class SafewalletApplication {

	public static void main(String[] args) {
		SpringApplication.run(SafewalletApplication.class, args);
	}

}
