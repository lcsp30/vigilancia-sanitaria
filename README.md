# 🎨 Sistema de Vigilância Sanitária — Frontend

**Interface web SPA (Single Page Application)** para servidores administrativos da Secretaria de Saúde Municipal gerenciarem o ciclo completo da vigilância sanitária: cadastro de estabelecimentos (CPF/CNPJ), licenças, documentos e notificações.

> **Repositório privado.** Contém apenas a camada de frontend. O backend é um monolito Laravel (API REST + servidor de arquivos estáticos) em repositório separado.

---

## 🖼️ Preview da Interface

<!-- TODO: Adicionar screenshots/GIFs das telas principais -->
<!-- 
![Dashboard](docs/screenshots/dashboard.png)
![Cadastro CNPJ](docs/screenshots/cadastro-cnpj.png)
![Documentos](docs/screenshots/documentos.png)
-->

---

## 🛠️ Stack do Front-end

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Framework** | React | 19.2 |
| **Bundler** | Vite | 7.3 |
| **Roteamento** | React Router | 7.13 |
| **Requisições HTTP** | Axios | 1.13 |
| **Modais acessíveis** | Radix UI (Dialog) | 1.1 |
| **Ícones** | react-icons (Ant Design) | 5.5 |
| **Validação CPF/CNPJ** | cpf-cnpj-validator | 1.0 |
| **Estilização** | CSS Modules | — |
| **Testes** | Vitest + Testing Library | 4.1 / 16.3 |
| **Linting** | ESLint 9 + react-hooks + react-refresh | 9.39 |
| **Linguagem** | JavaScript (JSX) — sem TypeScript | — |

> **Por que JavaScript puro?** O projeto é mantido por uma equipe de 2 pessoas. A ausência de TypeScript é uma concessão deliberada à produtividade, evitando a complexidade adicional de tipagem estática em um sistema de escopo controlado.

---

## ⚙️ Variáveis de Ambiente e Integração com Backend

O frontend se comunica com uma **API REST Laravel** via Axios. A URL base está configurada em `src/services/api.js`.

### Criar arquivo `.env` (recomendado)

```bash
cp .env.example .env
```

Edite o `.env` com a URL do backend:

```env
# .env
VITE_API_URL=http://10.11.10.75:8000/api/
```

### Atualizar `api.js` para usar a variável

```javascript
// src/services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://10.11.10.75:8000/api/",
});
```

### Ambientes disponíveis

| Ambiente | URL da API | Descrição |
|----------|-----------|-----------|
| **Desenvolvimento** | `http://10.11.10.75:8000/api/` | Servidor Laravel local na rede da secretaria |
| **Produção** | (definir pela TI da secretaria) | Deploy do Laravel com build estático do frontend |

> ⚠️ **Nota:** Atualmente a URL está hardcoded no `api.js`. O arquivo `.env` ainda não é consumido — é uma melhoria planejada (ver débitos técnicos).

---

## 🚀 Comandos Úteis

```bash
# Instalar dependências (primeira vez)
npm install

# Iniciar servidor de desenvolvimento com Hot Module Replacement
npm run dev

# Gerar build de produção (arquivos estáticos em /dist)
npm run build

# Previsualizar build de produção localmente
npm run preview

# Executar linter (ESLint)
npm run lint

# Executar testes unitários
npm test
```

### Pré-requisitos

- **Node.js** 18+ (recomendado 20 LTS)
- **npm** 9+
- Acesso à rede interna da secretaria (para alcançar o backend em `10.11.10.75:8000`)

---

## 🧪 Testes

O projeto utiliza **Vitest** como test runner e **Testing Library** para testes de componentes React.

```bash
# Rodar todos os testes uma vez (CI mode)
npm test

# Rodar testes em modo watch (desenvolvimento)
npx vitest

# Rodar com cobertura
npx vitest --coverage
```

### Estrutura de testes

```
src/components/__tests__/   # Testes unitários de componentes
```

### Configuração

- **Ambiente:** `jsdom` (simula o DOM no Node.js)
- **Globals:** `true` (describe, it, expect disponíveis sem import)
- **Configuração:** `vite.config.js` (seção `test`)

> ⚠️ A cobertura de testes atual é limitada — reflexo da capacidade da equipe de 2 pessoas. Contribuições com novos testes são bem-vindas.

---

## 📐 Organização de Pastas

