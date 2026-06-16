# ==========================================
# ELASTIC CONTAINER REGISTRY (ECR)
# ==========================================

resource "aws_ecr_repository" "backend" {
  name                 = "safewallet-backend"
  image_tag_mutability = "MUTABLE" # Permite sobrescrever a tag 'latest' durante os testes

  # Segurança: A AWS vai escanear sua imagem Docker em busca de vulnerabilidades (CVEs)
  # toda vez que você fizer um push.
  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "safewallet-ecr"
  }
} # <-- ATENÇÃO: Esta é a chave de fechamento do resource que estava faltando!

# ==========================================
# OUTPUTS (Retorno no Terminal)
# ==========================================

output "ecr_repository_url" {
  description = "A URL do seu repositorio ECR para usar no Docker push"
  value       = aws_ecr_repository.backend.repository_url
}