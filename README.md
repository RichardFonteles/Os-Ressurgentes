# Os Ressurgentes — LP de entrevista

Landing page para homens e mulheres em uma nova fase, com entrevista individual, Jogo do Herói em grupo misto de quatro pessoas, plano coletivo e apoio de IA por 30 dias.

A comunicação pública leva à solicitação de entrevista pelo WhatsApp. O investimento e as condições devem ser apresentados antes de contratar. A página não anuncia gratuidade nem confirma agendamento, reserva ou compra.

## Executar

```sh
npm install
npm run dev
npm run build
```

## Vídeo da LP

Somente a versão mista está incorporada, em `public/media/os-ressurgentes-misto-30s.mp4`: 30 segundos, Full HD horizontal, locução sintética em português e imagem ilustrativa animada. Poster e legendas VTT acompanham o vídeo. Não há reprodução automática.

A produção mais recente foi executada localmente com MoviePy e Piper. As versões feminina e masculina ficam para divulgação externa. O renderizador antigo em `scripts/render-mixed-video.py` foi substituído; não regenerar o arquivo atual por ele.

## Operação

`src/lib/launch-config.ts` centraliza o contato e os perfis sociais. O checkout permanece fora do fluxo público atual. Captura de leads, confirmação de agendamento e conversão de pagamento ainda precisam de integração própria; um clique no WhatsApp não comprova esses eventos.

O GitHub deve receber os arquivos antes de qualquer atualização no Lovable. A conexão entre repositório e projeto precisa ser verificada, sem presumir sincronização automática.

A referência inicial está preservada na branch `backup/lp-atual-2026-10-29`. Veja `docs/integracao-video-narrado.md` para o estado desta revisão e as condições pendentes de publicação.
