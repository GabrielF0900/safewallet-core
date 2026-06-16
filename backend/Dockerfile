# ==========================================
# ESTÁGIO 1: BUILD (Compilação do Código)
# ==========================================
# Utilizamos a imagem do Maven com Amazon Corretto (Distribuição oficial da AWS)
FROM maven:3.9-amazoncorretto-17 AS builder
WORKDIR /app

# Passo estratégico: Copiar apenas o pom.xml primeiro.
# Isso cria um cache das dependências da internet. Se você não mudar o pom.xml, 
# o Docker não baixa a internet inteira de novo no próximo build.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia o código-fonte e empacota o .jar (ignorando os testes, que devem rodar na esteira de CI/CD)
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# ESTÁGIO 2: RUNTIME (Imagem final de Produção)
# ==========================================
# Imagem Alpine: Versão minimalista e blindada do Linux, pesando apenas ~5MB.
FROM amazoncorretto:17-alpine
WORKDIR /app

# SEGURANÇA (Zero Trust): Criação de um usuário não-root.
# Se um hacker invadir o container, ele não terá privilégios de administrador no Linux base.
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copia o arquivo .jar compilado do Estágio 1 (descartando o Maven e os arquivos .java)
COPY --from=builder /app/target/*.jar app.jar

# Expõe a porta que o ALB e o ECS vão utilizar para se comunicar
EXPOSE 8080

# PONTO DE ENTRADA (Otimizado para AWS Fargate)
# -XX:+UseContainerSupport: Diz ao Java que ele está num container e deve respeitar os limites.
# -XX:MaxRAMPercentage=75.0: Diz ao Java para usar no máximo 75% da RAM do Fargate (768MB do 1GB total), deixando 25% livre para o sistema operacional não travar.
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]