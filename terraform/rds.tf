# ==========================================
# 1. SUBNET GROUP (Isolamento de Dados)
# ==========================================

resource "aws_db_subnet_group" "data_subnets" {
  name       = "safewallet-db-subnet-group"
  subnet_ids = [aws_subnet.private_data_a.id, aws_subnet.private_data_b.id]

  tags = {
    Name = "safewallet-db-subnet-group"
  }
}

# ==========================================
# 2. GERAÇÃO DE SENHA E SECRETS MANAGER
# ==========================================

resource "random_password" "db_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "safewallet/prod/db-credentials"
  description = "Credenciais do banco de dados PostgreSQL do SafeWallet Core"
}

resource "aws_secretsmanager_secret_version" "db_credentials_version" {
  secret_id     = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = "safewalletadmin"
    password = random_password.db_password.result
    engine   = "postgres"
    host     = aws_db_instance.postgres.address
    port     = 5432
  })
}

# ==========================================
# 3. INSTÂNCIA RDS POSTGRESQL
# ==========================================

resource "aws_db_instance" "postgres" {
  identifier             = "safewallet-db"
  engine                 = "postgres"
  engine_version         = "15.4" 
  
  # LIMITES DO FREE TIER E STORAGE
  instance_class         = "db.t3.micro" 
  allocated_storage      = 20
  
  # CORREÇÃO 1: Remoção do max_allocated_storage. Omitir este campo é 
  # a maneira oficial da AWS de desativar o Storage Autoscaling.

  # CORREÇÃO 2: Compliance de Segurança Financeira (Criptografia de Disco KMS padrão AWS)
  storage_encrypted      = true 
  
  # CREDENCIAIS
  db_name                = "safewallet"
  username               = "safewalletadmin"
  password               = random_password.db_password.result
  
  # REDE E SEGURANÇA
  db_subnet_group_name   = aws_db_subnet_group.data_subnets.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id] 
  
  # TRADE-OFFS ARQUITETURAIS DOCUMENTADOS
  multi_az               = false 
  publicly_accessible    = false 
  
  # MANUTENÇÃO E CICLO DE VIDA
  backup_retention_period = 7 
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"
  skip_final_snapshot     = true 

  tags = {
    Name = "safewallet-rds"
  }
}