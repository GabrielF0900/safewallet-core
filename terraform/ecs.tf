# ==========================================
# 1. CLUSTER ECS
# ==========================================

resource "aws_ecs_cluster" "main" {
  name = "safewallet-cluster"

  tags = {
    Name = "safewallet-cluster"
  }
}

# ==========================================
# 2. APPLICATION LOAD BALANCER (ALB) E ROTEAMENTO
# ==========================================

resource "aws_lb" "alb" {
  name               = "safewallet-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id] # Referência que criaremos no security.tf
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id] # ALB fica na rede pública

  tags = {
    Name = "safewallet-alb"
  }
}

resource "aws_lb_target_group" "api_tg" {
  name        = "safewallet-api-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.safewallet.id
  target_type = "ip" # Obrigatório para ECS Fargate (modo awsvpc)

  # Health Check - Como o ALB sabe se o Spring Boot está vivo
  health_check {
    path                = "/actuator/health" # Endpoint padrão do Spring Boot Actuator
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api_tg.arn
  }
}

# ==========================================
# 3. CLOUDWATCH LOGS (Observabilidade)
# ==========================================

resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/safewallet-api"
  retention_in_days = 7 # Guarda os logs por 7 dias para evitar custos infinitos
}

# ==========================================
# 4. TASK DEFINITION (O Container Spring Boot)
# ==========================================

resource "aws_ecs_task_definition" "api" {
  family                   = "safewallet-api-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"  # 0.5 vCPU (Conforme seu blueprint financeiro)
  memory                   = "1024" # 1 GB RAM (Conforme seu blueprint financeiro)

  execution_role_arn = aws_iam_role.ecs_execution_role.arn # Referência para o security.tf
  task_role_arn      = aws_iam_role.ecs_task_role.arn      # Referência para o security.tf

  container_definitions = jsonencode([
    {
      name      = "safewallet-backend"
      image     = "nginx:latest" # PLACEHOLDER: Substituiremos pela URI do seu ECR quando você fizer o build do Java
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
      environment = [
        {
          name  = "SPRING_PROFILES_ACTIVE"
          value = "prod"
        }
      ]
    }
  ])
}

# ==========================================
# 5. ECS SERVICE (Orquestração e Alta Disponibilidade)
# ==========================================

resource "aws_ecs_service" "api_service" {
  name            = "safewallet-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 2 # Alta Disponibilidade: 1 task na AZ-A e 1 task na AZ-B
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.private_app_a.id, aws_subnet.private_app_b.id] # Deploy estrito nas subnets privadas
    security_groups  = [aws_security_group.ecs_sg.id] # Referência para o security.tf
    assign_public_ip = false # Segurança: Fargate NÃO terá IP público
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api_tg.arn
    container_name   = "safewallet-backend"
    containerPort    = 8080
  }

  # Espera o Listener do Load Balancer nascer antes de criar o serviço
  depends_on = [aws_lb_listener.http]
}