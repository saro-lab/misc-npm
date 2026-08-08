import type { MessageKey } from '../locales'

// Every value in a `//=>` comment was produced by running it against infinite-unixtime 1.1.5.
// `//=>` 주석의 값은 전부 infinite-unixtime 1.1.5 로 실제 실행해서 얻은 결과다.
export type DocBlock = { lang: string; code: string }

export type DocSection = {
  id: string
  titleKey: MessageKey
  noteKey?: MessageKey
  blocks: DocBlock[]
}

export const unixtimeDocs: DocSection[] = [
  {
    id: 'install',
    titleKey: 'doc_install',
    blocks: [
      { lang: 'bash', code: 'npm install infinite-unixtime\npnpm add infinite-unixtime\nyarn add infinite-unixtime' },
      { lang: 'javascript', code: "import { Unixtime } from 'infinite-unixtime';" },
    ],
  },
  {
    id: 'timezone',
    titleKey: 'unixtime_timezone',
    noteKey: 'unixtime_timezone_note',
    blocks: [
      {
        lang: 'javascript',
        code: `// UTC+09:00 -> -540, UTC -> 0, UTC-03:30 -> 210
const KST = -540;
const UTC = 0;

// The browser's own offset, same sign convention.
const local = new Date().getTimezoneOffset();

// Every API takes the offset last; omitting it uses the browser's.
Unixtime.fromUtc(2026, 3, 31, 5, 30).format('yyyy-MM-dd HH:mm', KST);
//=> '2026-03-31 14:30'`,
      },
    ],
  },
  {
    id: 'create',
    titleKey: 'unixtime_create',
    blocks: [
      {
        lang: 'javascript',
        code: `Unixtime.now();
Unixtime.fromDate(new Date());

Unixtime.fromMillis(1774935005123n).toIsoStringUtc();
//=> '2026-03-31T05:30:05.123Z'

Unixtime.fromSeconds(1774935005).toIsoStringUtc();
//=> '2026-03-31T05:30:05.000Z'

// year, month, day, hour, minute, second, millisecond, timezoneOffset
Unixtime.from(2026, 3, 31, 14, 30, 0, 0, -540).toIsoStringUtc();
//=> '2026-03-31T05:30:00.000Z'

Unixtime.fromUtc(2026, 3, 31, 14, 30).toIsoStringUtc();
//=> '2026-03-31T14:30:00.000Z'`,
      },
      {
        lang: 'javascript',
        code: `// No year limit — the value is one bigint of milliseconds.
Unixtime.fromUtc(23948923423421773421234n, 1, 31).timestamp;
//=> 755755026924596579546592556800000n

Unixtime.fromUtc(-2000, 2, 29).toIsoStringUtc();
//=> '-2000-02-29T00:00:00.000Z'

// A date that does not exist throws.
Unixtime.fromUtc(2026, 2, 29);
//=> Error: Unixtime: Invalid Date: 2026-2-29 0:0:0.0`,
      },
    ],
  },
  {
    id: 'parse',
    titleKey: 'unixtime_parse',
    noteKey: 'unixtime_parse_note',
    blocks: [
      {
        lang: 'javascript',
        code: `Unixtime.parseUtc('2026-03-31T14:30:00.000Z', 'yyyy-MM-ddTHH:mm:ss.SSSXXX').toIsoStringUtc();
//=> '2026-03-31T14:30:00.000Z'

Unixtime.parseUtc('20260331143000000', 'yyyyMMddHHmmssSSS').toIsoStringUtc();
//=> '2026-03-31T14:30:00.000Z'

Unixtime.parseUtc('2026-03-31 PM 09:30', 'yyyy-MM-dd a hh:mm').toIsoStringUtc();
//=> '2026-03-31T21:30:00.000Z'

// An offset in the text wins over the argument.
Unixtime.parse('2026-03-31T14:30:00.000+09:00', 'yyyy-MM-ddTHH:mm:ss.SSSXXX', 0).toIsoStringUtc();
//=> '2026-03-31T05:30:00.000Z'

Unixtime.parseUtc('2026-03-31 00:00 +0900', 'yyyy-MM-dd HH:mm XXX').toIsoStringUtc();
//=> '2026-03-30T15:00:00.000Z'

// Missing fields default to 1970-01-01 00:00:00.000
Unixtime.parseUtc('12:34', 'HH:mm').timestamp;
//=> 45240000n`,
      },
    ],
  },
  {
    id: 'read',
    titleKey: 'unixtime_read',
    noteKey: 'unixtime_read_note',
    blocks: [
      {
        lang: 'javascript',
        code: `// 2026-03-31 14:30:05.123 +09:00
const u = Unixtime.fromUtc(2026, 3, 31, 5, 30, 5, 123);

u.timestamp;    //=> 1774935005123n   bigint, milliseconds
u.time;         //=> 1774935005n      bigint, seconds
u.$timestamp;   //=> 1774935005123    number, milliseconds
u.$time;        //=> 1774935005       number, seconds`,
      },
    ],
  },
  {
    id: 'detail',
    titleKey: 'unixtime_detail',
    noteKey: 'unixtime_detail_note',
    blocks: [
      {
        lang: 'javascript',
        code: `const u = Unixtime.fromUtc(2026, 3, 31, 5, 30, 5, 123);

u.toDateTimeDetail(-540);
//=> { leapYear: false, year: 2026n, month: 3, day: 31, week: 2,
//     hours: 14, minutes: 30, seconds: 5, milliseconds: 123,
//     timezoneOffset: -540 }

u.toTimeDetail(-540);
//=> { hours: 14, minutes: 30, seconds: 5, milliseconds: 123,
//     timezoneOffset: -540 }`,
      },
    ],
  },
  {
    id: 'format',
    titleKey: 'unixtime_format',
    blocks: [
      {
        lang: 'javascript',
        code: `const u = Unixtime.fromUtc(2026, 3, 31, 5, 30, 5, 123);

u.format('yyyy-MM-dd (E) HH:mm:ss.SSS XXX', -540);
//=> '2026-03-31 (Tue) 14:30:05.123 +09:00'

u.formatUtc('yyyy-MM-dd HH:mm');
//=> '2026-03-31 05:30'

u.toString(-540);
//=> '2026-03-31 (Tue) PM 02:30 05.123 +09:00'

u.toStringUtc();
//=> '2026-03-31 (Tue) AM 05:30 05.123 Z'

u.toIsoString(-540);
//=> '2026-03-31T14:30:05.123+09:00'

u.toIsoStringUtc();
//=> '2026-03-31T05:30:05.123Z'`,
      },
      {
        lang: 'txt',
        code: `yyyy  year, no padding limit      yy   2-digit year
MM    month 01-12                dd   day 01-31
HH    hour 00-23                 hh   hour 01-12
a     AM / PM                    mm   minute 00-59
ss    second 00-59               SSS  millisecond 000-999
E     Tue        EE  Tuesday     e    day of week 0-6
XXX   +09:00 / Z                 '..' literal text`,
      },
    ],
  },
  {
    id: 'relative',
    titleKey: 'unixtime_relative',
    noteKey: 'unixtime_relative_note',
    blocks: [
      {
        lang: 'javascript',
        code: `const base = Unixtime.fromUtc(2026, 3, 31, 12, 0);
const u = base.plusMinutes(-90);

u.toRelative({ base, locale: 'en' });   //=> '1 hour ago'
u.toRelative({ base, locale: 'ko' });   //=> '1시간 전'

u.toRelativeDetail({ base });
//=> { value: -1, unit: 'hour', millis: -5400000n }

// Past the limit it returns null instead of a stale phrase.
base.plusDays(-31).toRelativeDetail({ base });
//=> null`,
      },
      {
        lang: 'javascript',
        code: `u.toRelative({
  base: Unixtime.now(),          // what to measure against
  limit: { days: 30 },           // false to disable
  units: ['day', 'hour'],        // day | hour | minute | second
  future: 'keep',                // 'now' clamps the future to 0
  locale: 'ko',
  numeric: 'auto',               // 'always' | 'auto'
  style: 'long',                 // 'long' | 'short' | 'narrow'
});`,
      },
    ],
  },
  {
    id: 'date-getters',
    titleKey: 'unixtime_date',
    noteKey: 'unixtime_date_note',
    blocks: [
      {
        lang: 'javascript',
        code: `// 2026-03-31 14:30:05.123 +09:00
const u = Unixtime.fromUtc(2026, 3, 31, 5, 30, 5, 123);

u.getYear(-540);            //=> 2026n
u.getYearNumber(-540);      //=> 2026
u.getMonth(-540);           //=> 3
u.getDay(-540);             //=> 31
u.getLastDayOfMonth(-540);  //=> 31
u.getDayOfYear(-540);       //=> 90
u.isLeapYear(-540);         //=> false`,
      },
    ],
  },
  {
    id: 'week-getters',
    titleKey: 'unixtime_week',
    noteKey: 'unixtime_week_note',
    blocks: [
      {
        lang: 'javascript',
        code: `const u = Unixtime.fromUtc(2026, 3, 31, 5, 30, 5, 123);

u.getWeek(-540);        //=> 2          0 = Sunday
u.getWeekShort(-540);   //=> 'Tue'
u.getWeekLong(-540);    //=> 'Tuesday'

u.getWeekOfMonth(-540);         //=> 5
u.getLastWeekOfMonth(-540);     //=> 5
u.getWeekOfYear(-540);          //=> 14
u.getLastWeekOfYear(-540);      //=> 53

u.getIsoWeekOfMonth(-540);      //=> 5
u.getLastIsoWeekOfMonth(-540);  //=> 5
u.getIsoWeekOfYear(-540);       //=> 14
u.getLastIsoWeekOfYear(-540);   //=> 53`,
      },
    ],
  },
  {
    id: 'time-getters',
    titleKey: 'unixtime_time',
    blocks: [
      {
        lang: 'javascript',
        code: `const u = Unixtime.fromUtc(2026, 3, 31, 5, 30, 5, 123);

u.getHours(-540);         //=> 14
u.getHours12(-540);       //=> 2
u.getAmPm(-540);          //=> 'PM'
u.getMinutes(-540);       //=> 30
u.getSeconds(-540);       //=> 5
u.getMilliseconds(-540);  //=> 123`,
      },
    ],
  },
  {
    id: 'move',
    titleKey: 'unixtime_move',
    noteKey: 'unixtime_move_note',
    blocks: [
      {
        lang: 'javascript',
        code: `const u = Unixtime.fromUtc(2026, 1, 31);

u.plusMillis(500);
u.plusSeconds(-30);
u.plusMinutes(15);
u.plusHours(-8);

u.plusDays(7).toIsoStringUtc();
//=> '2026-02-07T00:00:00.000Z'

// The day is kept, then clamped to the last of the month.
u.plusMonth(1, 0).toIsoStringUtc();
//=> '2026-02-28T00:00:00.000Z'

Unixtime.fromUtc(2024, 1, 31).plusMonth(1, 0).toIsoStringUtc();
//=> '2024-02-29T00:00:00.000Z'

u.plusYear(-1, 0).toIsoStringUtc();
//=> '2025-01-31T00:00:00.000Z'`,
      },
    ],
  },
  {
    id: 'compare',
    titleKey: 'unixtime_compare',
    noteKey: 'unixtime_compare_note',
    blocks: [
      {
        lang: 'javascript',
        code: `const a = Unixtime.fromUtc(2026, 3, 31);
const b = Unixtime.fromUtc(2026, 4, 1);

a.before(b);     //=> true
a.beforeEq(b);   //=> true
a.after(b);      //=> false
a.afterEq(b);    //=> false

a.between(Unixtime.fromUtc(2026, 1, 1), b);
//=> true

// Accepts Unixtime | number | bigint | string | Date.
a.before(new Date());

// Second argument compares by seconds instead of milliseconds.
a.before(b, true);`,
      },
    ],
  },
  {
    id: 'types',
    titleKey: 'unixtime_types',
    blocks: [
      {
        lang: 'typescript',
        code: `type TimeInput = Unixtime | number | bigint | string | Date;
type RelativeUnit = 'day' | 'hour' | 'minute' | 'second';

type DateTimeDetail = {
  readonly leapYear: boolean;
  readonly year: bigint;
  readonly month: number;
  readonly day: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly milliseconds: number;
  readonly week: number;
  readonly timezoneOffset: number;
};

type RelativeDetail = {
  readonly value: number;
  readonly unit: RelativeUnit;
  readonly millis: bigint;
};`,
      },
    ],
  },
]
