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

Esse repositório contém a implementação completa da solução apresentada para o hackathon. A solução conta com isolamento do código fonte da infraestrutura, dependências foram separadas por repositórios para evitar o padrão monorepo e aumentar a simplicidade para a ativação das pipelines implementadas.

O código fonte da API foi desenvolvido em NestJs e os testes unitários foram implementados com o framework jest. Nossa solução em nuvem foi desenvolvida com a stack da Amazon Web Services (AWS) - [Elastic Kubernetes Service (EKS)](https://aws.amazon.com/pt/eks/), [API Gateway](https://aws.amazon.com/pt/api-gateway/), [DynamodDb](https://aws.amazon.com/pt/dynamodb/), [Simple Storage Service (S3)](https://aws.amazon.com/pt/s3/), [Cognito](https://aws.amazon.com/cognito/), [Lambda Serverless Function](https://aws.amazon.com/lambda/), [Simple Queue Service (SQS)](https://aws.amazon.com/pt/sqs/), [Simple Notification Service](https://aws.amazon.com/pt/sns/) e [Step Functions](https://aws.amazon.com/step-functions/). Para subir a infraestrutura local utilizou-se do [Terraform](https://www.terraform.io/) e [Kubernetes](https://kubernetes.io/pt-br/).

#### Arquitetura

Tendo em vista os requisitos técnicos da solução, o sistema dispõe de uma API Rest que realiza a autenticação do usuário e um endpoint para processamento do vídeo, que deve ser enviado no formato base64.

O padrão utilizado no design da camada de código foi a [arquitetura hexagonal](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749), devido a necessidade de implementar provedores de dados nos eixos da aplicação. Com a lógica da solução encapsulada em nuvem, não foi necessário implementar regras de negócios na API.

Mantendo os princípios do SOLID, decidiu-se criar funções serverless para cada caso de uso - autenticação, escrita na camada de persistência, envio de eventos para o serviço de notificação e processamento de vídeo.

O repositório conta com 2 sub-módulos:

- [Repositório de funções Serverless](https://github.com/architecture-postgrad-squad/hackathon-serverless-function): implementação das funções de autenticação, processamento de vídeo e escrita no banco além de suas respectivas dependências;
- [Repositório de infraestrutura](https://github.com/architecture-postgrad-squad/hackathon-infrastructure): implementação do cluster kubernetes utilizando descrição de objetos e configuração da implantação utilizando terraform.

![imagem](/doc/architecture/architecture.png)

Aplicação:

- **API:** Cliente HTTP responsável por autenticar o usuário e enviar o arquivo base64 para processamento na respectiva infraestrutura;

Infraestrutura em nuvem:

- **API Gateway:** serviço que permite o acesso à API Rest através de mapeamento de endpoints para instâncias no EKS;
- **Autenticação:**
  - **Cognito:** ferramenta utilizada para configurar grupos de acesso e forma de autenticação
  - **Authentication Lambda:** função que valida credenciais enviadas no cognito para autenticar um usuário
- **Persistência:**
  - **DynamoDb**: banco de dados escalável e de alto desempenho utilizado para armazenar meta dados do vídeo em fila para processamento e seu respectivo status - backlog, in-progress, completed;
  - **S3**: sistema de armazenamento utilizado para armazenar images extraídas do arquivo base64;
- **SQS**: ferramenta de fila para gerenciamento de processos sendo recebidos pela API;
- **SNS**: ferramenta de notificação para mensageria entre serviços da infraestrutura em nuvem.
- **Step Functions**: máquina de estados utilizada para gerenciamento das etapas necessárias para processamento do arquivo base64.

Diagrama de sequência da solução:

![imagem](/doc/uml/sequence.png)

#### Infraestrutura

Utilizando o Terraform para especificação de instâncias e implantação em EKS, manteve-se o padrão de gerenciamento por Kubernetes. O pipeline de Continuous Integration/Delivery foi implementado com GitHub Actions, assegurando a validação de builds, qualidade de código com cobertura mínima de 70% e deploy automatizado ao ser realizado o merge na branch principal.
