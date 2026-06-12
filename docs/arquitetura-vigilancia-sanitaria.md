# Documentação de Arquitetura — Sistema de Vigilância Sanitária

**Versão:** 1.0.0
**Data:** 12/06/2026
**Formato:** arc42 + C4 Model

---

## 1. Introdução e Metas

### 1.1 Identidade do Sistema

**Sistema de Vigilância Sanitária** (nome provisório) é uma aplicação web do tipo **SPA (Single Page Application)** desenvolvida para a **Secretaria de Saúde Municipal**. O sistema centraliza e automatiza o ciclo completo da vigilância sanitária sobre estabelecimentos comerciais e de saúde, oferecendo uma interface sóbria e funcional para servidores administrativos.

**Repositório oficial:** [github.com/lcsp30/vigilancia-sanitaria](https://github.com/lcsp30/vigilancia-sanitaria.git)

### 1.2 Propósito e Objetivos de Negócio

O sistema gerencia o ciclo completo da vigilância sanitária:

**Cadastro (CPF/CNPJ) → Licenças → Documentos → Notificações**

Seu objetivo principal é **substituir processos manuais ou sistemas legados fragmentados**, oferecendo uma plataforma única onde servidores possam:

- Cadastrar e consultar estabelecimentos (Pessoa Física e Pessoa Jurídica)
- Gerenciar licenças sanitárias emitidas
- Anexar e controlar documentos exigidos
- Registrar e acompanhar notificações emitidas aos estabelecimentos
- Administrar usuários e níveis de acesso

### 1.3 Meta de Sucesso

> *"Um servidor consegue consultar, registrar ou atualizar qualquer informação de um estabelecimento em poucos cliques, sem ruído visual ou ambiguidade."*

O sucesso é medido pela redução do tempo gasto em tarefas administrativas repetitivas e pela eliminação de dúvidas ou retrabalho causados por interfaces confusas ou dados fragmentados.

### 1.4 Stakeholders

| Stakeholder | Papel | Interesse |
|---|---|---|
| Servidores administrativos | Usuários primários | Realizar cadastros, consultas, emissão de licenças e notificações com agilidade |
| Gestores/supervisores da VISA | Usuários secundários | Visão consolidada dos estabelecimentos e do trabalho da equipe |
| Administradores de sistema (nível 1) | Operação | Gerenciar usuários, permissões e configurações do sistema |
| Fiscais de campo (previsto) | Usuários futuros | Registrar notificações e constatações in loco |
| Estabelecimentos/cidadãos (previsto) | Público externo | Receber notificações e acompanhar situação cadastral |

### 1.5 Funcionalidades Core

1. **Autenticação segura** com JWT e níveis de acesso hierárquicos
2. **Cadastro de estabelecimentos PF** (CPF) com formulário específico
3. **Cadastro de estabelecimentos PJ** (CNPJ) com formulário específico
4. **Consulta e listagem** de estabelecimentos com filtros
5. **Gestão de licenças** sanitárias (emissão, consulta, renovação)
6. **Gestão de documentos** (anexação, visualização, exclusão)
7. **Notificações** a estabelecimentos (emissão e acompanhamento)
8. **Painel administrativo** com controle de usuários e níveis de acesso

### 1.6 Princípios Arquiteturais

Extraídos do [PRODUCT.md](../PRODUCT.md), os princípios que guiam todas as decisões de design e arquitetura:

1. **Autoridade discreta** — O design comunica seriedade e confiança sem excessos. A interface serve a informação, não compete com ela.
2. **Clareza acima de tudo** — Cada tela prioriza a tarefa principal. Hierarquia visual forte, labels explícitos, ações óbvias.
3. **Precisão institucional** — Consistência visual absoluta. Nada de enfeites gratuitos ou elementos que sugiram instabilidade.
4. **Acessibilidade WCAG AA** — Contraste adequado, navegação por teclado, labels semânticos para leitores de tela.

### 1.7 Fase Atual do Projeto

O sistema encontra-se em **desenvolvimento ativo (MVP funcional)**. O frontend React está estruturado com todas as telas principais implementadas, autenticação JWT operacional e comunicação com backend via API REST. O backend (Laravel, porta 8000) fornece os endpoints de autenticação, CRUD de usuários e dados de estabelecimentos.

**Stack atual:** React 19 + Vite 7 (frontend) | Laravel (backend) | MySQL (banco de dados)

---

## 2. Restrições da Arquitetura

As restrições abaixo delimitam o espaço de decisão arquitetural e refletem condições do ambiente, da equipe e da organização.

### 2.1 Infraestrutura e Rede

| Restrição | Descrição |
|---|---|
| **On-premise** | O sistema roda exclusivamente em servidores da própria secretaria de saúde, sem uso de serviços cloud (AWS, Azure, GCP). |
| **Rede interna** | O frontend consome a API no IP `10.11.10.75:8000`, indicando operação dentro da LAN da secretaria, protegida por firewall/proxy institucional. |
| **Sem HTTPS** | A comunicação entre frontend e backend utiliza HTTP simples, viável dado o ambiente de rede controlado e a ausência de exposição à internet pública. |

### 2.2 Acesso e Público

| Restrição | Descrição |
|---|---|
| **Uso interno exclusivo** | O sistema é acessível apenas por funcionários da secretaria de saúde. Não há portal público, auto-cadastro, acesso anônimo ou interação com cidadãos/estabelecimentos. |
| **Autenticação obrigatória** | Toda funcionalidade — exceto a tela de login — requer autenticação via JWT. Não há rotas públicas além de `/login`. |

### 2.3 Stack Tecnológica

| Restrição | Descrição |
|---|---|
| **100% open-source** | Toda a stack é composta por tecnologias de código aberto e sem custo de licenciamento (React, Vite, Laravel, MySQL, Vitest). Isso elimina a necessidade de processos de compra no setor público e reduz o custo total de propriedade. |
| **JavaScript puro (sem TypeScript)** | O frontend utiliza apenas JavaScript com extensão `.jsx`. A ausência de TypeScript é uma concessão à produtividade da equipe reduzida, evitando a complexidade adicional de tipagem estática. |
| **Laravel (PHP) como backend** | O backend é implementado em Laravel, framework PHP consolidado no ecossistema governamental brasileiro, com ampla documentação e comunidade. |

### 2.4 Dispositivos e Navegadores

| Restrição | Descrição |
|---|---|
| **Foco em desktop** | A interface é projetada para monitores de escritório (resolução 1366×768 ou superior). Não há requisito atual de responsividade para tablets ou smartphones. |
| **Navegadores modernos** | Chrome, Firefox e Edge em suas versões recentes. Não há exigência de suporte a Internet Explorer ou navegadores legados. |

### 2.5 Qualidade e Padrões

| Restrição | Descrição |
|---|---|
| **WCAG AA (meta voluntária)** | O time adota as diretrizes WCAG nível AA como padrão de qualidade — não por exigência legal imediata, mas para garantir usabilidade ampla e reduzir a fadiga visual dos servidores em uso prolongado. |
| **Autenticação JWT stateless** | O sistema utiliza tokens JWT sem estado no servidor (stateless), simplificando a operação e eliminando a necessidade de gerenciamento de sessões. Em caso de expiração do token (HTTP 401), o frontend redireciona automaticamente ao login. |
| **Testes configurados, cobertura inicial** | A estrutura de testes está estabelecida (Vitest + Testing Library + jsdom), porém com cobertura limitada — reflexo da capacidade da equipe de duas pessoas. |

### 2.6 Restrições Organizacionais

| Restrição | Descrição |
|---|---|
| **Equipe de 2 pessoas** | Todas as decisões arquiteturais consideram a capacidade de manutenção por uma equipe mínima. Tecnologias amplamente documentadas, com comunidades ativas e curvas de aprendizado baixas foram priorizadas. |
| **Servidores da secretaria** | O deploy e a operação são restritos à infraestrutura de TI da secretaria municipal, que pode impor políticas específicas de firewall, proxy, versões de software e procedimentos de atualização. |

---

## 3. Contexto do Sistema (C4 — System Context)

Esta seção apresenta o **Diagrama de Contexto (Nível 1 do C4 Model)**, que posiciona o Sistema de Vigilância Sanitária como uma caixa-preta dentro do ambiente da Secretaria de Saúde Municipal, identificando atores externos, sistemas adjacentes e os fluxos de interação.

### 3.1 Descrição do Contexto

O Sistema de Vigilância Sanitária é uma aplicação web **autocontida** que opera dentro da rede interna (LAN) da Secretaria de Saúde Municipal. O sistema **não se integra com sistemas externos** de outros órgãos — toda validação, autenticação e armazenamento são resolvidos internamente.

**Fronteira do sistema:** A rede LAN da secretaria, protegida por firewall/proxy institucional. Todo acesso ao sistema ocorre via navegador desktop dentro dessa rede.

### 3.2 Atores Externos

| Ator | Tipo | Descrição | Interação Principal |
|---|---|---|---|
| **Servidor Administrativo (Técnico)** | Humano | Funcionário da secretaria de saúde que opera o sistema no dia a dia. | Cadastra e consulta estabelecimentos, emite licenças, gerencia documentos, registra notificações. |
| **Administrador de Sistema (Admin — Nível 1)** | Humano | Servidor com privilégios elevados, responsável pela gestão do sistema. | Gerencia usuários, define níveis de acesso, supervisiona operações via painel `/admin`. |

**Nota:** O código antecipa futuros atores (fiscais de campo e estabelecimentos/cidadãos), mas estes não interagem com o sistema na versão atual.

### 3.3 Sistemas Externos e Fluxos

O sistema é autocontido e não consulta APIs de terceiros:

| Sistema | Tipo | Descrição | Fluxo |
|---|---|---|---|
| *(Nenhum)* | — | O sistema não se integra com Receita Federal, sistemas estaduais de vigilância, portais de saúde pública, serviços de email ou LDAP. | — |

### 3.4 Limites e Responsabilidades

| Limite | Descrição |
|---|---|
| **Validação CPF/CNPJ** | Realizada localmente via pacote `cpf-cnpj-validator` (validação algorítmica, sem consulta a APIs externas). |
| **Autenticação** | Gerida internamente com credenciais armazenadas no banco MySQL local (login próprio, sem integração com LDAP/Active Directory). |
| **Notificações** | Apenas registros internos no banco de dados — o sistema não envia emails, SMS ou push notifications. |
| **Ponto de entrada único** | Todo acesso ao sistema ocorre pelo frontend React (SPA). Não há acesso direto de usuários ao backend Laravel ou ao banco de dados. |

### 3.5 Diagrama de Contexto (Textual)

```
┌─────────────────────────────────────────────────────────────┐
│  REDE INTERNA — SECRETARIA DE SAÚDE MUNICIPAL               │
│                                                             │
│  ┌──────────────────────┐                                   │
│  │ Servidor Admin       │                                   │
│  │ (Técnico)            │─── Navegador Desktop ──┐          │
│  └──────────────────────┘                        │          │
│                                                  ▼          │
│  ┌──────────────────────┐   ┌──────────────────────────┐   │
│  │ Admin de Sistema     │──▶│  SISTEMA DE VIGILÂNCIA   │   │
│  │ (Nível 1)            │   │  SANITÁRIA               │   │
│  └──────────────────────┘   │                          │   │
│                             │  ┌────────┐ ┌────────┐  │   │
│                             │  │Frontend│ │Backend │  │   │
│                             │  │React   │ │Laravel │  │   │
│                             │  └────────┘ └───┬────┘  │   │
│                             │                  │       │   │
│                             │            ┌─────▼───┐   │   │
│                             │            │  MySQL  │   │   │
│                             │            └─────────┘   │   │
│                             └──────────────────────────┘   │
│                                                             │
│  Sem integrações externas:                                  │
│  ✗ Receita Federal    ✗ Sistemas Estaduais                  │
│  ✗ Email/SMS          ✗ LDAP/Active Directory              │
└─────────────────────────────────────────────────────────────┘
```

> **Nota:** O detalhamento interno do sistema (Frontend React, Backend Laravel, Banco MySQL) pertence à **Seção 4 — Visão de Containers** e é mostrado aqui apenas para orientação. O foco do System Context está nos atores externos e na fronteira do sistema.

---

## 4. Visão de Containers (C4 — Containers)

Esta seção detalha o **Diagrama de Containers (Nível 2 do C4 Model)**, decompondo o Sistema de Vigilância Sanitária nos principais artefatos implantáveis (containers) que o compõem: frontend, backend, banco de dados e filesystem.

### 4.1 Diagrama de Containers (Textual)

```
┌──────────────────────────────────────────────────────────────────┐
│  Navegador Desktop (Servidor Administrativo / Admin)             │
│                                                                  │
│  ┌─────────────────────────────┐                                 │
│  │  FRONTEND REACT (SPA)       │                                 │
│  │                             │                                 │
│  │  • React 19 + Vite 7        │                                 │
│  │  • Build estático servido   │                                 │
│  │    pelo Laravel             │                                 │
│  │  • React Router 7           │                                 │
│  │  • localStorage (token)     │                                 │
│  └──────────┬──────────────────┘                                 │
│             │  HTTP/REST + JSON                                  │
│             │  Header: Authorization: Bearer <jwt>               │
│             │  Porta: 8000                                       │
└─────────────┼────────────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────────────┐
│  Servidor da Secretaria (LAN: 10.11.10.75)                       │
│                                                                  │
│  ┌──────────────────────────────────────┐                        │
│  │  BACKEND LARAVEL (API REST)          │                        │
│  │                                      │                        │
│  │  • PHP / Laravel (porta 8000)        │                        │
│  │  • Serve build estático do frontend  │                        │
│  │  • Autenticação JWT                  │                        │
│  │  • Eloquent ORM                      │                        │
│  │  • Migrations (versionamento schema) │                        │
│  └──┬───────────────────────┬───────────┘                        │
│     │                       │                                    │
│     │ Eloquent ORM          │ Leitura/Escrita                    │
│     │ MySQL :3306           │ (filesystem)                       │
│     ▼                       ▼                                    │
│  ┌──────────────┐    ┌──────────────────────┐                    │
│  │  MYSQL       │    │  FILESYSTEM LOCAL    │                    │
│  │              │    │                      │                    │
│  │  • MySQL 8+  │    │  • Documentos (PDF)  │                    │
│  │  • Schema via │    │  • Imagens           │                    │
│  │    migrations │    │  • Anexos em geral   │                    │
│  └──────────────┘    └──────────────────────┘                    │
│                                                                  │
│  Sem camada de cache externa (Redis/Memcached).                  │
│  Sem WebSocket — comunicação exclusivamente REST/JSON.           │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Containers e Responsabilidades

| Container | Stack | Responsabilidade | Implantação |
|---|---|---|---|
| **Frontend React (SPA)** | React 19, Vite 7, React Router 7, Axios, Radix UI, react-icons, cpf-cnpj-validator | Interface de usuário executada no navegador. Realiza validação local de CPF/CNPJ, gerencia estado de autenticação via `localStorage` e encaminha requisições autenticadas ao backend. | Build estático (`vite build`) servido como arquivos estáticos pelo Laravel. |
| **Backend Laravel (API REST)** | PHP, Laravel, Eloquent ORM | Fornece endpoints REST/JSON para autenticação, CRUD de estabelecimentos, licenças, documentos, notificações e usuários. Gerencia migrations do banco, valida tokens JWT e serve o build estático do frontend em produção. | Processo PHP-FPM ou `php artisan serve` na porta 8000, dentro do servidor `10.11.10.75`. |
| **Banco MySQL** | MySQL 8+ | Persistência relacional de todos os dados do sistema: usuários, estabelecimentos, licenças, documentos (metadados), notificações. Schema versionado via migrations do Laravel. | Instância MySQL na mesma rede LAN. Comunicação via porta padrão 3306. |
| **Filesystem Local** | Sistema de arquivos do servidor | Armazenamento de documentos anexados (PDFs, imagens, arquivos diversos). Apenas metadados e referências ficam no banco. | Disco local do servidor `10.11.10.75`. |

### 4.3 Fluxos de Comunicação

| De | Para | Protocolo | Descrição |
|---|---|---|---|
| **Frontend React** | **Backend Laravel** | HTTP/REST + JSON | Todas as operações do sistema. O token JWT (`Bearer`) é injetado automaticamente via interceptor Axios. Rota base: `http://10.11.10.75:8000/api/`. |
| **Backend Laravel** | **Banco MySQL** | MySQL Wire Protocol (:3306) | Todas as consultas e mutações via Eloquent ORM. Schema versionado por migrations. |
| **Backend Laravel** | **Filesystem Local** | I/O de disco | Leitura e escrita de documentos anexados. Apenas referências (paths) são armazenadas no banco. |

### 4.4 Decisões Arquiteturais do Nível de Container

| Decisão | Justificativa |
|---|---|
| **Frontend servido pelo Laravel** | Simplifica o deploy — um único ponto de entrada. O build do Vite gera arquivos estáticos (HTML/CSS/JS) copiados para o diretório `public/` ou servidos via rota catch-all do Laravel. |
| **Monolito web + API no Laravel** | O backend acumula as funções de servidor web (para o frontend estático) e servidor API (para as requisições REST). Arquitetura pragmática para equipe de 2 pessoas — evita a complexidade de deploy separado e proxy reverso. |
| **JWT stateless (localStorage)** | Token armazenado no navegador, enviado a cada request. Não requer sessão no servidor, simplificando a escalabilidade horizontal futura. |
| **Sem cache externo** | Consultas diretas ao MySQL são consideradas adequadas para o volume atual de usuários (servidores da secretaria, uso interno). A introdução de Redis é postergada até que métricas de performance justifiquem. |
| **Documentos no filesystem** | Arquivos binários (PDFs, imagens) são armazenados no disco do servidor, não como BLOBs no banco. Isso mantém o banco mais leve e permite manipulação direta dos arquivos (backup, antivírus). |

---

## 5. Visão de Componentes (C4 — Components)

Esta seção detalha o **Diagrama de Componentes (Nível 3 do C4 Model)** com zoom no **Frontend React**, decompondo-o em seus principais componentes internos: contextos, serviços, layout, páginas e sistema de modais.

### 5.1 Diagrama de Componentes (Textual)

```
┌─────────────────────────────────────────────────────────────────────┐
│  FRONTEND REACT (SPA)                                               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ROOT LAYOUT (main.jsx)                                      │  │
│  │                                                              │  │
│  │  ┌─────────────────┐     ┌──────────────────────────────┐   │  │
│  │  │  AuthProvider    │     │  RouterProvider              │   │  │
│  │  │  (Context API)   │     │  (React Router 7)            │   │  │
│  │  │                  │     │                              │   │  │
│  │  │  • user          │     │  /login → TelaLogin         │   │  │
│  │  │  • token         │     │  /      → App (Dashboard)   │   │  │
│  │  │  • login()       │     │  /formCpf → FormularioCpf   │   │  │
│  │  │  • logout()      │     │  /formCnpj → FormularioCnpj │   │  │
│  │  │  • register()    │     │  /estabelecimentos-cpf      │   │  │
│  │  └────────┬────────┘     │  /estabelecimentos-cnpj     │   │  │
│  │           │              │  /estabelecimentos-         │   │  │
│  │  ┌────────▼────────┐     │    notificados              │   │  │
│  │  │  Guardas        │     │  /informacao-               │   │  │
│  │  │                 │     │    estabelecimento          │   │  │
│  │  │  ProtectedRoute │     │  /documentos                │   │  │
│  │  │  RoleRoute      │     │  /telaLicencas              │   │  │
│  │  └─────────────────┘     │  /admin (nível 1)           │   │  │
│  │                          └──────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  LAYOUT AUTENTICADO                                           │  │
│  │                                                               │  │
│  │  ┌───────────┐  ┌──────────────────────────────────────────┐ │  │
│  │  │  Sidebar  │  │  TopAppBar                                │ │  │
│  │  │           │  │  • Logo VISA                              │ │  │
│  │  │  8 links  │  │  • Nome do usuário                       │ │  │
│  │  │  Home     │  │  • Botão Logout                          │ │  │
│  │  │  Cad PF   │  └──────────────────────────────────────────┘ │  │
│  │  │  Cad PJ   │                                               │  │
│  │  │  Notif.   │  ┌──────────────────────────────────────────┐ │  │
│  │  │  Estb PF  │  │  ÁREA DE CONTEÚDO (Outlet)               │ │  │
│  │  │  Estb PJ  │  │                                          │ │  │
│  │  │  Licenças │  │  ┌────────────────────────────────────┐  │ │  │
│  │  │  Admin    │  │  │  Páginas                          │  │ │  │
│  │  └───────────┘  │  │  • Dashboard (MetricCards)         │  │ │  │
│  │                 │  │  • Formulários Cadastro PF/PJ      │  │ │  │
│  └─────────────────┘  │  • Listagens (PF/PJ/Notificados)   │  │ │  │
│                       │  • Detalhes Estabelecimento        │  │ │  │
│                       │  • Documentos                      │  │ │  │
│                       │  • Licenças                        │  │ │  │
│                       │  • Painel Admin                    │  │ │  │
│                       │  └────────────────────────────────────┘  │ │  │
│                       │                                          │ │  │
│                       │  ┌────────────────────────────────────┐  │ │  │
│                       │  │  SISTEMA DE MODAIS                 │  │ │  │
│                       │  │  • Modal (base)                    │  │ │  │
│                       │  │  • ModalEditarEstb                 │  │ │  │
│                       │  │  • ModalLicenca                    │  │ │  │
│                       │  │  • ModalMenuDoc                    │  │ │  │
│                       │  │  • ModalApagarDoc                  │  │ │  │
│                       │  │  • ModalIntimacao                  │  │ │  │
│                       │  │  • ModalConstatacaoAdvertencia     │  │ │  │
│                       │  │  • ModalNovoAno                    │  │ │  │
│                       │  │  • ModalProtocolo                  │  │ │  │
│                       │  │  • ModalRequerimento               │  │ │  │
│                       │  └────────────────────────────────────┘  │ │  │
│                       └──────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  SERVIÇOS                                                     │  │
│  │                                                               │  │
│  │  ┌─────────────────┐     ┌──────────────────────────────┐    │  │
│  │  │  api.js         │     │  userService.js              │    │  │
│  │  │  (Axios)        │     │                              │    │  │
│  │  │                 │     │  • getUsers()                │    │  │
│  │  │  • baseURL      │     │  • createUser()             │    │  │
│  │  │  • interceptor  │     │  • updateUser()             │    │  │
│  │  │    request: JWT │     │  • deleteUser()             │    │  │
│  │  │  • interceptor  │     └──────────────────────────────┘    │  │
│  │  │    response: 401│                                         │  │
│  │  └─────────────────┘                                         │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────┐     │  │
│  │  │  cpf-cnpj-validator (validação algorítmica local)   │     │  │
│  │  └─────────────────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ESTILIZAÇÃO                                                  │  │
│  │  • CSS Modules (.module.css) por componente/página            │  │
│  │  • Design system consistente alinhado ao PRODUCT.md           │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Tabela de Rotas

| Path | Componente | Guarda | Nível | Descrição |
|---|---|---|---|---|
| `/login` | `TelaLogin` | Nenhuma | Público | Tela de autenticação. Única rota acessível sem token. |
| `/` | `App` (TelaInicial) | `ProtectedRoute` | ≥ 0 | Dashboard inicial com cards de métricas. |
| `/formCpf` | `FormularioCpf` | `ProtectedRoute` | ≥ 0 | Formulário de cadastro de estabelecimento Pessoa Física (CPF). |
| `/formCnpj` | `FormularioCnpj` | `ProtectedRoute` | ≥ 0 | Formulário de cadastro de estabelecimento Pessoa Jurídica (CNPJ). |
| `/estabelecimentos-cpf` | `TelaEstabelecimentosCpf` | `ProtectedRoute` | ≥ 0 | Listagem de estabelecimentos PF cadastrados. |
| `/estabelecimentos-cnpj` | `TelaEstabelecimentosCnpj` | `ProtectedRoute` | ≥ 0 | Listagem de estabelecimentos PJ cadastrados. |
| `/estabelecimentos-notificados` | `TelaEstabelecimentosNotificados` | `ProtectedRoute` | ≥ 0 | Listagem de estabelecimentos com notificações ativas. |
| `/informacao-estabelecimento` | `TelaInformacaoEstabelecimento` | `ProtectedRoute` | ≥ 0 | Tela de detalhamento com dados completos do estabelecimento. O estabelecimento-alvo é passado via estado de navegação do React Router (location state) ou query param a partir da tela de listagem. |
| `/documentos` | `TelaDocumentosEstabelecimento` | `ProtectedRoute` | ≥ 0 | Gestão de documentos anexados ao estabelecimento. O estabelecimento-alvo é recebido via estado de navegação da tela de detalhe. |
| `/telaLicencas` | `TelaLicencas` | `ProtectedRoute` | ≥ 0 | Emissão, consulta e renovação de licenças sanitárias. |
| `/admin` | `PanelAdmin` | `RoleRoute` (nível 1) | 1 | Painel administrativo: gestão de usuários e permissões. |

### 5.3 Contextos e Estado Global

| Contexto | Arquivo | Descrição |
|---|---|---|
| **AuthContext** | `src/contexts/AuthContext.jsx` | Provedor global de autenticação via React Context API. Gerencia os estados `user`, `token` e `isAuthenticated`, persiste a sessão em `localStorage` e expõe as funções `login()`, `register()` e `logout()`. Envolve toda a árvore de componentes no `RootLayout`. |

### 5.4 Guardas de Rota

| Componente | Arquivo | Descrição |
|---|---|---|
| **ProtectedRoute** | `src/components/ProtectedRoute.jsx` | Redireciona para `/login` se o usuário não estiver autenticado. Envolve todas as rotas que exigem token JWT. |
| **RoleRoute** | `src/components/RoleRoute.jsx` | Redireciona para `/` se o `nivel_acesso` do usuário não estiver na lista `allowedLevels`. Usado atualmente apenas na rota `/admin` (nível 1). |

### 5.5 Serviços

| Serviço | Arquivo | Descrição |
|---|---|---|
| **api.js** | `src/services/api.js` | Instância Axios configurada com `baseURL: http://10.11.10.75:8000/api/`. Interceptor de request injeta token JWT (`Authorization: Bearer`). Interceptor de response redireciona ao `/login` e limpa sessão ao receber HTTP 401. |
| **userService.js** | `src/services/userService.js` | Serviço de CRUD de usuários (utilizado pelo painel admin): `getUsers()`, `createUser()`, `updateUser()`, `deleteUser()`. |

### 5.6 Layout Base

| Componente | Arquivo | Descrição |
|---|---|---|
| **Sidebar** | `src/components/Sidebar.jsx` | Barra lateral de navegação com 8 links (Home, Cadastro PF, Cadastro PJ, Notificados, Estabelecimentos PF, Estabelecimentos PJ, Licenças, Painel Admin). Utiliza `NavLink` do React Router com destaque ativo via CSS Modules. |
| **TopAppBar** | `src/components/TopAppBar/` | Barra superior global com logo VISA, nome do usuário logado e botão de logout. Presente em todas as telas autenticadas. |

### 5.7 Páginas por Domínio

| Domínio | Páginas | Descrição |
|---|---|---|
| **Autenticação** | `TelaLogin` | Formulário de login com campos de usuário e código de acesso, toggle de visibilidade da senha e tratamento de erros. |
| **Dashboard** | `TelaInicial/App` | Tela inicial (`/`) com cards de métricas (`MetricCard`) exibindo indicadores da vigilância sanitária. |
| **Cadastro** | `FormularioCpf`, `FormularioCnpj` | Formulários distintos para cadastro de estabelecimentos PF (CPF) e PJ (CNPJ), cada um com campos específicos para o tipo de pessoa. |
| **Consulta** | `TelaEstabelecimentosCpf`, `TelaEstabelecimentosCnpj`, `TelaEstabelecimentosNotificados` | Telas de listagem com filtros. Cada tela exibe o conjunto correspondente de estabelecimentos (PF, PJ ou notificados). |
| **Detalhe** | `TelaInformacaoEstabelecimento`, `TelaDocumentosEstabelecimento` | Visualização detalhada dos dados de um estabelecimento e gestão de seus documentos anexados (visualização, upload, exclusão). |
| **Gestão** | `TelaLicencas` | Emissão, consulta e renovação de licenças sanitárias vinculadas aos estabelecimentos. |
| **Admin** | `PanelAdmin` | Painel restrito a nível 1 para gerenciamento de usuários do sistema (criação, edição, exclusão, definição de níveis de acesso). |

### 5.8 Sistema de Modais

O frontend utiliza **modais especializados** baseados em `@radix-ui/react-dialog` para ações contextuais. O componente `Modal.jsx` serve como base, com variantes específicas para cada operação:

`ModalEditarEstb` · `ModalLicenca` · `ModalMenuDoc` · `ModalApagarDoc` · `ModalIntimacao` · `ModalConstatacaoAdvertencia` · `ModalNovoAno` · `ModalProtocolo` · `ModalRequerimento`

Cada modal encapsula a lógica e o formulário de sua respectiva ação (edição de estabelecimento, emissão de licença, exclusão de documento, etc.), mantendo as páginas limpas e focadas em sua responsabilidade principal.

### 5.9 Estilização

Toda a estilização do frontend utiliza **CSS Modules** (`*.module.css`), com um arquivo por componente/página. Esta abordagem garante escopo CSS isolado e previsível, alinhado ao princípio de **precisão institucional** do [PRODUCT.md](../PRODUCT.md) — sem conflitos de classes, sem variações arbitrárias, com consistência visual absoluta.

**Componente de validação local:** O pacote `cpf-cnpj-validator` executa validação algorítmica de CPF e CNPJ diretamente no frontend, antes do envio ao backend.

---

## 6. Visão de Código

Esta seção documenta a estrutura física do código-fonte do frontend, suas dependências, scripts e convenções. O backend Laravel não está coberto neste repositório (ver Seção 4 para sua visão de container).

### 6.1 Estrutura de Pastas

```
vigilancia-sanitaria/
├── index.html                     # Entry point HTML
├── package.json                   # Dependências e scripts
├── vite.config.js                 # Configuração do Vite + Vitest
├── eslint.config.js               # Regras ESLint (padrão Vite/React)
├── .gitignore
├── public/
│   ├── logoVisa_4k.svg            # Favicon e logo oficial
│   └── vite.svg
└── src/
    ├── main.jsx                   # Bootstrap da aplicação (createRoot + RouterProvider)
    ├── index.css                  # Estilos globais
    ├── assets/                    # Imagens e recursos estáticos
    │   ├── logoVisa_4k.svg
    │   ├── logoVisa_4k_branco.svg
    │   ├── logoVisa_4k_transparente.svg
    │   ├── logoVisa_4k_svg_embutido.svg
    │   ├── logoVisa.jpg
    │   ├── governo-superior-01.png
    │   ├── governo-superior-03.png
    │   └── react.svg
    ├── components/                # Componentes reutilizáveis
    │   ├── Sidebar.jsx            # Barra lateral de navegação
    │   ├── ProtectedRoute.jsx     # Guarda de autenticação
    │   ├── RoleRoute.jsx          # Guarda de nível de acesso
    │   ├── Modal.jsx              # Modal base (Radix UI)
    │   ├── ModalEditarEstb.jsx    # Modal: editar estabelecimento
    │   ├── ModalLicenca.jsx       # Modal: emitir licença
    │   ├── ModalMenuDoc.jsx       # Modal: menu de documentos
    │   ├── ModalApagarDoc.jsx     # Modal: confirmar exclusão de documento
    │   ├── ModalIntimacao.jsx     # Modal: intimação
    │   ├── ModalConstatacaoAdvertencia.jsx
    │   ├── ModalNovoAno.jsx       # Modal: novo ano
    │   ├── ModalProtocolo.jsx     # Modal: protocolo
    │   ├── ModalRequerimento.jsx  # Modal: requerimento
    │   ├── MetricCard.jsx         # Card de métrica (dashboard)
    │   ├── IconesAcao.jsx         # Ícones de ação
    │   ├── TopAppBar/             # Barra superior
    │   ├── cssComponents/         # Estilos dos componentes
    │   └── __tests__/             # Testes unitários
    ├── contexts/
    │   └── AuthContext.jsx        # Contexto global de autenticação
    ├── pages/                     # Páginas (roteáveis)
    │   ├── TelaInicial/           # Dashboard (/)
    │   ├── TelaLogin/             # Login (/login)
    │   ├── FormularioCadastroCpf/ # Cadastro PF (/formCpf)
    │   ├── FormularioCadastroCnpj/# Cadastro PJ (/formCnpj)
    │   ├── TelaEstabelecimentosCpf/
    │   ├── TelaEstabelecimentosCnpj/
    │   ├── TelaEstabelecimentosNotificados/
    │   ├── TelaInformacaoEstabelecimento/
    │   ├── TelaDocumentosEstabelecimento/
    │   ├── TelaLicencas/
    │   └── PanelAdmin/
    └── services/
        ├── api.js                 # Instância Axios + interceptors
        └── userService.js         # CRUD de usuários
```

### 6.2 Dependências

**Produção (`dependencies`):**

| Pacote | Versão | Função |
|---|---|---|
| `react` | ^19.2.0 | Biblioteca principal de UI |
| `react-dom` | ^19.2.0 | Renderização no DOM |
| `react-router` | ^7.13.0 | Roteamento SPA |
| `axios` | ^1.13.5 | Requisições HTTP ao backend |
| `@radix-ui/react-dialog` | ^1.1.15 | Sistema de modais acessível |
| `react-icons` | ^5.5.0 | Ícones (Ant Design Icons) |
| `cpf-cnpj-validator` | ^1.0.3 | Validação algorítmica de CPF/CNPJ |

**Desenvolvimento (`devDependencies`):**

| Pacote | Versão | Função |
|---|---|---|
| `vite` | ^7.3.1 | Bundler e dev server |
| `@vitejs/plugin-react` | ^5.1.1 | Suporte React no Vite |
| `eslint` | ^9.39.1 | Linter de código |
| `eslint-plugin-react-hooks` | ^7.0.1 | Regras de hooks React |
| `eslint-plugin-react-refresh` | ^0.4.24 | HMR com consistência de estado |
| `vitest` | ^4.1.8 | Test runner |
| `@testing-library/react` | ^16.3.2 | Testes de componentes React |
| `@testing-library/jest-dom` | ^6.9.1 | Matchers para testes DOM |
| `jsdom` | ^29.1.1 | Simulação de DOM em Node.js |

### 6.3 Scripts

| Comando | Ação |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite com HMR |
| `npm run build` | Gera o build de produção (`vite build`) |
| `npm run preview` | Previsualiza o build de produção localmente |
| `npm run lint` | Executa ESLint em todo o projeto |
| `npm test` | Executa os testes unitários (`vitest run`) |

### 6.4 Ponto de Entrada

O arquivo **`index.html`** é o entry point físico da SPA. Configurado com:
- `<html lang="pt-BR">`
- Favicon: `logoVisa_4k.svg`
- Meta viewport para desktop (`width=device-width, initial-scale=1.0`)
- `<div id="root">` como ponto de montagem React
- `<script type="module" src="/src/main.jsx">` como entry point JavaScript

O **`src/main.jsx`** inicializa a aplicação:
1. Importa estilos globais (`index.css`)
2. Envolve a árvore com `AuthProvider` (Context API)
3. Define 11 rotas com `createBrowserRouter` do React Router 7
4. Aplica `ProtectedRoute` em todas as rotas exceto `/login`
5. Aplica `RoleRoute` na rota `/admin` (nível 1)
6. Renderiza via `createRoot(document.getElementById('root'))`

### 6.5 Configuração do Vite

O **`vite.config.js`** é minimalista:
- Plugin: `@vitejs/plugin-react` (suporte JSX, Fast Refresh)
- Testes: `environment: 'jsdom'`, `globals: true` (para Vitest)

Não há plugins adicionais (sem PWA, sem compressão avançada, sem split de chunks customizado).

### 6.6 Comunicação com Backend

A instância Axios em **`src/services/api.js`** centraliza toda comunicação HTTP:

```javascript
baseURL: "http://10.11.10.75:8000/api/"
// Interceptor de request: injeta token JWT
// Interceptor de response: redireciona ao /login em caso de 401
```

**Observações:**
- A URL da API está **hardcoded** — não utiliza variáveis de ambiente (`.env` / `VITE_API_URL`)
- O token JWT é armazenado em `localStorage` e enviado como `Authorization: Bearer <token>`
- Não há tratamento de timeout configurado (usa o padrão do Axios)

### 6.7 Estilização

- **CSS Modules** (`*.module.css`) são a abordagem exclusiva de estilização
- **`src/index.css`** fornece estilos globais (reset, fontes, variáveis CSS)
- **Sem framework CSS** (Tailwind, Bootstrap, Material UI) — design manual alinhado ao [PRODUCT.md](../PRODUCT.md)
- Cada componente e página possui seu próprio arquivo de estilo com escopo isolado

### 6.8 Controle de Versão

O projeto utiliza **Git** com repositório remoto no GitHub:
- **URL:** `https://github.com/lcsp30/vigilancia-sanitaria.git`
- **Commit mais recente:** `9f35a64`
- **`.gitignore`** cobre: dependências (`node_modules`), build (`dist`), variáveis de ambiente (`.env`), logs e arquivos de sistema

---

## 7. Visão de Dados

> **A completar:** Esta seção depende do schema do banco de dados gerenciado pelo backend Laravel (migrations, models Eloquent, relacionamentos). As informações a seguir são inferidas da interface do frontend e devem ser validadas contra o código real do backend.

### 7.1 Entidades de Domínio (Inferidas)

Com base nas telas e fluxos do frontend, o modelo de dados contempla as seguintes entidades:

| Entidade | Descrição | Principais Atributos (Inferidos) |
|---|---|---|
| **User** | Usuário do sistema (servidor administrativo ou admin) | `name`, `name_user`, `password`, `nivel_acesso` |
| **Estabelecimento PF** | Estabelecimento vinculado a CPF | `cpf`, `nome`, `endereco`, `telefone`, `email`, dados da licença |
| **Estabelecimento PJ** | Estabelecimento vinculado a CNPJ | `cnpj`, `razao_social`, `nome_fantasia`, `endereco`, `telefone`, `email`, dados da licença |
| **Licenca** | Licença sanitária emitida | `numero`, `data_emissao`, `data_validade`, `tipo`, `estabelecimento_id` |
| **Documento** | Arquivo anexado a um estabelecimento | `nome`, `tipo`, `caminho` (filesystem), `estabelecimento_id`, `data_upload` |
| **Notificacao** | Notificação emitida a um estabelecimento | `tipo` (intimação, constatação, advertência), `data`, `descricao`, `estabelecimento_id` |
| **Protocolo** | Protocolo de requerimento | `numero`, `data`, `tipo`, `estabelecimento_id` |

**Nota:** Esta seção será completada com o schema real assim que o código do backend for integrado ao repositório de documentação.

---

## 8. Segurança

Esta seção documenta os mecanismos de segurança implementados no Sistema de Vigilância Sanitária, abrangendo autenticação, autorização, proteção de rotas e tratamento de sessão.

### 8.1 Modelo de Autenticação

O sistema utiliza **autenticação stateless baseada em JWT (JSON Web Token)**:

```
┌──────────────────────────────────────────────────────────────┐
│  FLUXO DE AUTENTICAÇÃO                                       │
│                                                              │
│  1. Usuário envia credenciais    POST /api/login             │
│     (name_user + password)       ──────────────────►         │
│                                                              │
│  2. Backend valida credenciais                               │
│     contra banco MySQL                                       │
│                                                              │
│  3. Backend retorna             ◄─── { user, token }         │
│     token JWT + dados user                                  │
│                                                              │
│  4. Frontend armazena token     localStorage.setItem(        │
│     e user no localStorage       'token', token)             │
│                                                              │
│  5. Toda request subsequente    Authorization: Bearer <jwt>  │
│     inclui token no header       ──────────────────►         │
│                                                              │
│  6. Se token expirar (401),     localStorage.clear()         │
│     frontend redireciona         window.location = '/login'  │
│     ao login                                                │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Componentes de Segurança

| Componente | Arquivo | Responsabilidade |
|---|---|---|
| **AuthContext** | `src/contexts/AuthContext.jsx` | Gerencia estado global de autenticação (`user`, `token`, `isAuthenticated`). Expõe `login()`, `register()`, `logout()`. Persiste e restaura sessão via `localStorage`. |
| **api.js (interceptor request)** | `src/services/api.js` | Injeta token JWT em toda requisição: `config.headers.Authorization = 'Bearer ' + token`. |
| **api.js (interceptor response)** | `src/services/api.js` | Detecta HTTP 401 (token expirado/inválido), limpa `localStorage` e redireciona ao `/login`. |
| **ProtectedRoute** | `src/components/ProtectedRoute.jsx` | Guarda de rota: redireciona para `/login` se `isAuthenticated === false`. |
| **RoleRoute** | `src/components/RoleRoute.jsx` | Guarda de autorização: redireciona para `/` se `user.nivel_acesso` não estiver na lista `allowedLevels`. |

### 8.3 Controle de Acesso (Autorização)

O sistema implementa **controle de acesso baseado em níveis** (simples, não RBAC completo):

| Nível | Descrição | Acesso |
|---|---|---|
| **0 (Padrão)** | Servidor administrativo (técnico) | Todas as funcionalidades operacionais: cadastro, consulta, licenças, documentos, notificações. |
| **1 (Admin)** | Administrador do sistema | Todas as funcionalidades do nível 0 + painel `/admin` (gestão de usuários e permissões). |

**Implementação:**
- O campo `nivel_acesso` é parte do objeto `user` retornado pelo backend
- `RoleRoute` verifica se `user.nivel_acesso` está contido em `allowedLevels`
- Atualmente, a única rota com restrição explícita de nível é `/admin` (allowedLevels: `[1]`)
- Demais rotas usam `ProtectedRoute` sem verificação de nível, significando que qualquer usuário autenticado (nível 0 ou 1) pode acessá-las

### 8.4 Proteção de Rotas

Todas as rotas são protegidas por padrão:

| Rota | Proteção | Nível Exigido |
|---|---|---|
| `/login` | Nenhuma (pública) | — |
| Todas as demais 10 rotas | `ProtectedRoute` | Autenticado |
| `/admin` | `ProtectedRoute` + `RoleRoute` | Nível 1 |

A rota `/login` é a única pública — usuários não autenticados são automaticamente redirecionados a ela por `ProtectedRoute`.

### 8.5 Armazenamento de Token

| Aspecto | Decisão |
|---|---|
| **Local de armazenamento** | `localStorage` (não `sessionStorage`, não cookies) |
| **Persistência** | Sobrevive a fechamento de aba/navegador |
| **Limpeza** | Token removido em: logout explícito ou recebimento de HTTP 401 |
| **Risco** | `localStorage` é vulnerável a XSS — aceitável dado o ambiente de rede interna controlada |

### 8.6 Logout

O logout é implementado em duas etapas:
1. **Backend:** `POST /api/logout` — invalida o token no servidor
2. **Frontend:** Remove `token` e `user` do `localStorage`, reseta estado e redireciona a `/login`

O bloco `finally` garante que o frontend limpe a sessão local mesmo se a chamada ao backend falhar (ex: servidor indisponível). Neste cenário, o token continua válido no servidor até sua expiração natural — um risco baixo dado o ambiente de rede interna controlada.

### 8.7 Credenciais e Login

- **Autenticação local:** Credenciais (`name_user` + `password`) armazenadas no banco MySQL
- **Sem LDAP/AD:** Não há integração com diretórios institucionais
- **Sem OAuth/SSO:** Login exclusivamente por formulário próprio
- **Registro de usuários:** Apenas via painel admin (`/admin`) — não há auto-cadastro público
- **Senha:** Ocultada por padrão com toggle de visibilidade (campo `type="password"`)
- **Expiração do token JWT:** Definida no backend Laravel (tempo de vida configurado no servidor). O documento não especifica o valor exato — verificar configuração `JWT_TTL` no `.env` do backend.

### 8.8 Ambiente de Rede

- **Rede interna (LAN):** Todo tráfego ocorre dentro da rede da secretaria (`10.11.10.75`)
- **HTTP (sem TLS):** A comunicação é em HTTP simples — aceitável no ambiente controlado, mas deve-se considerar migração para HTTPS em caso de exposição futura a redes não confiáveis
- **Sem VPN:** O acesso é restrito à presença física na rede da secretaria ou acesso remoto gerenciado pela TI

### 8.9 Considerações e Riscos de Segurança

| Risco | Nível | Mitigação Atual | Recomendação |
|---|---|---|---|
| Token em `localStorage` (XSS) | Médio | Ambiente de rede controlado, sem entrada de usuário externo | Migrar para `httpOnly` cookie quando houver TLS |
| HTTP sem criptografia | Baixo | Rede LAN isolada | Habilitar HTTPS se o sistema for exposto a outras redes |
| URL da API hardcoded | Baixo | O repositório é privado, mas isso apenas reduz exposição — não é mitigação de segurança | Mover para variáveis de ambiente (`VITE_API_URL`) e nunca versionar credenciais |
| Sem rate limiting visível | Baixo | Uso interno com baixo volume | Implementar no backend Laravel |
| Sem registro de auditoria | Médio | — | Implementar log de ações dos usuários (quem fez o quê, quando) |
| **Autorização apenas no frontend** | **Alto** | `RoleRoute` bloqueia acesso à rota `/admin` no frontend, mas não há confirmação neste documento de que o backend também valida `nivel_acesso` nos endpoints da API | **Urgente:** Verificar se o backend Laravel aplica middleware de autorização nos endpoints administrativos. Se não, um usuário nível 0 pode acessar recursos de admin via requisição HTTP direta |

---

## 9. Design e Acessibilidade

Esta seção documenta os princípios de design, a identidade visual e os padrões de acessibilidade que guiam a interface do Sistema de Vigilância Sanitária, conforme estabelecido no [PRODUCT.md](../PRODUCT.md).

### 9.1 Personalidade da Marca

| Atributo | Descrição |
|---|---|
| **Tom** | Sóbrio, confiável, preciso |
| **Estilo** | Institucional e formal, porém funcional |
| **Postura** | Competente e direto — não é acolhedor nem caloroso |
| **Comunicação visual** | Transmite seriedade pública, não entusiasmo corporativo |

A interface do sistema é projetada para um órgão de saúde pública: ela deve inspirar confiança e autoridade, sem recorrer a excessos visuais ou apelos emocionais.

### 9.2 Princípios de Design

#### 9.2.1 Autoridade Discreta

> *O design comunica seriedade e confiança sem precisar gritar.*

- Cores e elementos visuais são **contidos e propositais**
- A interface **não compete com a informação** — ela a serve
- Nada é puramente decorativo; cada elemento tem função

#### 9.2.2 Clareza Acima de Tudo

> *Servidores precisam encontrar informação e agir rápido.*

- Cada tela **prioriza a tarefa principal** sem distrações
- **Hierarquia visual forte** guia o olhar para o que importa
- **Labels explícitos** e **ações óbvias** eliminam ambiguidade
- A pergunta "o que eu faço agora?" deve ter resposta imediata

#### 9.2.3 Precisão Institucional

> *Consistência visual absoluta. Nada de enfeites gratuitos.*

- Margens, escalas, cores e tipografia formam um **sistema previsível**
- Sem variações arbitrárias entre telas
- Cada componente segue o mesmo vocabulário visual
- A previsibilidade gera confiança e reduz a carga cognitiva

### 9.3 Anti-Referências (O que NÃO fazer)

O documento PRODUCT.md estabelece explicitamente o que é rejeitado no design:

| Anti-padrão | Razão da Rejeição |
|---|---|
| Design chamativo, colorido ou informal | Não condiz com o tema de saúde pública |
| Interfaces poluídas com informação excessiva | Típicas de portais governamentais antigos — causam paralisia decisória |
| Estilo "SaaS genérico" (cards idênticos, gradientes, elementos decorativos) | Transmite informalidade e falta de propósito institucional |
| Tratamento visual frívolo | Diminui a percepção de seriedade institucional |

### 9.4 Acessibilidade (WCAG AA)

O sistema adota as **Web Content Accessibility Guidelines (WCAG) nível AA** como padrão mínimo de qualidade.

#### 9.4.1 Requisitos Implementados

| Requisito | Implementação |
|---|---|
| **Contraste de cores** | Relação de contraste mínima de 4.5:1 para texto normal e 3:1 para texto grande, garantindo legibilidade |
| **Navegação por teclado** | Todos os elementos interativos são acessíveis via `Tab`, `Enter`, `Escape`. Modais do Radix UI gerenciam foco automaticamente |
| **Labels semânticos** | Elementos de formulário possuem `<label>` associados. Ícones possuem `title` ou `aria-label`. A Sidebar usa links semânticos com `NavLink` |
| **Feedback de localização** | Links ativos na Sidebar recebem destaque visual distinto (`isActive`), permitindo que o usuário sempre saiba onde está |
| **Fadiga visual** | Fundos sem alto contraste agressivo. Tipografia de tamanho adequado para uso prolongado. Espaçamento generoso entre elementos |

#### 9.4.2 Status

A acessibilidade WCAG AA é uma **meta voluntária** do time — não uma exigência legal imediata. Ela é adotada porque:

1. **Uso prolongado:** Servidores passam horas no sistema; acessibilidade reduz fadiga
2. **Usabilidade ampla:** Beneficia todos os usuários, não apenas aqueles com deficiência
3. **Qualidade institucional:** Reforça a imagem de competência e cuidado do órgão público

### 9.5 Implementação Técnica do Design

#### 9.5.1 CSS Modules

Toda a estilização utiliza **CSS Modules** (`*.module.css`), com um arquivo dedicado por componente ou página. Esta escolha garante:

- **Escopo isolado:** Classes não vazam entre componentes
- **Previsibilidade:** Sem conflitos ou sobrescrições acidentais
- **Consistência:** Cada variação visual é intencional e localizada

#### 9.5.2 Radix UI

O sistema utiliza **@radix-ui/react-dialog** como base para o sistema de modais. O Radix UI é uma biblioteca de primitivos acessíveis que fornece:

- **Gerenciamento de foco:** Foco aprisionado dentro do modal quando aberto
- **Roles ARIA:** `role="dialog"`, `aria-modal`, `aria-labelledby` aplicados automaticamente
- **Fechamento por Escape:** Comportamento padrão de teclado
- **Portal rendering:** Renderização em nível superior do DOM, evitando conflitos de z-index

#### 9.5.3 Identidade Visual

- **Logo VISA** (`logoVisa_4k.svg`) como elemento central da identidade — presente no favicon, na tela de login e na TopAppBar
- **Paleta institucional:** Cores sóbrias (azuis escuros, cinzas neutros) alinhadas à comunicação visual do governo
- **Tipografia:** Fontes legíveis e de tamanho confortável, adequadas para longas jornadas de trabalho
- **Sem ícones decorativos:** Todos os ícones (`react-icons`) têm função informacional ou de ação

### 9.6 Resumo dos Princípios

```
┌─────────────────────────────────────────────────────────────┐
│  DESIGN DO SISTEMA DE VIGILÂNCIA SANITÁRIA                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ AUTORIDADE      │  │ CLAREZA         │                   │
│  │ DISCRETA        │  │ ACIMA DE TUDO   │                   │
│  │                 │  │                 │                   │
│  │ • Cores contidas│  │ • Hierarquia    │                   │
│  │ • Sem excessos  │  │ • Labels claros │                   │
│  │ • Propósito     │  │ • Ações óbvias  │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ PRECISÃO        │  │ ACESSIBILIDADE  │                   │
│  │ INSTITUCIONAL   │  │ WCAG AA         │                   │
│  │                 │  │                 │                   │
│  │ • Consistência  │  │ • Contraste     │                   │
│  │ • Previsibilidade│  │ • Teclado       │                   │
│  │ • Sem enfeites  │  │ • Leitores tela │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                             │
│  Sóbrio · Confiável · Preciso · Institucional              │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Deploy e Operação

> **A completar:** Esta seção depende de informações sobre o ambiente de produção, procedimentos de deploy, CI/CD, monitoramento e backup que não estão disponíveis no repositório do frontend. Deve ser preenchida com detalhes do ambiente real da Secretaria de Saúde.

---

## 11. Riscos e Débitos Técnicos

> **A completar:** Esta seção depende de avaliação conjunta com a equipe de desenvolvimento e stakeholders da Secretaria de Saúde.

---

## 12. Glossário

### 12.1 Termos Técnicos

| Termo | Definição |
|---|---|
| **arc42** | Modelo de documentação de arquitetura de software com 12 seções padronizadas (introdução, restrições, contexto, solução, deploy, riscos, etc.). |
| **C4 Model** | Framework de diagramação de arquitetura em 4 níveis hierárquicos: System Context (N1), Containers (N2), Components (N3), Code (N4). |
| **SPA (Single Page Application)** | Aplicação web que carrega uma única página HTML e atualiza dinamicamente o conteúdo via JavaScript, sem recarregamento de página. |
| **JWT (JSON Web Token)** | Token de autenticação stateless no formato JSON, assinado digitalmente. Usado para autenticar requisições sem armazenar sessão no servidor. |
| **REST (Representational State Transfer)** | Estilo arquitetural para APIs web baseado em recursos, utilizando verbos HTTP (GET, POST, PUT, DELETE) e formato JSON. |
| **SPA** | Single Page Application — ver definição acima. |
| **ORM (Object-Relational Mapping)** | Técnica que mapeia objetos de uma linguagem de programação para tabelas de banco de dados relacional. O Laravel utiliza Eloquent ORM. |
| **Eloquent** | ORM nativo do Laravel que representa tabelas do banco como Models PHP, com relacionamentos, scopes e mutators. |
| **Migration** | Arquivo de versionamento de schema de banco de dados no Laravel, permitindo aplicar e reverter alterações de forma controlada. |
| **CSS Modules** | Abordagem de estilização em que classes CSS têm escopo local por componente, evitando conflitos de nomes. Arquivos `*.module.css`. |
| **HMR (Hot Module Replacement)** | Funcionalidade do Vite que atualiza módulos no navegador em tempo real durante o desenvolvimento, sem perder o estado da aplicação. |
| **WCAG (Web Content Accessibility Guidelines)** | Diretrizes internacionais de acessibilidade web definidas pelo W3C. O nível AA é o padrão intermediário de conformidade. |
| **ARIA (Accessible Rich Internet Applications)** | Conjunto de atributos HTML que melhoram a acessibilidade de aplicações web dinâmicas para tecnologias assistivas. |
| **localStorage** | API do navegador que armazena dados no formato chave-valor de forma persistente (sobrevive ao fechamento do navegador). |
| **Interceptor** | Mecanismo do Axios que permite interceptar requisições HTTP antes de serem enviadas ou respostas antes de serem processadas. |
| **CI/CD (Continuous Integration / Continuous Deployment)** | Prática de automação de build, teste e deploy de software. Não implementado atualmente no projeto. |
| **RBAC (Role-Based Access Control)** | Modelo de controle de acesso baseado em papéis/funções. O sistema atual usa um modelo simplificado de níveis (0 e 1). |
| **TLS (Transport Layer Security)** | Protocolo criptográfico que garante comunicação segura na web (HTTPS). Não utilizado atualmente no ambiente de LAN. |
| **XSS (Cross-Site Scripting)** | Vulnerabilidade que permite injeção de scripts maliciosos em páginas web. Risco associado ao armazenamento de token em `localStorage`. |

### 12.2 Termos de Domínio (Vigilância Sanitária)

| Termo | Definição |
|---|---|
| **Vigilância Sanitária (VISA)** | Conjunto de ações de fiscalização e controle sanitário sobre estabelecimentos, produtos e serviços que afetam a saúde pública. |
| **Estabelecimento** | Local físico sujeito à vigilância sanitária (clínicas, consultórios, farmácias, restaurantes, indústrias, etc.). |
| **PF (Pessoa Física)** | Estabelecimento cadastrado sob CPF do responsável (profissional autônomo ou MEI). |
| **PJ (Pessoa Jurídica)** | Estabelecimento cadastrado sob CNPJ (empresa, sociedade, organização). |
| **CPF** | Cadastro de Pessoa Física — documento de identificação individual. |
| **CNPJ** | Cadastro Nacional de Pessoa Jurídica — documento de identificação de empresas. |
| **Licença Sanitária** | Documento oficial emitido pela vigilância sanitária que autoriza o funcionamento de um estabelecimento, atestando conformidade com as normas sanitárias. |
| **Notificação** | Comunicação formal da vigilância sanitária a um estabelecimento, podendo ser: intimação (exigência de adequação), constatação (registro de irregularidade) ou advertência (penalidade). |
| **Protocolo** | Número de registro de um requerimento ou processo administrativo junto à vigilância sanitária. |
| **Intimação** | Tipo de notificação que exige que o estabelecimento tome providências em prazo determinado. |
| **Requerimento** | Solicitação formal do estabelecimento à vigilância sanitária (ex: renovação de licença). |
| **Servidor Administrativo** | Funcionário público da secretaria de saúde que opera o sistema. Sinônimo de "técnico" no contexto do sistema. |
| **Nível de Acesso** | Classificação do usuário no sistema: 0 (técnico — acesso operacional) ou 1 (admin — acesso administrativo). |

### 12.3 Siglas e Abreviações

| Sigla | Significado |
|---|---|
| **API** | Application Programming Interface |
| **CRUD** | Create, Read, Update, Delete |
| **LAN** | Local Area Network |
| **MVP** | Minimum Viable Product |
| **SPA** | Single Page Application |
| **VISA** | Vigilância Sanitária |
| **Vite** | Build tool e dev server para frontend (pronuncia-se "veet") |
| **ESLint** | Linter para JavaScript/JSX |
| **Axios** | Biblioteca HTTP para requisições baseadas em Promises |
| **Radix UI** | Biblioteca de primitivos de interface acessíveis e sem estilo |
