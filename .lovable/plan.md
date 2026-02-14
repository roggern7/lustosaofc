

## Plano: Recriar o site Lustosa Sports no Lovable

Este projeto é um **site de e-commerce esportivo** (Lustosa Sports) construído com React + Vite + Tailwind + shadcn-ui — a mesma stack do Lovable. Vou recriar todos os arquivos exatamente como estão no repositório.

### Estrutura do projeto a ser recriada

**Páginas:**
1. **Index** (`/`) — Página principal com Hero, Produtos em destaque e Footer
2. **Catalog** (`/catalogo`) — Catálogo completo com filtros por categoria e numeração, paginação
3. **NotFound** — Página 404

**Componentes personalizados:**
- `Hero.tsx` — Seção hero com background, logo Lustosa, botões (Catálogo, WhatsApp, Instagram, Grupo VIP)
- `Products.tsx` — Seção de destaques na home (4 produtos da API)
- `Footer.tsx` — Footer com CTA de WhatsApp
- `WhatsAppButton.tsx` — Botão flutuante do WhatsApp
- `catalog/CatalogCard.tsx` — Card de produto com galeria de imagens, seleção de tamanho, botão de compra via WhatsApp
- `catalog/CatalogGrid.tsx` — Grid responsivo de produtos
- `catalog/CategoryFilter.tsx` — Filtro por categoria (Campo, Futsal, Society)
- `catalog/SizeFilter.tsx` — Filtro por numeração (37-44)

**Lógica e API:**
- `lib/cfApi.ts` — Cliente API para Cloudflare Workers (`lustosasports-api.sportslustosa.workers.dev`)
- `hooks/useCatalog.ts` — Hook de catálogo com React Query

**Design System:**
- Cores customizadas: Dourado Lustosa + Azul Escuro
- Variantes de botão personalizadas: `hero`, `whatsapp`, `catalog`
- CSS customizado com gradientes, sombras, animações (shimmer, fade-in)
- Fonte Inter

**Assets:**
- `hero-soccer.jpg` e `lustosa-logo.jpg` (imagens do repositório)

**Integrações Supabase:**
- Arquivo `types.ts` com tipos de banco (bolsas, caneleiras, etc.)

### O que será feito

1. Atualizar `src/index.css` com o design system completo da Lustosa
2. Atualizar `tailwind.config.ts` com fonte Inter
3. Atualizar `src/components/ui/button.tsx` com variantes hero/whatsapp/catalog
4. Criar `src/lib/cfApi.ts` (cliente API Cloudflare Workers)
5. Criar `src/hooks/useCatalog.ts`
6. Criar componentes: Hero, Products, Footer, WhatsAppButton
7. Criar componentes catalog: CatalogCard, CatalogGrid, CategoryFilter, SizeFilter
8. Criar páginas: Index (atualizar), Catalog (nova), NotFound (atualizar)
9. Atualizar `src/App.tsx` com rota `/catalogo`
10. Baixar e adicionar as imagens de assets (hero-soccer.jpg, lustosa-logo.jpg)

> **Nota:** O site busca produtos de uma API externa no Cloudflare Workers. Essa integração será mantida exatamente como está, sem alterações.

