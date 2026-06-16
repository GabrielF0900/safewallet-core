# ==========================================
# 1. ZONA DNS (Route 53)
# ==========================================

# Cria (ou importa) a zona de hospedagem do seu domínio no Route 53
# Representa o custo fixo de USD 0,50 mensal mapeado na sua arquitetura
resource "aws_route53_zone" "main" {
  name = "gabrielfalcaodacruz.tech" # Substitua pelo domínio real que você for utilizar
  
  tags = {
    Name = "safewallet-dns-zone"
  }
}

# ==========================================
# 2. APONTAMENTO PARA O FRONTEND (CloudFront)
# ==========================================

# Cria o registro do tipo 'A' (Alias) apontando a raiz do domínio para a CDN
resource "aws_route53_record" "frontend_alias" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "app.gabrielfalcaodacruz.tech" # Ex: Subdomínio da aplicação
  type    = "A"

  alias {
    # Referência direta à distribuição CloudFront criada no arquivo cloudfront_s3.tf
    name                   = aws_cloudfront_distribution.frontend_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.frontend_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# ==========================================
# 3. APONTAMENTO PARA O BACKEND (Opcional - Para a API)
# ==========================================

# Se você quiser que o frontend chame a API via um subdomínio bonito (ex: api.gabrielfalcaodacruz.tech) 
# em vez da URL feia gerada pelo ALB.
resource "aws_route53_record" "api_alias" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.gabrielfalcaodacruz.tech"
  type    = "A"

  alias {
    # Referência direta ao Application Load Balancer criado no arquivo ecs.tf
    name                   = aws_lb.alb.dns_name
    zone_id                = aws_lb.alb.zone_id
    evaluate_target_health = true
  }
}