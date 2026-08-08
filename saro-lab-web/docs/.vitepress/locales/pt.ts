import type { Messages } from './index'

export const pt: Messages = {
  label: 'Português',
  lang: 'pt',
  link: '/pt/',
  description: 'Código aberto da SARO Lab — sistemas distribuídos, ferramentas para desenvolvedores e bibliotecas. Licenciado sob MIT.',

  menu_docs: 'Documentação',
  menu_projects: 'Projetos',
  menu_tool: 'Ferramentas',
  nav_prev: 'Anterior',
  nav_next: 'Próximo',
  page_not_found: 'Página não encontrada',
  open_site: 'Ver site',
  open_github: 'GitHub',
  open_npm: 'npm',
  external_link: 'Abre em uma nova aba',
  copy_code: 'Copiar',

  home_tagline: 'Código aberto da SARO Lab',
  home_projects: 'Projetos',
  home_tools: 'Ferramentas',

  proj_dat_tag: 'Distributed Access Token',
  proj_dat_desc:
    'Um sistema de tokens de acesso distribuídos para serviços HTTP sem estado. Um serviço à parte para emissão de chaves resolve o problema da chave fixa, a criptografia dos dados vem por padrão e um formato binário em vez de JSON deixa os tokens tão leves e tão rápidos quanto podem ser.',

  proj_ticketing_tag: 'Servidor de bloqueios distribuídos',
  proj_ticketing_desc:
    'Um serviço de bloqueios distribuídos de código aberto e alto desempenho que controla com precisão a ordem em que servidores e processos são executados. Ele barra por completo as falhas de concorrência que surgem no instante em que todo o tráfego chega de uma vez: vender além da quantidade limitada, atribuir o mesmo assento duas vezes, gastar um cupom em dois lugares.',

  proj_nabi_tag: 'Editor WYSIWYG',
  proj_nabi_desc:
    'Um editor WYSIWYG com a dependência de framework removida por completo, de modo que se encaixa tão bem em JavaScript puro quanto em React, Vue ou Svelte. Edição de texto, upload de arquivos e alinhamento de tabelas estão lá desde o começo, e tanto os recursos próprios quanto a estilização, até o último detalhe, ficam por sua conta.',

  proj_unixtime_tag: 'Tempo Unix sem limites',
  proj_unixtime_desc:
    'Uma biblioteca de datas e fusos horários que trata com exatidão toda a extensão do tempo, de antes de Cristo a um futuro sem limite. Todo objeto permanece imutável, o que impede que a hora média local (LMT) distorça datas antigas; a análise de formatos e o suporte a fusos a tornam tão utilizável a partir do npm quanto de um bundle comum.',

  live: 'Ao vivo',
  now: 'Agora',
  year: 'Ano',
  month: 'Mês',
  day: 'Dia',
  hour: 'Hora',
  minute: 'Minuto',
  second: 'Segundo',
  seconds: 'Segundos',
  millisecond: 'Milissegundo',

  doc_reference: 'Referência da API',
  doc_install: 'Instalação',

  unixtime_timezone: 'Deslocamento de fuso horário',
  unixtime_timezone_note:
    'Não há banco de dados de fusos horários. Toda API recebe um deslocamento fixo em minutos, com o mesmo sinal de Date.prototype.getTimezoneOffset — assim nenhuma hora média local se infiltra em datas antigas.',
  unixtime_create: 'Criar',
  unixtime_parse: 'Analisar',
  unixtime_parse_note:
    'A análise segue o mesmo formato da formatação. Se o formato não bate, lança uma exceção em vez de adivinhar.',
  unixtime_read: 'Unixtime',
  unixtime_read_note: 'O valor volta como bigint por padrão; os getters prefixados com $ devolvem um number.',
  unixtime_detail: 'Data-hora, hora',
  unixtime_detail_note:
    'Prefira isto aos getters individuais quando precisar de vários campos — o transporte é resolvido de uma só vez, o que também mantém corretos os carimbos de tempo negativos.',
  unixtime_format: 'Formatar',
  unixtime_relative: 'Tempo relativo',
  unixtime_relative_note:
    'toRelative devolve o tempo relativo ao momento atual.',
  unixtime_date: 'Data',
  unixtime_date_note: 'Todos os valores recebem o deslocamento como último argumento e, se omitido, usam o fuso do navegador.',
  unixtime_week: 'Dia da semana e semana',
  unixtime_week_note:
    'As funções de semana comuns começam no domingo e exigem um dia na semana; as ISO começam na segunda-feira e exigem quatro.',
  unixtime_time: 'Hora',
  unixtime_move: 'Deslocar',
  unixtime_move_note: 'Cada instância é imutável — cada chamada devolve uma nova. Mês e ano preservam o dia, ajustando-o para o último do mês quando ele não existe.',
  unixtime_compare: 'Comparar',
  unixtime_compare_note: 'As comparações aceitam tudo o que uma fábrica aceita, então um Date ou um número puro não precisa de conversão.',
  unixtime_types: 'Tipos',
}
