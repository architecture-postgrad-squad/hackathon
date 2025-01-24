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

TODO

![imagem](/doc/architecture/architecture.png)

![imagem](/doc/uml/sequence.png)

#### Serviços

- **API:**
- **LambdaAuth:**
- **Persistência:**

#### Infraestrutura

TODO
