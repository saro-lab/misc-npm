import type { Messages } from './index'

export const ja: Messages = {
  label: '日本語',
  lang: 'ja',
  link: '/ja/',
  description: 'SARO Lab のオープンソース — 分散システム、開発者ツール、ライブラリ。MIT ライセンス。',

  menu_docs: 'ドキュメント',
  menu_projects: 'プロジェクト',
  menu_tool: 'ツール',
  nav_prev: '前へ',
  nav_next: '次へ',
  page_not_found: 'ページが見つかりません',
  open_site: 'サイトを見る',
  open_github: 'GitHub',
  open_npm: 'npm',
  external_link: '新しいタブで開きます',
  copy_code: 'コピー',

  home_tagline: 'SARO Lab のオープンソースプロジェクト',
  home_projects: 'プロジェクト',
  home_tools: 'ツール',

  proj_dat_tag: '分散アクセストークン',
  proj_dat_desc:
    'ステートレスな HTTP サービスのための分散アクセストークンシステムです。独立した認証キー発行システムに対応することで固定キーの問題を解消し、同時にデータ暗号化を標準でサポートします。JSON ではなくバイナリ形式を用いることで、最適な軽量性と速度を実現します。',

  proj_ticketing_tag: '分散ロックサーバー',
  proj_ticketing_desc:
    'サーバーとプロセスの実行順序を精密に制御する、高性能なオープンソース分散ロックサービスです。限定数量の超過販売、座席の二重予約、クーポンの同時使用のように、トラフィックが一度に集中した瞬間に発生する同時実行障害を完全に遮断します。',

  proj_nabi_tag: 'WYSIWYG エディタ',
  proj_nabi_desc:
    'フレームワーク依存を完全に取り除き、バニラ JS から React、Vue、Svelte まで、どの環境にも柔軟に導入できる WYSIWYG エディタです。テキスト編集、ファイルアップロード、表の整列といった充実した基本機能はもちろん、独自機能の追加と完全に自由なスタイリングにも対応します。',

  proj_unixtime_tag: '無限の Unix time',
  proj_unixtime_desc:
    '紀元前から無限の未来まで、あらゆる時間範囲を正確に扱えるタイムゾーンおよび日付処理ライブラリです。すべてのオブジェクトを不変に保つことで過去の日付における地方平均時 (LMT) の誤差を防ぎ、各種フォーマットのパースとタイムゾーン機能に対応するため、npm でもバニラバンドルでも柔軟に活用できます。',

  live: 'リアルタイム',
  now: '現在',
  year: '年',
  month: '月',
  day: '日',
  hour: '時',
  minute: '分',
  second: '秒',
  seconds: '秒',
  millisecond: 'ミリ秒',

  doc_reference: 'API ドキュメント',
  doc_install: 'インストール',

  unixtime_timezone: 'タイムゾーンオフセット',
  unixtime_timezone_note:
    'タイムゾーンデータベースは使わない。すべての API が分単位の固定オフセットを受け取り、符号は Date.prototype.getTimezoneOffset と同じだ。そのため古い日付に地方平均時が混入しない。',
  unixtime_create: '生成',
  unixtime_parse: 'パース',
  unixtime_parse_note:
    'パースはフォーマットと同じ形式に従う。形式が合わなければ推測せずに例外を投げる。',
  unixtime_read: 'Unixtime',
  unixtime_read_note: '既定では bigint で返り、$ を使うと number で返る。',
  unixtime_detail: '日時・時刻',
  unixtime_detail_note:
    '複数のフィールドが必要なときは個別のゲッターよりこちらを使う。桁上がりが一度で終わるため、負のタイムスタンプでも値がずれない。',
  unixtime_format: 'フォーマット',
  unixtime_relative: '相対時間',
  unixtime_relative_note:
    'toRelative は現在時刻からの相対時間を返す。',
  unixtime_date: '日付',
  unixtime_date_note: 'すべての値はオフセットを最後の引数に取り、省略するとブラウザのタイムゾーンを使う。',
  unixtime_week: '曜日・週',
  unixtime_week_note:
    '通常の週番号は日曜始まりで最低 1 日、ISO 週番号は月曜始まりで最低 4 日が基準だ。',
  unixtime_time: '時刻',
  unixtime_move: '移動',
  unixtime_move_note: 'インスタンスは不変なので、呼び出すたびに新しい値が返る。月・年の移動は日を保つが、存在しない日付ならその月の末日に合わせる。',
  unixtime_compare: '比較',
  unixtime_compare_note: '比較関数はファクトリが受け取れる値なら何でも受け取るので、Date や数値を変換する必要はない。',
  unixtime_types: '型',
}
