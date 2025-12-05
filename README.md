# 💰 Zent - Plataforma de Gestão Financeira Inteligente

> Uma solução SaaS moderna para controle financeiro, com arquitetura robusta e foco em experiência do usuário.

## 🚀 Visão Geral
O Zent vai além das planilhas, oferecendo inteligência de dados para economia real. O sistema utiliza Next.js 15 e uma arquitetura adaptada para escalabilidade.

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui.
- **Backend:** Server Actions (Next.js), Zod (Validation).
- **Database:** PostgreSQL, Prisma ORM.
- **Infra:** Docker & Docker Compose.
- **Language:** TypeScript.

## 📂 Arquitetura (Next.js Standard)

O projeto segue a arquitetura recomendada pelo Next.js (App Router), focada em **Colocation** (Co-localização):

- **src/app**: Contém as Rotas, Server Actions e Componentes específicos de cada feature.
  - Ex: `src/app/dashboard/` contém `page.tsx`, `actions.ts` e `_components/`.
- **src/lib**: Lógica de negócio compartilhada, configuração de Banco de Dados e Utilitários.
- **src/components**: Componentes de UI reutilizáveis em toda a aplicação.

Essa estrutura facilita a manutenção ao manter o código relacionado sempre próximo.

## 🐳 Como Rodar (Docker) - Recomendado

Siga estes passos para iniciar o ambiente completo:

1. **Pré-requisitos**:
   - Docker e Docker Compose instalados.
   - Node.js (v18+) instalado.

2. **Instalar Dependências**:
   ```bash
   npm install
   ```

3. **Iniciar Banco de Dados**:
   Subir o container do PostgreSQL:
   ```bash
   docker-compose up -d
   ```

4. **Configurar Banco (Prisma)**:
   Sincronizar o schema com o banco de dados:
   ```bash
   npx prisma db push
   ```

5. **Rodar a Aplicação**:
   ```bash
   npm run dev
   ```
   Acesse: [http://localhost:3000](http://localhost:3000)

## 🗄️ Estrutura do Banco de Dados

### Principais Entidades

| Model | Descrição |
| :--- | :--- |
| **User** | Usuários da plataforma (Plano Free/Pro). |
| **Transaction** | Receitas, Despesas e Transferências. Relacionada a User, Category e Place. |
| **Category** | Categorias de gastos (ex: Alimentação, Transporte). |
| **Goal** | Metas financeiras ("Cofres"). |
| **Place** | Locais (Lat/Long) para inteligência geográfica. |
| **Vehicle** | Veículos do usuário para cálculo de consumo. |

### Diagrama Simplificado
`User` -> has many -> [`Transaction`, `Goal`, `Vehicle`]
`Transaction` -> belongs to -> [`Category`, `Place`]

## 🔐 Variáveis de Ambiente (.env)

O arquivo `.env` já vem pré-configurado para o Docker local:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/finance_db?schema=public"
```

Caso use um banco externo, ajusta a `DATABASE_URL`.