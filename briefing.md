# Briefing — Landing page faro.ai

> Documento de contexto para o Claude Code. Leia inteiro antes de implementar qualquer seção.
> A copy completa e literal de cada seção está em `copy.md`. Este arquivo define **o quê** construir e **como**; o `copy.md` define **o texto**.

---

## 1. O projeto

**Produto:** faro.ai — um agente de IA que cuida das finanças de pessoas físicas (PF) e microempreendedores individuais (MEI).

**Como o produto funciona (o que a página precisa mostrar):**
- O usuário **registra gastos e receitas pelo WhatsApp**, com mensagens em linguagem natural ("Gastei R$ 42 no almoço").
- O usuário **faz perguntas pelo WhatsApp** ("Quanto já gastei com transporte este mês?").
- Um **painel web** mostra saldo, receitas, despesas, categorias, histórico com filtros e comparativo entre períodos.
- A **IA analisa as movimentações**: encontra padrões, aponta variações e excessos, compara períodos.

**Tagline:** Saiba para onde tudo vai.

**Objetivo da página:** converter visitantes em usuários (CTA principal: "Começar agora").

**Público:** pessoas que sabem quanto ganham, mas não sabem para onde o dinheiro vai; não querem planilhas nem conhecimento financeiro técnico. Inclui MEIs que misturam ou precisam separar finanças pessoais e do negócio.

**Tom de voz:** claro, próximo, direto, sem jargão financeiro, sem sensacionalismo. Promete **clareza**, nunca resultado financeiro garantido.

---

## 2. Stack e restrições técnicas

