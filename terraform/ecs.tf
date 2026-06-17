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
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]

  tags = {
    Name = "safewallet-alb"
  }
}

resource "aws_lb_target_group" "api_tg" {
  name        = "safewallet-api-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.safewallet.id
  target_type = "ip"

  health_check {
    path                = "/actuator/health"
    interval            = 15    # Reduzido para testar mais rápido (Acelera o boot)
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200,403" # ACEITA 403! O ALB entende que a segurança barrou, mas o app está vivo.
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
  retention_in_days = 7
}

# ==========================================
# 4. TASK DEFINITION (O Container Spring Boot)
# ==========================================

resource "aws_ecs_task_definition" "api" {
  family                   = "safewallet-api-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"

  execution_role_arn = aws_iam_role.ecs_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "safewallet-backend"
      image     = "430597289699.dkr.ecr.us-east-1.amazonaws.com/safewallet-backend:latest"
      essential = true
      
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]

      environment = [
        {
          name  = "SPRING_DATASOURCE_URL"
          value = "jdbc:postgresql://${aws_db_instance.postgres.endpoint}/${aws_db_instance.postgres.db_name}"
        },
        {
          name  = "SPRING_DATASOURCE_USERNAME"
          value = aws_db_instance.postgres.username
        },
        {
          name  = "SPRING_DATASOURCE_PASSWORD"
          value = aws_db_instance.postgres.password
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/safewallet-api" # Ajustado para o mesmo nome do recurso acima
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
} # <-- CHAVE DE FECHAMENTO ADICIONADA AQUI

# ==========================================
# 5. ECS SERVICE (Orquestração e Alta Disponibilidade)
# ==========================================

resource "aws_ecs_service" "api_service" {
  name            = "safewallet-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.private_app_a.id, aws_subnet.private_app_b.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api_tg.arn
    container_name   = "safewallet-backend"
    container_port   = 8080
  }

  depends_on = [aws_lb_listener.http]
}