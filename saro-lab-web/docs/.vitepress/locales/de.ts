import type { Messages } from './index'

export const de: Messages = {
  label: 'Deutsch',
  lang: 'de',
  link: '/de/',
  description: 'Open Source von SARO Lab — verteilte Systeme, Entwicklerwerkzeuge und Bibliotheken. MIT-lizenziert.',

  menu_docs: 'Dokumentation',
  menu_projects: 'Projekte',
  menu_tool: 'Werkzeuge',
  nav_prev: 'Zurück',
  nav_next: 'Weiter',
  page_not_found: 'Seite nicht gefunden',
  open_site: 'Website besuchen',
  open_github: 'GitHub',
  open_npm: 'npm',
  external_link: 'Wird in einem neuen Tab geöffnet',
  copy_code: 'Kopieren',

  home_tagline: 'Open Source von SARO Lab',
  home_projects: 'Projekte',
  home_tools: 'Werkzeuge',

  proj_dat_tag: 'Distributed Access Token',
  proj_dat_desc:
    'Ein verteiltes Access-Token-System für zustandslose HTTP-Dienste. Ein eigener Dienst zur Schlüsselausgabe räumt das Problem fester Schlüssel aus dem Weg, Datenverschlüsselung ist von Haus aus dabei, und ein Binärformat statt JSON macht die Token so leicht und so schnell, wie sie nur sein können.',

  proj_ticketing_tag: 'Verteilter Sperrserver',
  proj_ticketing_desc:
    'Ein hochperformanter Open-Source-Dienst für verteilte Sperren, der die Reihenfolge steuert, in der Server und Prozesse laufen. Er blockt genau die Nebenläufigkeitsfehler ab, die in dem Moment auftreten, in dem der gesamte Verkehr auf einmal eintrifft — der Überverkauf einer begrenzten Menge, derselbe zweimal vergebene Sitzplatz, ein Gutschein an zwei Stellen zugleich.',

  proj_nabi_tag: 'WYSIWYG-Editor',
  proj_nabi_desc:
    'Ein WYSIWYG-Editor, dem die Framework-Abhängigkeit vollständig genommen wurde, sodass er sich in reines JavaScript genauso einfügt wie in React, Vue oder Svelte. Textbearbeitung, Datei-Upload und Tabellenausrichtung sind von Anfang an da, und sowohl eigene Funktionen als auch das Styling bis ins letzte Detail schreiben Sie selbst.',

  proj_unixtime_tag: 'Unix-Zeit ohne Grenzen',
  proj_unixtime_desc:
    'Eine Datums- und Zeitzonenbibliothek, die jeden Zeitraum exakt behandelt — von vor Christus bis in eine unbegrenzte Zukunft. Jedes Objekt bleibt unveränderlich, wodurch keine lokale mittlere Zeit (LMT) alte Daten verfälscht; Formatparsing und Zeitzonenunterstützung machen sie über npm ebenso brauchbar wie in einem einfachen Bundle.',

  live: 'Live',
  now: 'Jetzt',
  year: 'Jahr',
  month: 'Monat',
  day: 'Tag',
  hour: 'Stunde',
  minute: 'Minute',
  second: 'Sekunde',
  seconds: 'Sekunden',
  millisecond: 'Millisekunde',

  doc_reference: 'API-Referenz',
  doc_install: 'Installation',

  unixtime_timezone: 'Zeitzonen-Offset',
  unixtime_timezone_note:
    'Es gibt keine Zeitzonendatenbank. Jede API nimmt einen festen Offset in Minuten entgegen, mit demselben Vorzeichen wie Date.prototype.getTimezoneOffset — so gerät keine lokale mittlere Zeit in alte Daten.',
  unixtime_create: 'Erzeugen',
  unixtime_parse: 'Parsen',
  unixtime_parse_note:
    'Das Parsen folgt demselben Format wie die Formatierung. Passt das Format nicht, wird eine Ausnahme geworfen statt geraten.',
  unixtime_read: 'Unixtime',
  unixtime_read_note: 'Der Wert kommt standardmäßig als bigint zurück; die Getter mit $ liefern eine number.',
  unixtime_detail: 'Datum-Zeit, Zeit',
  unixtime_detail_note:
    'Wenn Sie mehrere Felder brauchen, nehmen Sie das hier statt der einzelnen Getter — der Übertrag wird einmal aufgelöst, was auch negative Zeitstempel korrekt hält.',
  unixtime_format: 'Formatieren',
  unixtime_relative: 'Relative Zeit',
  unixtime_relative_note:
    'toRelative gibt die Zeit relativ zum Jetzt zurück.',
  unixtime_date: 'Datum',
  unixtime_date_note: 'Jeder Wert nimmt den Offset als letztes Argument und fällt sonst auf die Zeitzone des Browsers zurück.',
  unixtime_week: 'Wochentag und Kalenderwoche',
  unixtime_week_note:
    'Die einfachen Wochenfunktionen beginnen am Sonntag und brauchen einen Tag in der Woche; die ISO-Varianten beginnen am Montag und brauchen vier.',
  unixtime_time: 'Zeit',
  unixtime_move: 'Verschieben',
  unixtime_move_note: 'Jede Instanz ist unveränderlich — jeder Aufruf liefert eine neue. Monat und Jahr behalten den Tag bei und begrenzen ihn auf den letzten des Monats, wenn es ihn nicht gibt.',
  unixtime_compare: 'Vergleichen',
  unixtime_compare_note: 'Vergleiche akzeptieren alles, was auch eine Factory akzeptiert; ein Date oder eine reine Zahl muss also nicht umgewandelt werden.',
  unixtime_types: 'Typen',
}
