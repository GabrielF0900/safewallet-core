# ==========================================
# 1. VPC PRINCIPAL
# ==========================================

resource "aws_vpc" "safewallet" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "safewallet-vpc"
  }
}

# ==========================================
# 2. INTERNET GATEWAY (Porta para a internet pública)
# ==========================================

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.safewallet.id

  tags = {
    Name = "safewallet-igw"
  }
}

# ==========================================
# 3. SUBNETS PÚBLICAS (Onde ficam o Load Balancer e o NAT)
# ==========================================

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.safewallet.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "safewallet-public-1a"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.safewallet.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "safewallet-public-1b"
  }
}

# ==========================================
# 4. SUBNETS PRIVADAS DE APLICAÇÃO (Onde roda o ECS Fargate)
# ==========================================

resource "aws_subnet" "private_app_a" {
  vpc_id            = aws_vpc.safewallet.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "safewallet-private-app-1a"
  }
}

resource "aws_subnet" "private_app_b" {
  vpc_id            = aws_vpc.safewallet.id
  cidr_block        = "10.0.12.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "safewallet-private-app-1b"
  }
}

# ==========================================
# 5. SUBNETS PRIVADAS DE DADOS (100% Isolado para o Amazon RDS)
# ==========================================

resource "aws_subnet" "private_data_a" {
  vpc_id            = aws_vpc.safewallet.id
  cidr_block        = "10.0.21.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "safewallet-private-data-1a"
  }
}

resource "aws_subnet" "private_data_b" {
  vpc_id            = aws_vpc.safewallet.id
  cidr_block        = "10.0.22.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "safewallet-private-data-1b"
  }
}

# ==========================================
# 6. NAT GATEWAY (Saída de internet otimizada)
# ==========================================

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "safewallet-nat-eip"
  }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_a.id

  tags = {
    Name = "safewallet-nat-gateway"
  }

  depends_on = [aws_internet_gateway.igw]
}

# ==========================================
# 7. TABELAS DE ROTEAMENTO E ASSOCIAÇÕES
# ==========================================

# A. Tabela Pública: Manda todo o tráfego não local para a rua (IGW)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.safewallet.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  # A AWS cria uma rota 'local' padrão (10.0.0.0/16 -> local) invisível aqui.

  tags = {
    Name = "safewallet-public-rt"
  }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

# B. Tabela Privada de Aplicação: Manda toda a saída externa para o NAT Gateway
resource "aws_route_table" "private_app" {
  vpc_id = aws_vpc.safewallet.id

  # ROTA CORRIGIDA: Todo tráfego destinado à internet vai para o NAT Gateway.
  # A rota 'local' implícita da AWS garantirá que o tráfego de retorno para o ALB (10.0.1.X) fique dentro da VPC.
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "safewallet-private-app-rt"
  }
}

resource "aws_route_table_association" "private_app_a" {
  subnet_id      = aws_subnet.private_app_a.id
  route_table_id = aws_route_table.private_app.id
}

resource "aws_route_table_association" "private_app_b" {
  subnet_id      = aws_subnet.private_app_b.id
  route_table_id = aws_route_table.private_app.id
}

# C. Tabela Privada de Dados: Sem rota para a internet. Isolamento total físico.
resource "aws_route_table" "isolated_data" {
  vpc_id = aws_vpc.safewallet.id

  # A rota 'local' implícita da AWS garantirá que o PostgreSQL consiga falar com o ECS Fargate.
  tags = {
    Name = "safewallet-isolated-data-rt"
  }
}

resource "aws_route_table_association" "data_a" {
  subnet_id      = aws_subnet.private_data_a.id
  route_table_id = aws_route_table.isolated_data.id
}

resource "aws_route_table_association" "data_b" {
  subnet_id      = aws_subnet.private_data_b.id
  route_table_id = aws_route_table.isolated_data.id
}