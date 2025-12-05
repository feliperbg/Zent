# 💰 [Nome do Projeto] - Plataforma de Gestão Financeira Inteligente

> Uma solução SaaS completa para controle financeiro, otimização de gastos via geolocalização e análise de rotas para economia.

## 🚀 Visão Geral
O projeto visa transcender as planilhas comuns, oferecendo não apenas o registro de gastos, mas inteligência de dados para economia real. O sistema cruza dados financeiros com geolocalização para sugerir melhores locais de compra e rotas mais econômicas.

## 🛠 Tech Stack & Ferramentas
* **Core:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Containerização:** [Docker](https://www.docker.com/) & Docker Compose
* **Mapas/Geo:** Google Maps API / Mapbox (para roteirização)
* **Pagamentos:** Stripe ou Asaas (para planos Pro)

## ✨ Funcionalidades Principais
1.  **Dashboard Financeiro:** Visão 360º de receitas, despesas e investimentos.
2.  **Gestão de Metas:** "Cofres" virtuais para objetivos específicos.
3.  **Smart Geo-Economy:** Análise de preços baseada na localização do usuário (ex: Sugerir mercado mais barato na rota casa-trabalho).
4.  **Roteirização de Custos:** Cálculo de custo de deslocamento (Combustível/Transporte) vs. Economia na compra.
5.  **Relatórios IA:** Insights automáticos sobre hábitos de consumo.

## 🐳 Como Rodar com Docker (Recomendado)

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/projeto-financas.git](https://github.com/seu-usuario/projeto-financas.git)
   cd projeto-financas