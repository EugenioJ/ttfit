# Plano — TTFIT

## Escopo da primeira etapa

Entregar três páginas responsivas para o protótipo TTFIT: acesso/cadastro (`index.html`), painel principal (`dashboard.html`) e consulta alimentar (`alimentos.html`). Usar HTML5 semântico e CSS3, sem JavaScript, frameworks, backend, banco de dados ou automação nutricional. O formulário de acesso e a navegação demonstram fluxos estáticos; valores exibidos são dados de demonstração. A pesquisa alimentar apresenta um alimento-exemplo com valores de referência por 100 g, sem alegar consulta a uma base dinâmica nem reconhecimento por imagem. A referência documental mais recente é PROJETOTTFIT-REV05.docx, que mantém o contexto do TTFIT como ferramenta prática de acompanhamento alimentar e físico para pessoas com pouco tempo. A comparação com REV04 não apontou mudanças nas funcionalidades relevantes para estas telas; o pedido inicial da etapa continua definindo as três telas e os campos específicos. A visão mais ampla do artigo — cálculo energético, dieta sugerida, metas, reconhecimento de imagem e relatórios — permanece fora desta entrega.

## Implementação e estrutura

- `index.html`: acesso por e-mail e senha, lembrar acesso, recuperação de senha e cadastro no mesmo documento.
- `dashboard.html`: resumo do perfil, atalho HTML para edição rápida, botão de consulta alimentar e ranking semanal estático.
- `alimentos.html`: campo e ação de pesquisa, resultado ilustrativo com nutrientes por 100 g e link de volta.
- `styles.css`: sistema visual compartilhado, componentes e regras responsivas para desktop, tablet e celular.
- `assets/`: cópia local da foto ilustrativa de abacate; a interface publicada usa a cópia enviada ao armazenamento do projeto.
- `manus-routes.json`: manifesto das três páginas.
- `app.config.ts`: metadado técnico da plataforma para a identidade do projeto; não participa do código funcional do site.
- `dist/`: saída estática criada pelo comando de publicação, copiando as três páginas, CSS e manifesto sem compilação ou dependências.

No Preview, um servidor HTTP simples serve os arquivos da raiz. Na publicação, um comando autocontido copia os arquivos para `dist/`; a hospedagem recebe `index.html` nessa pasta. O site permanece estático e o código funcional da interface usa exclusivamente HTML5 e CSS3. Nenhum formulário, seletor de idioma, ranking, cálculo de dieta ou busca de alimentos será apresentado como serviço dinâmico nesta etapa.

## Direção visual

Três estilos foram considerados (probabilidades baixas amostradas): editorial brutalista esportivo — 0,06; minimalismo cívico de alto contraste — 0,04; painel atlético inspirado em impressão risográfica — 0,03. Escolhido: **editorial brutalista esportivo**, uma interface de saúde direta e enérgica que mantém a legibilidade de um painel de acompanhamento.

- **Movimento de design:** editorial esportivo contemporâneo, com tipografia e blocos de informação inspirados em capas e sinalização de treino.
- **Princípios centrais:** leitura rápida; contraste acessível; linguagem acolhedora, sem julgamento; indicadores claramente identificados como dados de exemplo.
- **Filosofia de cor:** vermelho vivo para chamadas e progresso, preto/carvão para estrutura, marfim para conforto de leitura e tons cinza para conteúdo secundário. O vermelho mantém a energia do pedido sem transformar toda a tela em uma superfície de alerta.
- **Paradigma de layout:** composição editorial assimétrica, com navegação enxuta, uma área principal de leitura e blocos laterais que se reorganizam em coluna no celular.
- **Elementos distintivos:** emblema gráfico de pulso/folha no wordmark TTFIT; numeração editorial ampla; acentos vermelhos e linhas finas que conectam informações de saúde e comunidade.
- **Filosofia de interação:** navegação por links HTML; controles nativos; foco visível; seções expansíveis com elementos HTML; submissões ilustrativas sem persistência.
- **Animação:** transições curtas de cor e elevação em hover/foco; nenhuma animação essencial; respeitar `prefers-reduced-motion`.
- **Tipografia:** system-ui/Inter como sans-serif principal, com pesos e tamanhos distintos para títulos e valores; fonte condensada do sistema apenas em rótulos compactos.
- **Essência da marca:** acompanhamento simples de alimentação e movimento, feito para quem precisa cuidar da saúde sem complicar a rotina. Personalidade: prática, acolhedora, coletiva.
- **Voz:** convites objetivos, encorajadores e sem promessas clínicas. Exemplos: “Seu ritmo já é um bom começo.” e “Cada passo conta para você e para a comunidade.”
- **Wordmark e marca:** lettering TTFIT em caixa alta, acompanhado por emblema gráfico simples de pulso e folha.
- **Cor de assinatura:** vermelho TTFIT `#E5483F`.

## Estrutura de publicação

O host de Preview está configurado na porta 3000. O manifesto declara a raiz e os dois arquivos HTML. O build de publicação, sem dependências, copia `index.html`, `dashboard.html`, `alimentos.html`, `styles.css` e `manus-routes.json` para `dist/`. O projeto é apenas leitura estática; formulários, seletor de idioma e dados exibidos são demonstrativos. A tela de consulta usa o exemplo TACO de abacate cru: 96 kcal e 1,2 g de proteína por 100 g; a tabela não discrimina açúcares para esse alimento.


Os arquivos estáticos de URL fixa (`index.html`, `dashboard.html`, `alimentos.html`, `styles.css` e `manus-routes.json`) são servidos com `no-cache`, evitando reutilização de versões antigas após atualizações.
