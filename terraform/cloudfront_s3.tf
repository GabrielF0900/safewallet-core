# ==========================================
# 1. BUCKET S3 (Armazenamento Privado)
# ==========================================

resource "aws_s3_bucket" "frontend" {
  bucket = "safewallet-frontend-static-prod" # Lembrete: Alterar para um nome único globalmente
  
  tags = {
    Name        = "safewallet-frontend"
    Environment = "Production"
  }
}

# CORREÇÃO 1: Versionamento habilitado (Proteção contra deleções acidentais/Ransomware)
resource "aws_s3_bucket_versioning" "frontend_versioning" {
  bucket = aws_s3_bucket.frontend.id
  versioning_configuration {
    status = "Enabled"
  }
}

# CORREÇÃO 2: Criptografia em repouso habilitada por padrão (AES256 - Gratuito)
resource "aws_s3_bucket_server_side_encryption_configuration" "frontend_encryption" {
  bucket = aws_s3_bucket.frontend.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Bloqueio total de acesso público direto ao Bucket S3
resource "aws_s3_bucket_public_access_block" "frontend_block" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ==========================================
# 2. ORIGIN ACCESS CONTROL (Segurança de Borda)
# ==========================================

resource "aws_cloudfront_origin_access_control" "frontend_oac" {
  name                              = "safewallet-frontend-oac"
  description                       = "OAC para blindar o Bucket do SafeWallet"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ==========================================
# 3. DISTRIBUIÇÃO CLOUDFRONT (CDN Global)
# ==========================================

resource "aws_cloudfront_distribution" "frontend_distribution" {
  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.frontend.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend_oac.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.id}"

    # CORREÇÃO 3: Remoção do bloco depreciado (forwarded_values)
    # Uso da Policy Gerenciada pela AWS 'Managed-CachingOptimized'
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" 

    viewer_protocol_policy = "redirect-to-https"
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
    Name = "safewallet-cloudfront"
  }
}

# ==========================================
# 4. S3 BUCKET POLICY (Permissão Estrita)
# ==========================================

data "aws_iam_policy_document" "frontend_policy" {
  statement {
    sid       = "AllowCloudFrontServicePrincipal"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.frontend.arn}/*"]
    
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    
    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn" # CORREÇÃO 4: Case-sensitive rigoroso
      values   = [aws_cloudfront_distribution.frontend_distribution.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend_policy_attachment" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend_policy.json
}