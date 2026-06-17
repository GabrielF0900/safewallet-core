# ==========================================
# 1. CAPTURA DE INFRAESTRUTURA EXISTENTE (ALB)
# ==========================================

data "aws_lb" "backend_alb" {
  arn = "arn:aws:elasticloadbalancing:us-east-1:430597289699:loadbalancer/app/safewallet-alb/d9917a8a77026b17"
}

# ==========================================
# 2. BUCKET S3
# ==========================================

resource "aws_s3_bucket" "frontend" {
  bucket = "safewallet-frontend-static-prod" 
  
  tags = {
    Name        = "safewallet-frontend"
    Environment = "Production"
  }
}

resource "aws_s3_bucket_versioning" "frontend_versioning" {
  bucket = aws_s3_bucket.frontend.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "frontend_encryption" {
  bucket = aws_s3_bucket.frontend.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_block" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ==========================================
# 3. ORIGIN ACCESS CONTROL
# ==========================================

resource "aws_cloudfront_origin_access_control" "frontend_oac" {
  name                              = "safewallet-frontend-oac"
  description                       = "OAC para blindar o Bucket do SafeWallet"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ==========================================
# 4. DISTRIBUIÇÃO CLOUDFRONT
# ==========================================

resource "aws_cloudfront_distribution" "frontend_distribution" {
  
  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.frontend.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend_oac.id
  }

  origin {
    domain_name = data.aws_lb.backend_alb.dns_name 
    origin_id   = "Custom-Spring-Backend"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "http-only"
      origin_ssl_protocols     = ["TLSv1.2"]
    }
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
    cache_policy_id  = "658327ea-f89d-4fab-a63d-7e88639e58f6" 
    viewer_protocol_policy = "redirect-to-https"
  }

  # 💡 CORREÇÃO: Uso de 'forwarded_values' para evitar erros de Policy ID inexistente
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "Custom-Spring-Backend" 

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Content-Type", "Accept"]
      cookies {
        forward = "all"
      }
    }
    
    min_ttl                = 0
    default_ttl            = 0
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
}

# ==========================================
# 5. S3 BUCKET POLICY
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
      variable = "aws:SourceArn" 
      values   = [aws_cloudfront_distribution.frontend_distribution.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend_policy_attachment" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend_policy.json
}