# ==========================================
# 1. CONFIGURAÇÃO DO TERRAFORM E PROVIDERS
# ==========================================

terraform {
  # Opcional, mas recomendado para o futuro: 
  # Configurar um backend S3 para guardar o estado do Terraform (terraform.tfstate) de forma remota.
  # backend "s3" {}

  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      # O til e o maior (~>) significa: aceite atualizações da versão 5.x (ex: 5.1, 5.2), 
      # mas NUNCA pule para a versão 6.0 automaticamente para não quebrar o código.
      version = "~> 5.0" 
    }
  }
}

# ==========================================
# 2. CONFIGURAÇÃO DA AWS (Credenciais e Região)
# ==========================================

provider "aws" {
  # Região definida no seu documento de arquitetura financeira (N. Virginia)
  region = "us-east-1"

  # Tags globais: Todos os recursos criados por este provider herdarão essas tags automaticamente
  default_tags {
    tags = {
      Project     = "SafeWallet Core"
      Environment = "Production"
      ManagedBy   = "Terraform"
    }
  }
}