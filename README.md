# Sistema de geração de receitas médicas com auxílio de IA
## Projeto
### IA
Interface onde o usuário anexa documentos,laudos caso necessário, e documento de anamnésia (Em uma opção, um botão provavelmente)

Descreve os sintomas que o paciente está sentindo, que é dito pra ele na hora (Campo onde ele digita, sem limite de caracteres)

Recolher arquivos e o que foi digitado e mandar pro backend, onde será enviado em um prompt personalizado pro chatGPT, onde será pedido um diagnóstico com possíveis doenças/síndromes que o paciente possa ter, baseado nos documentos e no que foi descrito.
Isso será gerado com tópicos, com uma breve descrição do motivo

Após isso será redirecinado para outra página, onde terá em tela o resultado da pesquisa feita pelo GPT, onde ele poderá escolher uma das opções cedidas pelo chat, ou escrever sua própria
Selecionando o diagnóstico, será novamente enviado pro backend, onde o chatGPT irá gerar uma lista de possíveis medicamentos e tratamentos, também levando em conta os documentos do paciente (alergias, etc)

Então o usuário poderá selecionar uma delas, ou escrever sua própria, acabando aqui a parte da IA e geração.

### Geração de receitas
Por padrão, terá um documento base indexado, que é o padrão da receita (Isso já padrão do aplicativo, subtende-se que já foi configurado previamente)

Os dados serão enviados da parte anterior (Nome, medicamento, orientação de uso, etctc)
O programa irá pegar esses dados e inserir no documento que está indexado, cada coisa em seu devido lugar (As informações deverão ser passadas seguindo um padrão, separando cada campo pro aplicativo saber o que fazer)

Após isso, o documento irá aparecer na tela do usuário, onde ele poderá editar alguma informação, caso não queira, ele apenas confirma e o documento é "assinado", gerando um PDF pro usuário baixar ou imprimir
Esse documento também fica salvo em uma base de dados, podendo ser acessado a qualquer momento que o usuário queira, mas não modificado.