```
vigilancia-sanitaria/
├── index.html                     # Entry point HTML (Vite)
├── package.json                   # Dependências e scripts
├── vite.config.js                 # Configuração do Vite + Vitest
├── eslint.config.js               # Regras ESLint (padrão Vite/React)
├── .gitignore
├── .env.example                   # Modelo de variáveis de ambiente
│
├── public/                        # Arquivos estáticos públicos
│   └── logoVisa_4k.svg            # Favicon e logo oficial
│
├── docs/                          # Documentação do projeto
│   └── arquitetura-vigilancia-sanitaria.md
│
└── src/                           # Código-fonte do frontend
    ├── main.jsx                   # Bootstrap: React root + RouterProvider
    ├── index.css                  # Estilos globais (reset, variáveis CSS)
    │
    ├── assets/                    # Imagens, logos e recursos estáticos
    │   ├── logoVisa_4k.svg
    │   └── ...
    │
    ├── components/                # Componentes reutilizáveis
    │   ├── Sidebar.jsx            # Barra lateral de navegação (8 links)
    │   ├── TopAppBar/             # Barra superior (logo + logout)
    │   ├── ProtectedRoute.jsx     # Guarda de autenticação
    │   ├── RoleRoute.jsx          # Guarda de nível de acesso
    │   ├── MetricCard.jsx         # Card de métrica do dashboard
    │   ├── Modal.jsx              # Modal base (Radix UI)
    │   ├── ModalEditarEstb.jsx    # Modal: editar estabelecimento
    │   ├── ModalLicenca.jsx       # Modal: gerar licença (PDF)
    │   ├── ModalApagarDoc.jsx     # Modal: excluir documento
    │   ├── ModalIntimacao.jsx     # Modal: gerar intimação
    │   ├── ModalConstatacaoAdvertencia.jsx
    │   ├── ModalMenuDoc.jsx       # Modal: habilitar/desabilitar docs
    │   ├── ModalNovoAno.jsx       # Modal: criar docs para novo ano
    │   ├── ModalProtocolo.jsx     # Modal: gerar protocolo (PDF)
    │   ├── ModalRequerimento.jsx  # Modal: gerar requerimento (.docx)
    │   ├── IconesAcao.jsx         # Ícones de ação (excluir/exportar)
    │   ├── cssComponents/         # Estilos CSS Modules dos componentes
    │   └── __tests__/             # Testes unitários
    │
    ├── contexts/                  # Estado global (Context API)
    │   └── AuthContext.jsx        # Autenticação JWT (login/logout/sessão)
    │
    ├── pages/                     # Páginas (rotas da aplicação)
    │   ├── TelaLogin/             # /login — única rota pública
    │   ├── TelaInicial/           # / — Dashboard com métricas
    │   ├── FormularioCadastroCpf/ # /formCpf — Cadastro Pessoa Física
    │   ├── FormularioCadastroCnpj/# /formCnpj — Cadastro Pessoa Jurídica
    │   ├── TelaEstabelecimentosCpf/    # Listagem de estabelecimentos PF
    │   ├── TelaEstabelecimentosCnpj/   # Listagem de estabelecimentos PJ
    │   ├── TelaEstabelecimentosNotificados/ # Estabelecimentos notificados
    │   ├── TelaInformacaoEstabelecimento/  # Detalhes do estabelecimento
    │   ├── TelaDocumentosEstabelecimento/  # Gestão de documentos
    │   ├── TelaLicencas/           # Licenças por divisão técnica
    │   └── PanelAdmin/            # /admin — Painel administrativo (nível 1)
    │
    └── services/                  # Serviços de comunicação com backend
        ├── api.js                 # Instância Axios + interceptors JWT
        └── userService.js         # CRUD de usuários (admin)
```

### Padrões e convenções

- **CSS Modules:** Cada componente/página tem seu próprio `*.module.css` com escopo isolado
- **Rotas:** 11 rotas definidas em `main.jsx` com proteção `ProtectedRoute` e `RoleRoute`
- **Autenticação:** JWT stateless armazenado em `localStorage`, injetado via interceptor Axios
- **Níveis de acesso:** 0 (técnico — operacional) e 1 (admin — acesso ao `/admin`)

---

## 🔗 Links Úteis

- [Documentação de Arquitetura (arc42 + C4)](docs/arquitetura-vigilancia-sanitaria.md)
- [Product Spec (PRODUCT.md)](PRODUCT.md)
- [Repositório no GitHub](https://github.com/lcsp30/vigilancia-sanitaria)