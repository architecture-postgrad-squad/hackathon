# Pós Tech Software Architecture - Hackathon

### Alunos

- Débora Silveira - RM353919
- Eduardo Petri - RM353438
- Fernanda Serra - RM353224

### Problema

Desenvolvimento de uma aplicação para processamento de vídeos, a partir de um vídeo deve-se retornar as imagens dele em um arquivo de extensão zip.

#### Requisitos

- Sistema deve ser capaz de processar vídeos simultaneamente;
- Sistema não deve perder requisições;
- Sistema deve ser protegido por usuário e senha;
- Sistema deve dispôr de uma listagem com status dos processamentos em fila/executados por usuário;
- Sistema deve enviar notificação para usuário em caso de erro;
- Sistema deve dispôr de uma arquitetura escalável.

### Solução

Esse repositório contém a implementação completa da solução apresentada para o hackathon. A solução conta com isolamento do código fonte da infraestrutura, dependências foram separadas por repositórios para evitar o padrão monorepo e aumentar a simplificada para a ativação das pipelines implementadas.

O código fonte foi desenvolvido em TBD, o banco de dados TBD e os testes unitários foram implementados com o framework TBD. Nossa solução em nuvem foi desenvolvida com a stack da Amazon Web Services (AWS) - EKS para gerenciar containers, API Gateway para mapear os serviços, RDS para gerenciar o banco de dados relacional da nossa aplicação, Cognito para autenticação e Lambda Serverless Function para o processamento dos vídeos.

#### Arquitetura

#### Serviços:

- **Webhook**: serviço destinado a receber notificações, enviadas pela API do mercado pago, sobre andamento/status do pagamento referente a compra realizada no back-end;
- **Back-end Base**: serviço destinado ao gerenciamento de cliente e produtos.
- **Pedidos**: Responsável pela gestão e operacionalização de pedidos (visão do cliente).
- **Pagamentos**: Responsável pela operacionalização e gestão de cobranças.
- **Produção**: Responsável pela fila de produção dos pedidos (visão da cozinha).

#### Infraestrutura:

Cada serviço dispõe de sua própria infraestrutura, configurada com Terraform e implantada em EKS (Elastic Kubernetes Service), mantendo o padrão de gerenciamento por Kubernetes. Cada microsserviço conta com seu próprio cluster e repositório dedicado.
Pipeline de CI/CD: Implementado com GitHub Actions, assegurando:

- Validação de builds.
- Qualidade de código com cobertura mínima de 70%.
- Deploy automatizado em produção para cada serviço no merge para a branch principal.

O processo de autenticação é feito com os serviços cognito e Lambda function da AWS. Ao receber uma requisição de autenticação, o API Gateway irá direcioná-lo para a função serverless da lambda (**auth-func**).

A lambda function por sua vez deve solicitar do Cognito um access token criado para os campos de login enviados, no nosso caso será apenas o cpf. O Access token dispõe de um contexto, o qual limita acesso às APIs dispostas na infraestrutura.

### Requisitos

- [Kubernetes](https://kubernetes.io/releases/download/);
- [Docker](https://docs.docker.com/get-docker/);
- [Git](https://git-scm.com/downloads);
- [AWS CLI](https://aws.amazon.com/cli/);
- [Terraform](https://developer.hashicorp.com/terraform/install).
