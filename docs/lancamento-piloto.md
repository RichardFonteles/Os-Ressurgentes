# Lançamento Os Ressurgentes — cópia para revisão

## Oferta implementada

- Homens e mulheres em uma nova fase; rodadas mistas.
- Dez rodadas de quatro participantes: capacidade planejada de 40 pessoas.
- R$250 por participante no piloto.
- 60 minutos de entrevista individual, 240 minutos de Jogo do Herói coletivo misto e 60 minutos de plano coletivo.
- Apoio de IA por 30 dias, separado das seis horas de encontros. Sem promessa de atendimento humano contínuo.
- Três vídeos de 30 segundos: mulheres, homens e misto. Roteiros em `videos-30s.md`. O filme misto ilustrativo de 30s está incorporado à LP. As versões masculina e feminina ficam reservadas ao lançamento e à divulgação em grupos, Instagram, TikTok e outros canais.

## Estado desta versão

Pré-lançamento. Sem publicação no Lovable. Sem pagamento, formulário de leads ou pixels de publicidade habilitados. O contato abre o WhatsApp já usado pela página original e não confirma reserva nem inscrição. Os links das duas contas são públicos; não comprovam conexão para publicação.

`src/lib/launch-config.ts` centraliza preço, capacidade, contato e checkout. A compra só aparece quando `salesApproved` é `true` e `checkoutUrl` contém uma URL HTTPS válida. Não colocar chaves ou credenciais neste arquivo.

## Antes de liberar compras

1. Confirmar R$250 por pessoa, elegibilidade, responsável pela oferta e contato formal. Definir atendimento online/presencial, datas, horários, fuso, local/plataforma e agenda das entrevistas. Confirmar se a entrevista é entrega após a compra ou triagem anterior; se for triagem, informar isso antes do pagamento.
2. Escolher checkout, criar produto e testar valor, moeda BRL, identidade do vendedor, métodos de pagamento e confirmação. Definir cancelamentos, remarcação e o procedimento para rodada incompleta.
3. Controlar capacidade por rodada no servidor. Confiar na confirmação autenticada do provedor, não em uma página de sucesso ou parâmetro na URL. Testar pagamentos aprovados, pendentes, recusados e repetidos, reembolso e recebimento repetido do mesmo evento.
4. Definir canal, fornecedor, início, término e limites do apoio de IA. Informar dados enviados ao fornecedor, retenção, exclusão e suporte. Não enviar entrevistas ou relatos ao grupo/IA automaticamente. Testar revogação de acesso ao final dos 30 dias.
5. Completar política de privacidade e condições com dados reais do responsável e serviços efetivamente usados. O aviso atual cobre a etapa de contato e não é uma política completa de checkout, leads ou IA.
6. Se houver captura de leads: criar backend, acesso restrito, confirmação só após gravação real, validação, proteção contra abuso, opt-in de marketing separado e procedimento de exclusão. Não enviar relatos, telefone ou e-mail em URLs e métricas.
7. Identificar origem com UTMs distintas por conta e peça. Implementar `lead` somente após captura confirmada, `begin_checkout` ao iniciar o checkout e `purchase` no servidor após confirmação do pagamento, deduplicado pelo pedido. Validar consentimento e ausência de identificadores pessoais nos eventos.
8. Conectar e conferir @heroi.me e @richardfonteles1 no serviço de publicação. Revisar legendas, links, direitos de música, imagens e vozes. Autorizações de imagem/depoimento devem ser específicas. Não usar atores de IA como clientes reais.
9. Revisar no celular e desktop: menu, foco, manifesto, perguntas, âncoras, links externos, sem rolagem horizontal e legibilidade sem JavaScript.
10. Só então preencher checkout e liberar vendas; revisar a prévia no Lovable e publicar após autorização.

## Atualização futura no Lovable

O repositório encontrado estava vazio; portanto não foi presumida sincronização. `backup/lp-atual-2026-10-29` preserva a referência importada. A nova LP foi desenvolvida em `lancamento/piloto-misto`, com revisão no pull request #1, para integrar à `main` antes da atualização no Lovable.

A cópia preserva os arquivos de texto do projeto original e os arquivos de imagem necessários para a rota publicada. Imagens locais antigas e recursos históricos do diretório Remotion que não são usados pela rota atual não foram todos exportados. O vídeo remoto herdado continua referenciado na versão original e exige disponibilidade do seu serviço de hospedagem. A nova LP usa somente o filme misto de 30 segundos em `public/media`; não usa o vídeo antigo.

Ao integrar no Lovable, confirmar o projeto `406d1bb9-be16-4c88-8bff-8fa60af86abe` e a origem do repositório antes de conectar. Não substituir a página publicada automaticamente. As imagens usadas pela página estão incluídas; os caminhos `/__l5e/assets-v1/` têm cópias em `public` para a portabilidade da página.

## Capacidade e operação

40 entrevistas de uma hora + dez rodadas coletivas de cinco horas = 90 horas de atendimento, além de preparação, suporte e administração. Receita bruta máxima do piloto: R$10.000. O prazo de lançamento não deve ser confundido com a entrega de todas as rodadas e dos 30 dias de IA.
