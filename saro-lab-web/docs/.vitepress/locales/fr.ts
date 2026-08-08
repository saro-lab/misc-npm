import type { Messages } from './index'

export const fr: Messages = {
  label: 'Français',
  lang: 'fr',
  link: '/fr/',
  description: 'Open source par SARO Lab — systèmes distribués, outils pour développeurs et bibliothèques. Sous licence MIT.',

  menu_docs: 'Documentation',
  menu_projects: 'Projets',
  menu_tool: 'Outils',
  nav_prev: 'Précédent',
  nav_next: 'Suivant',
  page_not_found: 'Page introuvable',
  open_site: 'Voir le site',
  open_github: 'GitHub',
  open_npm: 'npm',
  external_link: 'Ouvre dans un nouvel onglet',
  copy_code: 'Copier',

  home_tagline: 'Open source par SARO Lab',
  home_projects: 'Projets',
  home_tools: 'Outils',

  proj_dat_tag: 'Distributed Access Token',
  proj_dat_desc:
    'Un système de jetons d’accès distribués pour les services HTTP sans état. Un service distinct de délivrance de clés élimine le problème de la clé fixe, le chiffrement des données est assuré par défaut, et un format binaire plutôt que JSON rend les jetons aussi légers et aussi rapides que possible.',

  proj_ticketing_tag: 'Serveur de verrous distribués',
  proj_ticketing_desc:
    'Un service open source de verrous distribués, très performant, qui contrôle précisément l’ordre d’exécution des serveurs et des processus. Il bloque les défaillances de concurrence qui surgissent au moment où tout le trafic arrive d’un coup — survente d’une quantité limitée, même siège attribué deux fois, coupon dépensé à deux endroits.',

  proj_nabi_tag: 'Éditeur WYSIWYG',
  proj_nabi_desc:
    'Un éditeur WYSIWYG dont la dépendance à un framework a été entièrement supprimée : il s’intègre aussi bien au JavaScript natif qu’à React, Vue ou Svelte. Édition de texte, envoi de fichiers et alignement des tableaux sont là dès le départ, et l’ajout de fonctionnalités sur mesure comme le style, jusqu’au moindre détail, vous appartiennent.',

  proj_unixtime_tag: 'Temps Unix sans limites',
  proj_unixtime_desc:
    'Une bibliothèque de dates et de fuseaux horaires qui traite exactement toute l’étendue du temps, d’avant J.-C. à un futur sans borne. Chaque objet reste immuable, ce qui empêche l’heure moyenne locale (LMT) de fausser les dates anciennes ; l’analyse des formats et la gestion des fuseaux la rendent aussi utilisable depuis npm que depuis un bundle classique.',

  live: 'En direct',
  now: 'Maintenant',
  year: 'Année',
  month: 'Mois',
  day: 'Jour',
  hour: 'Heure',
  minute: 'Minute',
  second: 'Seconde',
  seconds: 'Secondes',
  millisecond: 'Milliseconde',

  doc_reference: 'Référence de l’API',
  doc_install: 'Installation',

  unixtime_timezone: 'Décalage de fuseau horaire',
  unixtime_timezone_note:
    'Il n’y a pas de base de données de fuseaux horaires. Chaque API prend un décalage fixe en minutes, avec le même signe que Date.prototype.getTimezoneOffset — ainsi aucune heure moyenne locale ne s’infiltre dans les dates anciennes.',
  unixtime_create: 'Créer',
  unixtime_parse: 'Analyser',
  unixtime_parse_note:
    'L’analyse suit le même format que le formatage. En cas de format non conforme, une exception est levée plutôt qu’une supposition.',
  unixtime_read: 'Unixtime',
  unixtime_read_note: 'La valeur revient par défaut sous forme de bigint ; les accesseurs préfixés de $ renvoient un number.',
  unixtime_detail: 'Date-heure, heure',
  unixtime_detail_note:
    'Préférez ceci aux accesseurs individuels lorsqu’il vous faut plusieurs champs — la retenue est résolue une seule fois, ce qui garde aussi les horodatages négatifs justes.',
  unixtime_format: 'Formater',
  unixtime_relative: 'Temps relatif',
  unixtime_relative_note:
    'toRelative renvoie le temps relatif à l’instant présent.',
  unixtime_date: 'Date',
  unixtime_date_note: 'Chaque valeur prend le décalage en dernier argument et, à défaut, utilise le fuseau du navigateur.',
  unixtime_week: 'Jour de la semaine et numéro de semaine',
  unixtime_week_note:
    'Les fonctions de semaine ordinaires commencent le dimanche et exigent un jour dans la semaine ; les fonctions ISO commencent le lundi et en exigent quatre.',
  unixtime_time: 'Heure',
  unixtime_move: 'Déplacer',
  unixtime_move_note: 'Chaque instance est immuable — chaque appel en renvoie une nouvelle. Le mois et l’année conservent le jour, ramené au dernier du mois lorsqu’il n’existe pas.',
  unixtime_compare: 'Comparer',
  unixtime_compare_note: 'Les comparaisons acceptent tout ce qu’accepte une fabrique : un Date ou un simple nombre n’a donc pas besoin d’être converti.',
  unixtime_types: 'Types',
}
