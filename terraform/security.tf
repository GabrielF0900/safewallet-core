# ==========================================
# 1. SECURITY GROUPS (Firewall de Rede)
# ==========================================

# SG do Load Balancer (Público: Recebe tráfego da internet)
resource "aws_security_group" "alb_sg" {
  name        = "safewallet-alb-sg"
  description = "Permite trafego HTTP/HTTPS da internet para o ALB"
  vpc_id      = aws_vpc.safewallet.id # Declarado no vpc.tf

  ingress {
    description = "HTTP da Internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS da Internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Permite toda a saida"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "safewallet-alb-sg"
  }
}

# SG do ECS Fargate (Privado: Recebe tráfego APENAS do ALB)
resource "aws_security_group" "ecs_sg" {
  name        = "safewallet-ecs-sg"
  description = "Permite trafego APENAS vindo do ALB para a porta 8080"
  vpc_id      = aws_vpc.safewallet.id

  ingress {
    description     = "Trafego do Load Balancer"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id] # A Mágica do Zero Trust acontece aqui
  }

  egress {
    description = "Permite saida para a internet (via NAT Gateway)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "safewallet-ecs-sg"
  }
}

# SG do RDS PostgreSQL (Isolado: Recebe tráfego APENAS do ECS)
resource "aws_security_group" "rds_sg" {
  name        = "safewallet-rds-sg"
  description = "Permite conexao no PostgreSQL APENAS vinda do backend ECS"
  vpc_id      = aws_vpc.safewallet.id

  ingress {
    description     = "Conexao do backend Spring Boot"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_sg.id] # Acesso restrito ao container
  }

  # Banco de dados normalmente não inicia conexões para fora
  egress {
    description = "Permite saida para atualizacoes (gerenciado pela AWS)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "safewallet-rds-sg"
  }
}

# ==========================================
# 2. IAM ROLES (Identidade e Permissões do Container)
# ==========================================

# A. ROLE DE EXECUÇÃO (Para o agente do ECS baixar a imagem e ler o Secrets Manager)
resource "aws_iam_role" "ecs_execution_role" {
  name = "safewallet-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Anexa a política padrão da AWS para Execução de Tasks (CloudWatch Logs, ECR Pull)
resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Cria uma política customizada para o ECS ler a senha do RDS no Secrets Manager
resource "aws_iam_policy" "secrets_manager_policy" {
  name        = "safewallet-secrets-policy"
  description = "Permite que a task do ECS leia o segredo do RDS"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        # Referência ao segredo criado no arquivo rds.tf
        Resource = [aws_secretsmanager_secret.db_credentials.arn]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_secrets_policy_attachment" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.secrets_manager_policy.arn
}

# B. ROLE DA TASK (Para o seu código Spring Boot rodando dentro do container)
# Se o seu código Java precisar acessar um Bucket S3 no futuro, você anexa a permissão aqui!
resource "aws_iam_role" "ecs_task_role" {
  name = "safewallet-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}