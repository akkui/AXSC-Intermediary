# AXSC — Intermediary
Este repositório é referente ao servidor intermediador do AXSC, aqui você tem acesso a toda lógica do servidor e como clonar o mesmo.<br>
Sinta-se livre para realizar modificações e melhorias, melhorias são sempre bem-vindas.

## Lista de Intermediadores Oficiais
- ``axsc.glitch.me`` **[PADRÃO]**
- ``axsc-backup.glitch.me``
- ``axsc.onrender.com``

## Como clonar o servidor?
Da maneira mais simples, você pode criar um clone na hospedagem online gratuíta "Glitch" clicando [aqui](https://glitch.com/edit/#!/remix/axsc).<br>
Nesta ocasião, após clonar, acesse ``Settings`` no canto esquerdo, vá até ``Edit project details`` e copie o ``PROJECT NAME``.<br>
O nome do seu servidor intermediador pessoal será ``SEU-PROJECT-NAME.glitch.me``.
<br><br>
Porém, caso queira, você pode instalar o código-fonte e rodar no seu próprio servidor.<br>
Para isso, instale toda a pasta "intermediary" e salve localmente no seu computador.<br>
Realize a instalação das dependências utilizando ``npm install --save``.<br>
E por fim, configure o ``server.js`` como arquivo padrão de inicialização da sua hospedagem.

## Papel do Intermediador
O servidor intermediador tem como sua principal função reenviar as mensagens para todos os outros usuários conectados por ele. Por mais que o intermediador não possua acesso direto ao conteúdo das mensagens, ele ainda assim pode fornecer potenciais exposição de privacidade dos dados dos usuários conectados por ele. Modifique o código **somente** se você saiba o que você esteja fazendo.
<br><br>
Peço que, por favor, não modifique o código com o propósito de prejudicar a privacidade dos usuários do AXSC, o princípio por trás deste projeto é justamente o acesso livre e democrático a um sistema de conversas sem censura com total liberdade de expressão.
<br><br>
Incentivo a todas pessoas que utilizarem o AXSC à verificar a integridade por trás do intermediador na qual você esteja utilizando, ainda mais se o mesmo não é código-aberto.
Todo esse projeto é público para que possa ser replicado massivamente, garantindo que, mesmo se um intermediador cair, o AXSC se manterá em pé.
