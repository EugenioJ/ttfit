# Plano — TTFIT estático

## Escopo e arquitetura

Evoluir o site existente sem redesenhar o produto: preservar vermelho TTFIT, carvão e marfim, o wordmark, a hierarquia editorial e a responsividade. O projeto continuará em HTML, CSS e JavaScript no navegador e compatível com hospedagem estática. Não haverá conexão com o MySQL do professor nem com o servidor PHP, habilitação de servidor ou banco Manus, inclusão de Python ou publicação nesta etapa.

Manter a conta de teste `teste@gmail.com` / `teste`, preenchida manualmente, sem botão de acesso automático. Na interface, não exibir rótulos que identifiquem o site como demonstração nem mensagens sobre dados armazenados localmente, ranking fictício ou dados locais. Não afirmar que há sincronização em nuvem ou que o ranking reflete dados reais. A recuperação por e-mail não envia mensagem. O nome da conta de teste será Fratta.

## Comportamento das telas

- `index.html`: validar e-mail e senha; mostrar as credenciais da conta de teste sem atalho de preenchimento; manter “lembrar meu acesso”; abrir cadastro ao clicar em “Cadastrar nova conta”; validar os campos; manter a recuperação por e-mail sem envio de mensagem; não exibir explicações sobre armazenamento ou backend.
- `dashboard.html`: exibir peso, altura, idade, foco e dias de exercício, além da prévia de atividades sem rótulo de ranking fictício ou dados locais; retirar o editor rápido. O nome do usuário, Fratta na conta de teste, abre um menu `<details>` no mesmo padrão visual do controle de idioma, com acesso a Perfil e a ação Sair.
- `perfil.html`: ser acessada pelo menu do nome do usuário e conter a edição de peso, altura, idade, foco, nível de atividade e dias de exercício. Validar e salvar os campos no armazenamento do navegador; ao retornar à Visão geral, os indicadores refletem os dados salvos. Sair encerra a sessão e retorna ao login.
- `alimentos.html`: pesquisar abacate cru, peito de frango sem pele cozido, arroz tipo 1 cozido, feijão carioca cozido e macarrão de trigo refinado cozido e drenado sem óleo e sem sal. Exibir, por 100 g, energia, proteínas, carboidratos, gorduras totais e saturadas, fibras, sódio, colesterol, cálcio, ferro e potássio; indicar açúcares somente quando a fonte discriminar. Mostrar preparo, fonte e mensagem quando não houver correspondência; “não informado” não será tratado como zero.
- `comunidade.html`: ser página independente com a lista semanal; não exibir rótulos de ranking fictício nem mensagens sobre dados locais, não afirmar que os dados são reais ou sincronizados e não mostrar informações privadas do perfil.

## Estrutura do projeto

- `index.html`, `dashboard.html`, `perfil.html`, `alimentos.html`, `comunidade.html`: páginas do site.
- `styles.css`: tokens, componentes existentes, menus acessíveis, página Perfil e responsividade.
- `js/demo-store.js`, `js/auth.js`, `js/user-menu.js`, `js/dashboard.js`, `js/perfil.js`, `js/alimentos.js`, `js/comunidade.js`: sessão e perfis no navegador, validações, menu do usuário, pesquisa e interações.
- `food-data.json`: referências nutricionais por 100 g, preparo, valores não informados e fontes.
- `manus-routes.json`: manifesto sincronizado com as rotas HTML, inclusive Perfil.
- `dist/`: build estático com as páginas, CSS, scripts, catálogo e manifesto.

## Direção visual e limites

Reutilizar a estética editorial esportiva já aprovada: vermelho TTFIT `#E5483F`, preto/carvão e marfim; leitura rápida, acolhedora e sem promessas clínicas; navegação lateral e adaptação em coluna no celular; tipografia e elementos atuais. O menu do usuário reutiliza o padrão de `<details>` do controle de idioma. Não introduzir mudanças severas no padrão visual. Manter o aviso de que informações de saúde não substituem orientação profissional, sem acrescentar alegações de sincronização ou autenticidade dos dados.

Não executar migrações, não acessar o banco do professor, não incluir Python ou serviço de backend e não habilitar infraestrutura de servidor/banco da Manus. A publicação da versão alterada permanece bloqueada até autorização explícita posterior. O código será salvo como checkpoint do projeto, sem acionar publicação ou conectar ao GitHub do usuário.
