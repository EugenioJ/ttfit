# Plano — TTFIT estático funcional

## Escopo e arquitetura

Evoluir as páginas estáticas existentes sem redesenhar o produto: preservar vermelho TTFIT, carvão e marfim, o wordmark, a hierarquia editorial e a responsividade. Esta etapa não fará conexão com o MySQL do professor nem com o servidor PHP existente; também não habilitará servidor ou banco da Manus, não incluirá código Python e não publicará a nova versão.

O site continuará estático, com HTML, CSS e JavaScript no navegador. A conta de apresentação `teste@gmail.com` / `teste` estará pré-configurada e poderá ser acessada digitando as credenciais manualmente; não haverá botão para preencher ou entrar automaticamente na conta. Cadastro, sessão e perfil ficarão no navegador. Edições de perfil poderão persistir no `localStorage` daquele navegador, sem sincronização entre dispositivos ou usuários. A interface deve informar que esse acesso não é autenticação real, que os dados são locais e que não se deve usar senha real. A recuperação de senha não enviará e-mail.

## Comportamento das telas

- `index.html`: validar e-mail e senha; mostrar as credenciais da conta de apresentação, sem atalho para preenchê-las; permitir entrar após digitação; abrir o cadastro automaticamente ao clicar em “Cadastrar nova conta”; validar campos obrigatórios e criar perfil apenas para uso local. A recuperação deve informar que não envia e-mail nesta versão.
- `dashboard.html`: exibir o perfil de apresentação ou o perfil local cadastrado; permitir editar peso, altura, idade, foco, nível de atividade e dias de exercício; validar e atualizar os indicadores imediatamente após salvar, persistindo no `localStorage` deste navegador. Identificar os dados como locais.
- `alimentos.html`: pesquisar por nome e variação sem acentos entre abacate cru, peito de frango sem pele cozido, arroz tipo 1 cozido, feijão carioca cozido e macarrão de trigo refinado cozido e drenado sem óleo e sem sal. Exibir, por 100 g, energia, proteína, carboidratos, gorduras totais e saturadas, fibras, sódio, colesterol, cálcio, ferro e potássio; indicar açúcares somente quando a fonte discriminar. Mostrar preparo, fonte e mensagem quando não houver correspondência; “não informado” não deve ser tratado como zero.
- `comunidade.html`: criar uma página separada, acessível pela navegação, com ranking fictício claramente identificado como dados de apresentação. Não sugerir publicação ou compartilhamento com outros usuários nem mostrar informações privadas do perfil.

## Estrutura do projeto

- `index.html`, `dashboard.html`, `alimentos.html`, `comunidade.html`: páginas do site.
- `styles.css`: tokens e componentes existentes, com complementos responsivos mínimos.
- `js/demo-store.js`, `js/auth.js`, `js/dashboard.js`, `js/alimentos.js`, `js/comunidade.js`: validação, armazenamento local demonstrativo, pesquisa e interações.
- `food-data.json`: referências nutricionais verificadas por 100 g, preparo, valores não informados e fontes.
- `manus-routes.json`: manifesto sincronizado com as rotas HTML.
- `dist/`: build estático com páginas, CSS, scripts, dados nutricionais e manifesto.

## Direção visual e limites

Reutilizar a estética editorial esportiva já aprovada: vermelho TTFIT `#E5483F`, preto/carvão e marfim; leitura rápida, acolhedora e sem promessas clínicas; composição editorial com navegação lateral e adaptação em coluna no celular; tipografia atual e foco acessível. Não substituir imagens existentes nem criar decoração adicional. A edição, a busca alimentar, o cadastro e a página de comunidade devem parecer partes do mesmo site. Usar mensagens curtas que diferenciem claramente armazenamento local de autenticação/armazenamento reais.

Não executar migrações, não acessar o banco do professor, não incluir Python ou serviço de backend e não habilitar infraestrutura de servidor/banco da Manus nesta etapa. A publicação da versão alterada permanece bloqueada até autorização explícita posterior.