# Secure Privacy Market

Marketplace multivendedor de segurança: equipamentos, serviços, produtos digitais e profissionais independentes.

**Stack:** Next.js 16 (App Router, Server Actions) · Prisma · SQLite em desenvolvimento / PostgreSQL em produção · sessão JWT em cookie httpOnly.

## Rodar localmente
```bash
npm install
cp .env.example .env      # e gere um SESSION_SECRET (comando no arquivo)
npm run setup             # cria o banco e carrega dados de exemplo
npm run dev               # http://localhost:3000
```
Contas de exemplo (senha `senha123`): `cliente@exemplo.com`, `vendedor@exemplo.com` (Secure Privacy), `vertice@exemplo.com`, `admin@exemplo.com`.

## O que já funciona
- Vitrine, busca, catálogo com filtros por tipo/categoria e ordenação
- Página de produto/serviço com especificações, avaliações (só de quem comprou) e loja do vendedor
- Carrinho com vários vendedores, checkout, pedido com divisão automática da comissão por vendedor
- Orçamentos para serviços sob medida (cliente pede, vendedor responde)
- Cadastro de vendedor (empresa ou profissional) com análise, painel com vendas, envios, anúncios e orçamentos
- Administração: aprovação de vendedores, selo de verificado, comissão por loja, curadoria de anúncios, destaques, pedidos e receita
- Página de regras de curadoria e itens proibidos

## Antes de colocar no ar
1. **Pagamento real:** hoje o provedor é `simulado`. Implemente o adaptador em `src/lib/payments.ts` com split (Pagar.me ou Mercado Pago) e o webhook de confirmação.
2. **Banco:** troque `provider = "sqlite"` por `"postgresql"` em `prisma/schema.prisma` e use uma URL de Postgres (Supabase, Neon, Railway).
3. **Hospedagem:** Vercel ou similar. Defina `DATABASE_URL`, `SESSION_SECRET` (≥ 32 caracteres) e `PAYMENT_PROVIDER`.
4. **Fotos dos anúncios:** adicionar upload de imagens (ex.: Supabase Storage ou S3).
5. **E-mails transacionais**, recuperação de senha e frete (Melhor Envio / Correios).
6. **Jurídico:** termos de uso, política de privacidade (LGPD) e contrato de intermediação com vendedores.
