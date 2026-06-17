# ========================================================================
# INFRAESTRUTURA DO FRONTEND - AMAZON S3 + AMAZON CLOUDFRONT (OAC)
# ========================================================================

# 1. Bucket S3 Privado para Armazenamento dos Arquivos Estáticos
resource "aws_s3_bucket" "frontend_bucket" {
  bucket        = "safewallet-frontend-static-430597289699" # Nome global único
  force_destroy = true

  tags = {
    Name = "safewallet-frontend-static"
  }
}

# 2. Bloqueio Absoluto de Acesso Público Direto ao S3
resource "aws_s3_bucket_public_access_block" "frontend_public_block" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 3. Configuração do Origin Access Control (OAC) do CloudFront
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "safewallet-frontend-oac-prod" # Nome alterado para evitar o conflito 409
  description                       = "Permite que apenas o CloudFront acesse o bucket S3 privado"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# 4. Distribuição do Amazon CloudFront (CDN com Multi-Origin Proxy)
resource "aws_cloudfront_distribution" "frontend_cdn" {
  
  # Origem 1: Arquivos Estáticos do Frontend (S3)
  origin {
    domain_name              = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
    origin_id                = "S3-SafeWalletFrontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  # Origem 2: API do Backend (Application Load Balancer)
  origin {
    domain_name = "safewallet-alb-1695226228.us-east-1.elb.amazonaws.com"
    origin_id   = "ALB-SafeWalletBackend"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only" # O ALB opera em HTTP puro por enquanto
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  # Tratamento para SPA/Next.js (Redireciona erros de rota do S3 para o index.html)
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  # COMPORTAMENTO PADRÃO: Tudo cai no S3 (Frontend)
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-SafeWalletFrontend"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # COMPORTAMENTO ADICIONAL (/api/*): Desvia dinamicamente para o Load Balancer
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "ALB-SafeWalletBackend"

    forwarded_values {
      query_string = true
      headers      = ["*"] # Repassa cabeçalhos vitais: Authorization, Content-Type, etc.
      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 0 # Desativa cache para chamadas de API
    max_ttl                = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "safewallet-frontend-cdn"
  }
}

# 5. Política do S3 permitindo a leitura estrita do CloudFront via OAC
resource "aws_s3_bucket_policy" "allow_cloudfront" {
  bucket = aws_s3_bucket.frontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipalReadOnly"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.frontend_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend_cdn.arn
          }
        }
      }
    ]
  })
}

# Output para exibir a URL final do sistema na tela do terminal
output "frontend_cloudfront_url" {
  value       = "https://${aws_cloudfront_distribution.frontend_cdn.domain_name}"
  description = "URL Global de Producao do Frontend do SafeWallet"
}