# ==========================================
# 6. ELASTIC CONTAINER REGISTRY (ECR)
# ==========================================

resource "aws_ecr_repository" "backend" {
  name                 = "safewallet-backend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true # 🛡️ Força a remoção de todas as imagens Docker internas

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "safewallet-ecr"
  }
}

# ==========================================
# 7. OUTPUTS (Retorno no Terminal)
# ==========================================

output "ecr_repository_url" {
  description = "A URL do seu repositorio ECR para usar no Docker push"
  value       = aws_ecr_repository.backend.repository_url
}