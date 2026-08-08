import type { Messages } from './index'

export const es: Messages = {
  label: 'Español',
  lang: 'es',
  link: '/es/',
  description: 'Código abierto de SARO Lab — sistemas distribuidos, herramientas para desarrolladores y bibliotecas. Con licencia MIT.',

  menu_docs: 'Documentación',
  menu_projects: 'Proyectos',
  menu_tool: 'Herramientas',
  nav_prev: 'Anterior',
  nav_next: 'Siguiente',
  page_not_found: 'Página no encontrada',
  open_site: 'Ver sitio',
  open_github: 'GitHub',
  open_npm: 'npm',
  external_link: 'Se abre en una pestaña nueva',
  copy_code: 'Copiar',

  home_tagline: 'Código abierto de SARO Lab',
  home_projects: 'Proyectos',
  home_tools: 'Herramientas',

  proj_dat_tag: 'Distributed Access Token',
  proj_dat_desc:
    'Un sistema de tokens de acceso distribuidos para servicios HTTP sin estado. Un servicio aparte de emisión de claves acaba con el problema de la clave fija, el cifrado de datos viene de serie y un formato binario en lugar de JSON hace que los tokens sean todo lo ligeros y rápidos que pueden ser.',

  proj_ticketing_tag: 'Servidor de bloqueos distribuidos',
  proj_ticketing_desc:
    'Un servicio de bloqueos distribuidos de código abierto y alto rendimiento que controla con precisión el orden en que se ejecutan servidores y procesos. Corta de raíz los fallos de concurrencia que aparecen en el momento en que todo el tráfico llega a la vez: vender de más una cantidad limitada, asignar el mismo asiento dos veces, gastar un cupón en dos sitios.',

  proj_nabi_tag: 'Editor WYSIWYG',
  proj_nabi_desc:
    'Un editor WYSIWYG al que se le ha quitado por completo la dependencia de un framework, de modo que encaja igual de bien en JavaScript puro que en React, Vue o Svelte. La edición de texto, la subida de archivos y la alineación de tablas están desde el primer momento, y tanto las funciones propias como el estilo, hasta el último detalle, quedan en sus manos.',

  proj_unixtime_tag: 'Tiempo Unix sin límites',
  proj_unixtime_desc:
    'Una biblioteca de fechas y zonas horarias que maneja con exactitud todo el rango del tiempo, desde antes de Cristo hasta un futuro sin límite. Cada objeto se mantiene inmutable, lo que impide que la hora media local (LMT) desvíe las fechas antiguas; el análisis de formatos y el manejo de zonas horarias la hacen igual de utilizable desde npm que desde un bundle sin más.',

  live: 'En vivo',
  now: 'Ahora',
  year: 'Año',
  month: 'Mes',
  day: 'Día',
  hour: 'Hora',
  minute: 'Minuto',
  second: 'Segundo',
  seconds: 'Segundos',
  millisecond: 'Milisegundo',

  doc_reference: 'Referencia de la API',
  doc_install: 'Instalación',

  unixtime_timezone: 'Desfase de zona horaria',
  unixtime_timezone_note:
    'No hay base de datos de zonas horarias. Cada API recibe un desfase fijo en minutos, con el mismo signo que Date.prototype.getTimezoneOffset, así que ninguna hora media local se cuela en las fechas antiguas.',
  unixtime_create: 'Crear',
  unixtime_parse: 'Analizar',
  unixtime_parse_note:
    'El análisis sigue el mismo formato que el formateo. Si el formato no encaja, lanza una excepción en lugar de suponer.',
  unixtime_read: 'Unixtime',
  unixtime_read_note: 'El valor vuelve como bigint por defecto; los getters con $ devuelven un number.',
  unixtime_detail: 'Fecha-hora, hora',
  unixtime_detail_note:
    'Prefiera esto a los getters sueltos cuando necesite varios campos: el acarreo se resuelve una sola vez, lo que además mantiene correctas las marcas de tiempo negativas.',
  unixtime_format: 'Formatear',
  unixtime_relative: 'Tiempo relativo',
  unixtime_relative_note:
    'toRelative devuelve el tiempo relativo al momento actual.',
  unixtime_date: 'Fecha',
  unixtime_date_note: 'Todos los valores reciben el desfase como último argumento y, si se omite, usan la zona horaria del navegador.',
  unixtime_week: 'Día de la semana y semana',
  unixtime_week_note:
    'Las funciones de semana normales empiezan en domingo y necesitan un día en la semana; las ISO empiezan en lunes y necesitan cuatro.',
  unixtime_time: 'Hora',
  unixtime_move: 'Desplazar',
  unixtime_move_note: 'Cada instancia es inmutable: cada llamada devuelve una nueva. El mes y el año conservan el día y lo ajustan al último del mes cuando no existe.',
  unixtime_compare: 'Comparar',
  unixtime_compare_note: 'Las comparaciones aceptan cualquier cosa que acepte una factoría, así que un Date o un número sin más no necesitan conversión.',
  unixtime_types: 'Tipos',
}