- **Somente HTML, CSS e JavaScript puro.** Sem framework, sem bundler, sem build step, sem npm.
- O site deve funcionar abrindo `index.html` direto no navegador (ou com um servidor estático simples).
- **Biblioteca de componentes:** [Basecoat UI](https://basecoatui.com/) v1.0.2 via CDN.
- **Fonte:** Space Grotesk (Google Fonts).
- **Ícones:** Lucide, como **SVG inline** (o Basecoat não traz pacote de ícones). Copiar de https://lucide.dev/icons.
- Idioma da página: `pt-BR` (`<html lang="pt-BR">`).

### 2.1 Importações (ordem importa)

```html
<!-- 1. Fonte -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">

<!-- 2. Basecoat (estilo padrão "Vega") -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/basecoat-css@1.0.2/dist/basecoat.cdn.min.css">

<!-- 3. Nossos estilos — SEMPRE depois do Basecoat -->
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/sections.css">

<!-- 4. JS do Basecoat (accordion, tabs etc.) + nosso JS -->
<script src="https://cdn.jsdelivr.net/npm/basecoat-css@1.0.2/dist/js/all.min.js" defer></script>
<script src="assets/js/main.js" defer></script>
```

### 2.2 Regras sobre o Basecoat

- O Basecoat é escrito para Tailwind, mas **não usamos Tailwind**. O bundle de CDN entrega os estilos dos componentes; **não conte com classes utilitárias do Tailwind** (`flex`, `gap-4`, `px-6`, `md:grid-cols-3` etc.) — elas podem não existir no bundle. **Todo layout (grid, espaçamento, containers, responsividade) é feito no nosso CSS.**
- A API da v1.0 usa **classe raiz + atributos `data-*`**. Não use classes de variante antigas (pré-1.0) como `btn-outline`.
- Componentes que vamos usar e sua marcação:

| Componente | Marcação | Uso na página |
|---|---|---|
| Button | `<a class="btn">` (navegação) / `<button class="btn">` (ação). Variantes: `data-variant="secondary\|outline\|ghost\|link"`. Tamanhos: `data-size="sm\|lg"`. Ícone dentro do botão: `data-icon="inline-start\|inline-end"` no `<svg>` | Todos os CTAs |
| Badge | `<span class="badge">`, `data-variant="secondary\|outline\|ghost"` | Eyebrows, tags de "exemplo ilustrativo" |
| Card | `<div class="card"><header><h3/><p/></header><section>…</section><footer>…</footer></div>` | Cards de features, oferta |
| Accordion | `<section class="accordion"><details><summary>Pergunta + svg chevron</summary><section>Resposta</section></details></section>` (precisa de JS) | FAQ |
| Tabs | ver docs (precisa de JS) | Alternativa para Seção 5 / carrossel de conversas |
| Table | ver docs | Mockup do histórico de movimentações no painel |

- Antes de usar um componente que não está na tabela, consulte a página dele em `https://basecoatui.com/components/<nome>.md`.
- Se precisar ajustar visual de um componente, faça **override no nosso CSS por tokens** (`--primary`, `--radius` etc.) antes de sobrescrever propriedades soltas.

---

## 3. Design system

### 3.1 Paleta

| Nome | Hex | Papel |
|---|---|---|
| Carvão azulado | `#10111B` | Fundo da página |
| Índigo | `#282745` | Superfícies: cards, mockups, seções alternadas, bordas fortes |
| Violeta | `#A99BFF` | Cor de marca: CTAs primários, destaques, links, gráficos, foco |
| Branco frio | `#F6F5FB` | Texto principal |
| Cinza | `#9796AB` | Texto secundário, legendas, placeholders, ícones neutros |

**A página é dark-only.** Colocar `class="dark"` no `<html>` e definir os tokens tanto em `:root` quanto em `.dark` para o Basecoat sempre renderizar no tema escuro.

### 3.2 Tokens (`assets/css/tokens.css`)

Mapear a paleta nas variáveis compatíveis com shadcn/ui que o Basecoat lê:

```css
:root,
.dark {
  /* paleta da marca */
  --faro-carvao: #10111B;
  --faro-indigo: #282745;
  --faro-violeta: #A99BFF;
  --faro-branco: #F6F5FB;
  --faro-cinza: #9796AB;

  /* tokens Basecoat / shadcn */
  --background: var(--faro-carvao);
  --foreground: var(--faro-branco);

  --card: var(--faro-indigo);
  --card-foreground: var(--faro-branco);
  --popover: var(--faro-indigo);
  --popover-foreground: var(--faro-branco);

  --primary: var(--faro-violeta);
  --primary-foreground: var(--faro-carvao); /* texto escuro sobre violeta = contraste AA */

  --secondary: var(--faro-indigo);
  --secondary-foreground: var(--faro-branco);

  --muted: var(--faro-indigo);
  --muted-foreground: var(--faro-cinza);

  --accent: color-mix(in srgb, var(--faro-violeta) 14%, var(--faro-carvao));
  --accent-foreground: var(--faro-branco);

  --border: color-mix(in srgb, var(--faro-cinza) 22%, transparent);
  --input: color-mix(in srgb, var(--faro-cinza) 28%, transparent);
  --ring: var(--faro-violeta);

  --radius: 0.75rem;

  /* gráficos (tons derivados da paleta) */
  --chart-1: var(--faro-violeta);
  --chart-2: color-mix(in srgb, var(--faro-violeta) 65%, var(--faro-branco));
  --chart-3: color-mix(in srgb, var(--faro-violeta) 55%, var(--faro-indigo));
  --chart-4: var(--faro-cinza);
  --chart-5: color-mix(in srgb, var(--faro-cinza) 50%, var(--faro-indigo));

  /* tipografia */
  --font-sans: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-heading: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
}
```

- **Não introduza cores fora da paleta.** Variações devem sair de `color-mix()` entre as cinco cores ou de opacidade.
- Exceções aceitáveis apenas em mockups funcionais: um tom de verde/vermelho discreto para indicar receita/despesa **só se** for indispensável à leitura — e sempre acompanhado de sinal (+/−) ou rótulo, nunca só pela cor.
- Contraste: texto `--faro-branco` e `--faro-cinza` sobre `--faro-carvao` passam AA. **Não use cinza sobre índigo em texto pequeno** sem checar contraste; use branco frio.

### 3.3 Tipografia

- Uma única família: **Space Grotesk**. Hierarquia por peso e tamanho.
- Escala fluida com `clamp()`:
  - H1 (hero): `clamp(2.5rem, 6vw, 4.5rem)`, peso 700, `letter-spacing: -0.03em`, `line-height: 1.05`
  - H2 (títulos de seção): `clamp(1.875rem, 4vw, 3rem)`, peso 600, `letter-spacing: -0.02em`
  - H3 (cards): `1.25rem`, peso 600
  - Corpo: `1rem`–`1.125rem`, peso 400, `line-height: 1.6`, cor `--foreground`
  - Texto de apoio: cor `--muted-foreground`
  - Eyebrow: `0.875rem`, peso 500, cor `--primary` (ou badge)
- Valores monetários e números de dashboard: `font-variant-numeric: tabular-nums`.
- Largura máxima de parágrafos: ~`65ch`.

### 3.4 Layout e espaçamento

- Mobile-first. Breakpoints: `640px`, `768px`, `1024px`, `1280px`.
- Container: `max-width: 1200px`, `margin-inline: auto`, gutter lateral `1.25rem` (mobile) → `2rem` (desktop).
- Espaçamento vertical entre seções: `clamp(4rem, 10vw, 8rem)`.
- Escala de espaçamento em múltiplos de 4px (`--space-1: .25rem` … `--space-16: 4rem`), definida em `tokens.css`.
- Sem rolagem horizontal em nenhuma largura (testar em 360px).

### 3.5 Direção visual geral

- **O produto é o protagonista.** Mostrar conversa no WhatsApp e o painel web, não ilustrações abstratas de "IA" (cérebros, robôs, circuitos).
- Visual limpo, escuro, com o violeta como único ponto de cor. Brilhos/gradientes sutis em violeta são permitidos como fundo de destaque (hero, CTA final), com moderação.
- Cards com fundo `--card`, borda `--border`, raio `--radius`.
- Animações: entrada suave ao rolar (fade + translate de 12–16px), contadores e barras de gráfico animando ao entrar na tela. Tudo desligado com `@media (prefers-reduced-motion: reduce)`.

### 3.6 Mockups (WhatsApp e painel)

- **Construir os mockups em HTML/CSS**, não como imagens: ficam nítidos, editáveis e leves.
- **Conversa de chat:** balões curtos, horário, mensagens do usuário à direita e do faro à esquerda. Usar a paleta da marca (não copiar pixel a pixel a interface do WhatsApp). Componente reutilizável: `.chat`, `.chat__msg--user`, `.chat__msg--bot`.
- **Painel:** cards de resumo (saldo, receitas, despesas, resultado do mês), gráfico de categorias (barras ou donut em SVG/CSS), lista de últimas movimentações (pode usar `table` do Basecoat), filtros visuais por data/categoria.
- Todo dado numérico em mockup é **fictício e coerente entre si** (o mesmo usuário, o mesmo mês). Exibir o aviso *"Exemplos ilustrativos de funcionamento."* perto dos mockups em que a copy pede.
- Hero: a copy pede um vídeo curto (mensagem no WhatsApp → lançamento no painel → gráfico atualizando). Enquanto o vídeo não existir, implementar essa sequência como **animação HTML/CSS/JS** dentro de um container preparado para receber um `<video autoplay muted loop playsinline>` depois.

---

## 4. Regras de conteúdo (obrigatórias)

1. **Use a copy do `copy.md` literalmente.** Não reescreva, não resuma, não "melhore" títulos. Se achar que algo deveria mudar, sugira no final da resposta, sem aplicar.
2. As **notas e recomendações** dentro da copy (ex.: "Direção visual:", "Nota para a aula:", "Recomendação:", "Objetivo:") são instruções para nós — **não aparecem na página**.
3. **Placeholders entre colchetes** (`[Nome do plano]`, `[Preço do plano]`, respostas 8, 11, 12 e 13 do FAQ etc.) devem continuar visíveis como placeholders, com estilo de marcação (ex.: borda tracejada + cor cinza) e um comentário `<!-- TODO: ... -->` no HTML. Não invente preços, planos, prazos de teste, garantias ou políticas.
4. **Nunca invente:** depoimentos, número de usuários, avaliações, logos de clientes, selos de segurança, certificações, integrações bancárias ou funcionalidades que a copy não menciona.
5. Os textos das conversas de exemplo nos mockups devem refletir só o que a copy descreve: registrar gasto, perguntar total por categoria/período, maiores despesas, resumo do mês, variação percentual entre meses.
6. Segurança (Seção 12): a copy é provisória. Não acrescentar afirmações técnicas (criptografia, LGPD, "dados 100% seguros").

---

## 5. Arquitetura de arquivos

```
/
├── index.html
├── briefing.md
├── copy.md
├── assets/
│   ├── css/
│   │   ├── tokens.css      # paleta, tokens Basecoat, espaçamento, tipografia
│   │   ├── base.css        # reset leve, tipografia global, container, utilitários próprios, animações
│   │   └── sections.css    # estilos por seção, agrupados com comentário /* === Seção N — Nome === */
│   ├── js/
│   │   └── main.js         # menu mobile, scroll suave, header sticky, reveal on scroll, animações de mockup
│   ├── img/                # favicon, og-image, logo (se houver)
│   └── video/              # vídeo do hero (futuro)
```

- Cada seção é um `<section id="..." class="section section--<nome>">` com `aria-labelledby` apontando para o seu H2.
- Um único `<h1>` (no hero).
- Classes próprias em **BEM** (`.hero__title`, `.feature-card__icon`) para não colidir com classes do Basecoat.
- JS sem dependências; usar `IntersectionObserver` para reveal e animações.
- Se `sections.css` passar de ~800 linhas, dividir em `assets/css/sections/<nn>-<nome>.css`.

---

## 6. Mapa de seções

| # | Seção | `id` | Componentes / estrutura | Fundo |
|---|---|---|---|---|
| 0 | Header | — | Logo "faro.ai" (texto), nav, `btn` primário + `btn data-variant="ghost"` ("Entrar"), menu hambúrguer no mobile, sticky com blur | transparente → carvão ao rolar |
| 1 | Hero | `inicio` | Eyebrow (badge), H1, 2 parágrafos, 2 CTAs, mockup animado WhatsApp → painel | carvão + brilho violeta |
| 2 | Dor + solução | `problema` | Texto + 3 cards de demonstração (registra / encontra padrões / decide) + aviso "exemplos ilustrativos" | carvão |
| 3 | A inteligência | `inteligencia` | 3 módulos (organizar, analisar, orientar) conectados a um núcleo "faro.ai" + exemplos de análise ao lado | índigo suave |
| 4 | Um dia com o faro | `como-funciona` | Timeline com 5 momentos, cada um com mini mockup (chat ou painel) | carvão |
| 5 | Demonstração do produto | `demonstracao` | Mockup de chat + mockup do painel lado a lado (ou `tabs`) | carvão |
| 6 | É difícil de usar? | `facil` | 4 exemplos de mensagens em carrossel/lista horizontal de conversas | índigo suave |
| 7 | Inteligência financeira | `funcionalidades` | 4 features (padrões, excessos, períodos, planejar), um insight em destaque por vez | carvão |
| 8 | Painel web | `painel` | Mockup grande do dashboard + lista dos elementos | carvão + brilho |
| 9 | Controle sem complicação | `rotina` | Grid de 4 benefícios com ícone | carvão |
| 10 | Decisões melhores | `decisoes` | Pergunta → dados usados → resposta (fluxo em 3 etapas) | índigo suave |
| 11 | Organização e plataforma | `plataforma` | Grid de 5 cards (bento) | carvão |
| 12 | Segurança e privacidade | `seguranca` | Bloco de texto + CTA secundário, visual sóbrio | índigo suave |
| 13 | Oferta e preço | `planos` | 1 `card` central com lista de recursos, placeholders de preço/condições | carvão + brilho |
| 14 | Prova social | `prova` | Placeholders estruturados (sem depoimentos inventados) | carvão |
| 15 | FAQ | `faq` | `accordion` com 14 perguntas | carvão |
| 16 | CTA final | `comecar` | H2, texto, CTA primário grande, microcopy | gradiente violeta sutil |
| 17 | Footer | — | Marca + tagline + 3 colunas de links + copyright | carvão, borda superior |

**Navegação do header → âncoras:**
- Como funciona → `#como-funciona`
- Funcionalidades → `#funcionalidades`
- Seu painel → `#painel`
- Segurança → `#seguranca`
- FAQ → `#faq`
- "Começar agora" (todos os CTAs primários) → `#planos` por enquanto (`<!-- TODO: link de cadastro -->`)
- "Entrar na minha conta" → `#` com `<!-- TODO: URL do login -->`
- CTAs secundários sem destino definido apontam para a seção mais relacionada (ex.: "Explorar o painel" → `#painel`, "Conhecer nossas práticas de segurança" → `#seguranca`).

Usar `scroll-margin-top` nas seções para compensar o header sticky.

---

## 7. Qualidade e acessibilidade

- HTML semântico (`header`, `nav`, `main`, `section`, `footer`), headings em ordem.
- Contraste mínimo WCAG AA. Foco visível em todos os interativos (anel `--ring`).
- Menu mobile acessível: `aria-expanded`, `aria-controls`, fecha com Esc e ao clicar num link.
- Mockups decorativos: `aria-hidden="true"` ou um `aria-label` resumido; o conteúdo importante deve estar no texto da seção, não só no mockup.
- Ícones decorativos com `aria-hidden="true"`; botões só com ícone têm `aria-label`.
- `<meta name="viewport">`, `<title>`, `<meta name="description">`, Open Graph básicos e favicon (placeholder).
- Imagens/vídeos com `loading="lazy"` (exceto acima da dobra) e dimensões definidas.
- Sem erros no console. Lighthouse alvo: ≥ 90 em Performance, Acessibilidade e Boas práticas.

---

## 8. Como vamos trabalhar

1. A implementação será feita **seção por seção**, um prompt por vez.
2. O primeiro prompt cria a **fundação**: `index.html` com o `<head>` completo, estrutura vazia de todas as seções (com ids), `tokens.css`, `base.css`, `main.js` básico, e uma página de verificação rápida do tema (botões e cards renderizando com a paleta).
3. Em cada prompt de seção:
   - Implemente **apenas** a seção pedida. Não altere outras seções, exceto se for necessário e você explicar o porquê.
   - Reaproveite componentes e classes já criados (chat, mockup de painel, cards).
   - Puxe o texto de `copy.md`, na seção correspondente.
   - Ao terminar, liste em poucas linhas: arquivos alterados, decisões tomadas e TODOs/placeholders deixados.
4. Em caso de dúvida sobre conteúdo ou funcionalidade do produto, **pergunte em vez de inventar**.