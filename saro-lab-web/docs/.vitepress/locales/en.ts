// This dictionary is the key schema — `Messages` derives from it, so new strings start here.
// 이 사전이 곧 키 스키마다. `Messages` 타입이 여기서 파생되므로 새 문자열은 항상 여기부터.
//
// Keys are grouped by scope: site chrome, the project registry (`proj_<id>_*`), doc chrome
// shared by every library, then one block per documented library (`unixtime_*`). A string that
// only means something for a single library carries that library's prefix, so the next library
// gets its own block instead of widening a shared one.
// 키는 범위별로 묶는다: 사이트 공통, 프로젝트 레지스트리(`proj_<id>_*`), 모든 라이브러리가
// 공유하는 문서 공통, 그리고 라이브러리별 블록(`unixtime_*`). 한 라이브러리에서만 뜻이 통하는
// 문자열은 그 라이브러리 접두사를 달아, 다음 라이브러리가 공용 블록을 넓히지 않고 자기 블록을 갖는다.
export const en = {
  label: 'English',
  lang: 'en',
  link: '/en/',
  description: 'Open source from SARO Lab — distributed systems, developer tools, and libraries. MIT licensed.',

  menu_docs: 'Docs',
  menu_projects: 'Projects',
  menu_tool: 'Tools',
  nav_prev: 'Previous',
  nav_next: 'Next',
  page_not_found: 'Page not found',
  open_site: 'Visit site',
  open_github: 'GitHub',
  open_npm: 'npm',
  external_link: 'Opens in a new tab',
  copy_code: 'Copy',

  home_tagline: 'Open source from SARO Lab',
  home_projects: 'Projects',
  home_tools: 'Tools',

  proj_dat_tag: 'Distributed Access Token',
  proj_dat_desc:
    'A distributed access token system for stateless HTTP services. A separate key-issuing service does away with the fixed-key problem, payload encryption comes as standard, and a binary format rather than JSON keeps tokens as small and as fast as they go.',

  proj_ticketing_tag: 'Distributed lock server',
  proj_ticketing_desc:
    'A high-performance open source distributed lock service that controls the exact order in which servers and processes run. It shuts out the concurrency failures that surface the moment traffic arrives all at once — overselling a limited quantity, handing out the same seat twice, spending one coupon in two places.',

  proj_nabi_tag: 'WYSIWYG editor',
  proj_nabi_desc:
    'A WYSIWYG editor with the framework dependency removed entirely, so it drops just as easily into vanilla JS as into React, Vue, or Svelte. Text editing, file upload, and table alignment are there from the start, and both your own custom features and the styling down to the last detail are yours to write.',

  proj_unixtime_tag: 'Unlimited Unix time',
  proj_unixtime_desc:
    'A date and timezone library that handles every range of time exactly, from BC to an unbounded future. Every object stays immutable, which keeps local mean time (LMT) from skewing old dates, and format parsing plus timezone support make it just as usable from npm as from a vanilla bundle.',

  live: 'Live',
  now: 'Now',
  year: 'Year',
  month: 'Month',
  day: 'Day',
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  seconds: 'Seconds',
  millisecond: 'Millisecond',

  doc_reference: 'API reference',
  doc_install: 'Install',

  unixtime_timezone: 'Timezone offset',
  unixtime_timezone_note:
    'There is no timezone database. Every API takes a fixed offset in minutes, using the same sign as Date.prototype.getTimezoneOffset — so no local mean time leaks into old dates.',
  unixtime_create: 'Create',
  unixtime_parse: 'Parse',
  unixtime_parse_note:
    'Parsing follows the same format as formatting. A mismatch throws rather than guessing.',
  unixtime_read: 'Unixtime',
  unixtime_read_note: 'The value comes back as a bigint by default; the $-prefixed getters return a number.',
  unixtime_detail: 'Date-time, time',
  unixtime_detail_note:
    'Prefer this over the individual getters when you need several fields — the carry is resolved once, which also keeps negative timestamps correct.',
  unixtime_format: 'Format',
  unixtime_relative: 'Relative time',
  unixtime_relative_note:
    'toRelative gives back the time relative to now.',
  unixtime_date: 'Date',
  unixtime_date_note: 'Every value takes the offset last and falls back to the browser timezone.',
  unixtime_week: 'Weekday and week',
  unixtime_week_note:
    'The plain week functions start on Sunday and need one day in the week; the ISO ones start on Monday and need four.',
  unixtime_time: 'Time',
  unixtime_move: 'Move',
  unixtime_move_note: 'Every instance is immutable — each call returns a new one. Month and year keep the day, clamping to the last of the month when it does not exist.',
  unixtime_compare: 'Compare',
  unixtime_compare_note: 'Comparisons accept anything a factory accepts, so a Date or a raw number needs no conversion.',
  unixtime_types: 'Types',
}
