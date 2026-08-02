# Infinite Unixtime

Date and time with no year limit. Every value is a `bigint`, so the year can be
`23948923423421773421234` or `-3000` and nothing breaks.

### [Online Demo](https://dat.saro.me/tool/time)

## Install

```
npm install infinite-unixtime
```

```javascript
import {Unixtime} from 'infinite-unixtime';
```

For the browser, download a build from the
[releases](https://github.com/saro-lab/misc-npm/releases) page.

```html
<script src="./infinite-unixtime-1.1.4.min.js"></script>
<script>
    // if the name `Unixtime` is taken, use `$Unixtime`
    document.body.innerText = Unixtime.now().toString();
</script>
```

## Why

**No year limit.** A native `Date` stops at year 275760.

```javascript
Unixtime.fromUtc(23948923423421773421234n, 1, 31).toIsoStringUtc();
// -> 23948923423421773421234-01-31T00:00:00.000Z
Unixtime.fromUtc(-3000, 12, 31).toIsoStringUtc();
// -> -3000-12-31T00:00:00.000Z
```

**No LMT.** A native `Date` changes the offset for old dates. This library keeps
the offset you asked for, in every era.

```javascript
// in a +09:00 timezone
new Date(1900, 0, 1).toString();
// -> Mon Jan 01 1900 00:00:00 GMT+0827   <- 8 hours 27 minutes, not 9
Unixtime.from(1900, 1, 1).toString();
// -> 1900-01-01 (Mon) AM 12:00 00.000 +09:00
```

**One number inside.** An `Unixtime` is only a `bigint` of milliseconds, so it is
easy to store and compare.

## Timezone offset

Every method that shows a date takes a timezone offset, the same number
`Date.prototype.getTimezoneOffset()` returns. It is **minutes to add to reach UTC**,
so `+09:00` is `-540`.

```javascript
const u = Unixtime.fromUtc(2026, 3, 31, 14, 30, 5, 123);

u.getHours(0);      // -> 14   (UTC)
u.getHours(-540);   // -> 23   (+09:00)
```

Leave it out and your own timezone is used. Or use a `...Utc` method to always get UTC.

## Create

```javascript
Unixtime.now();                        // this moment

Unixtime.fromMillis(0);                // -> 1970-01-01T00:00:00.000Z
Unixtime.fromSeconds(1);               // -> 1970-01-01T00:00:01.000Z
Unixtime.fromMillis('1785386658485');  // a string is fine, and so is a bigint
Unixtime.fromDate(new Date());         // from a native Date
```

`fromUtc` reads the numbers as UTC, `from` reads them in your timezone.

```javascript
Unixtime.fromUtc(2026, 3, 31).toIsoStringUtc();
// -> 2026-03-31T00:00:00.000Z
Unixtime.fromUtc(2026, 3, 31, 14, 30, 5, 123).toIsoStringUtc();
// -> 2026-03-31T14:30:05.123Z

// the last argument is the timezone offset: -540 is +09:00
Unixtime.from(2026, 3, 31, 0, 0, 0, 0, -540).toIsoStringUtc();
// -> 2026-03-30T15:00:00.000Z
```

A date that does not exist throws.

```javascript
Unixtime.fromUtc(0, 2, 29);     // ok, year 0 is a leap year
Unixtime.fromUtc(2026, 2, 29);  // throws: Unixtime: Invalid Date
Unixtime.fromUtc(2026, 3, 31, 24, 0, 0);  // throws, there is no hour 24
```

## Read

```javascript
const u = Unixtime.fromUtc(2026, 3, 31, 14, 30, 5, 123);

u.timestamp;   // -> 1774967405123n   milliseconds, bigint
u.$timestamp;  // -> 1774967405123    the same as a number
u.time;        // -> 1774967405n      seconds, bigint
u.$time;       // -> 1774967405       the same as a number
```

```javascript
u.getYear(0);          // -> 2026n   bigint, because the year has no limit
u.getYearNumber(0);    // -> 2026    a number, when you know it is small
u.getMonth(0);         // -> 3       1 ~ 12
u.getDay(0);           // -> 31
u.getHours(0);         // -> 14      0 ~ 23
u.getHours12(0);       // -> 2       1 ~ 12
u.getAmPm(0);          // -> PM
u.getMinutes(0);       // -> 30
u.getSeconds(0);       // -> 5
u.getMilliseconds(0);  // -> 123
```

```javascript
u.getWeek(0);            // -> 2         0 is Sunday
u.getWeekShort(0);       // -> Tue
u.getWeekLong(0);        // -> Tuesday
u.getDayOfYear(0);       // -> 90        1 ~ 366
u.getLastDayOfMonth(0);  // -> 31        28, 29, 30 or 31
u.isLeapYear(0);         // -> false
```

Read everything at once instead of calling many getters.

```javascript
u.toDateTimeDetail(0);
// -> { leapYear: false, year: 2026n, month: 3, day: 31, week: 2,
//      hours: 14, minutes: 30, seconds: 5, milliseconds: 123, timezoneOffset: 0 }

u.toTimeDetail(0);
// -> { hours: 14, minutes: 30, seconds: 5, milliseconds: 123, timezoneOffset: 0 }
```

## Format

```javascript
const u = Unixtime.fromUtc(2026, 3, 31, 14, 30, 5, 123);

u.toIsoStringUtc();   // -> 2026-03-31T14:30:05.123Z
u.toIsoString(-540);  // -> 2026-03-31T23:30:05.123+09:00
u.toIsoString(300);   // -> 2026-03-31T09:30:05.123-05:00

u.toStringUtc();      // -> 2026-03-31 (Tue) PM 02:30 05.123 Z
u.toString(-540);     // -> 2026-03-31 (Tue) PM 11:30 05.123 +09:00
```

Or write your own pattern.

```javascript
u.formatUtc('yyyy-MM-dd');            // -> 2026-03-31
u.formatUtc('a hh:mm:ss.SSS');        // -> PM 02:30:05.123
u.formatUtc('EE, dd MM yyyy');        // -> Tuesday, 31 03 2026
u.formatUtc('E e XXX');               // -> Tue 2 Z
u.formatUtc("yyyy 'year' MM 'month'");   // -> 2026 year 03 month
u.format('yyyy-MM-dd HH:mm XXX', -540);  // -> 2026-03-31 23:30 +09:00
```

| token | means | example |
|---|---|---|
| `yyyy` | year, 4 digits or more | `2026` |
| `yy` | year, 2 digits or more | `2026` |
| `MM` | month | `03` |
| `dd` | day | `31` |
| `HH` | hour, 0 ~ 23 | `14` |
| `hh` | hour, 1 ~ 12 | `02` |
| `a` | AM or PM | `PM` |
| `mm` | minute | `30` |
| `ss` | second | `05` |
| `SSS` | millisecond | `123` |
| `E` | day of week, short | `Tue` |
| `EE` | day of week, long | `Tuesday` |
| `e` | day of week, 0 is Sunday | `2` |
| `XXX` | timezone | `Z`, `+09:00` |
| `'...'` | plain text | `'year'` -> `year` |

## Parse

The other way around. Missing fields fall back to `1970-01-01 00:00:00.000`.

```javascript
Unixtime.parseUtc('2026-03-31', 'yyyy-MM-dd').toIsoStringUtc();
// -> 2026-03-31T00:00:00.000Z
Unixtime.parseUtc('20260331143005123', 'yyyyMMddHHmmssSSS').toIsoStringUtc();
// -> 2026-03-31T14:30:05.123Z
Unixtime.parseUtc('31/03/2026 02:30 PM', 'dd/MM/yyyy hh:mm a').toIsoStringUtc();
// -> 2026-03-31T14:30:00.000Z
Unixtime.parseUtc('12:34', 'HH:mm').toIsoStringUtc();
// -> 1970-01-01T12:34:00.000Z
```

`XXX` in the text wins over the offset you pass.

```javascript
Unixtime.parse('2026-03-31 00:00 +09:00', 'yyyy-MM-dd HH:mm XXX', 0).toIsoStringUtc();
// -> 2026-03-30T15:00:00.000Z
Unixtime.parse('2026-03-31 00:00', 'yyyy-MM-dd HH:mm', -540).toIsoStringUtc();
// -> 2026-03-30T15:00:00.000Z
```

Any year works here too, and bad text throws instead of guessing.

```javascript
Unixtime.parseUtc('-0100-03-31', 'yyyy-MM-dd').getYear(0);
// -> -100n

Unixtime.parseUtc('2026/03/31', 'yyyy-MM-dd');
// throws: cannot parse "2026/03/31" as "yyyy-MM-dd" at index 4
Unixtime.parseUtc('2026-02-29', 'yyyy-MM-dd');
// throws: Unixtime: Invalid Date, 2026 is not a leap year
```

## Relative time

`toRelative` says how far a time is from now, in the language you ask for. It uses
[Intl.RelativeTimeFormat](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat),
so every locale it knows works.

```javascript
const now = Unixtime.now();
// `base` is now by default, it is pinned here so the examples are exact
const en = {base: now, locale: 'en'};
const ko = {base: now, locale: 'ko'};

now.plusSeconds(-1).toRelative(en);  // -> 1 second ago
now.plusMinutes(-1).toRelative(en);  // -> 1 minute ago
now.plusHours(-1).toRelative(en);    // -> 1 hour ago
now.plusDays(-3).toRelative(en);     // -> 3 days ago
now.plusSeconds(1).toRelative(en);   // -> in 1 second
now.toRelative(en);                  // -> 0 seconds ago

now.plusMinutes(-1).toRelative(ko);  // -> 1분 전
now.plusSeconds(1).toRelative(ko);   // -> 1초 후
```

Let the language pick nicer words with `numeric: 'auto'`.

```javascript
now.toRelative({...en, numeric: 'auto'});             // -> now
now.plusDays(-1).toRelative({...en, numeric: 'auto'}); // -> yesterday
now.toRelative({...ko, numeric: 'auto'});             // -> 지금
```

It gives `null` when the time is too far away. The limit is 30 days by default.

```javascript
now.plusDays(-31).toRelative(en);                       // -> null
now.plusDays(-31).toRelative({...en, limit: {days: 90}}); // -> 31 days ago
now.plusDays(-365).toRelative({...en, limit: false});     // -> 365 days ago
```

A clock that runs a little ahead can show the future as now.

```javascript
now.plusSeconds(1).toRelative({...en, future: 'now'});  // -> 0 seconds ago
now.plusSeconds(1).toRelative({...ko, future: 'now'});  // -> 0초 전
```

Pick which units it may use.

```javascript
now.plusMinutes(-90).toRelative(en);                              // -> 1 hour ago
now.plusMinutes(-90).toRelative({...en, units: ['minute', 'second']}); // -> 90 minutes ago
```

The number is cut, never rounded, so 59.9 seconds is still `59 seconds ago`.

Want to draw it yourself? `toRelativeDetail` does the same work without `Intl`.

```javascript
now.plusHours(-47).toRelativeDetail({base: now});
// -> { value: -1, unit: 'day', millis: -169200000n }
```

| option | default | means |
|---|---|---|
| `base` | now | what the time is compared to |
| `limit` | `{days: 30}` | farther than this is `null`, `false` turns it off |
| `units` | `['day', 'hour', 'minute', 'second']` | units it may use |
| `future` | `'keep'` | `'now'` shows any future time as `0` |
| `locale` | your locale | one locale or a list of them |
| `numeric` | `'always'` | `'auto'` allows "now" and "yesterday" |
| `style` | `'long'` | `'short'` or `'narrow'` for shorter words |

## Move

Every method returns a new `Unixtime`. Negative numbers go back.

```javascript
const u = Unixtime.fromUtc(2026, 3, 31, 12, 0, 0);

u.plusMillis(1).toIsoStringUtc();     // -> 2026-03-31T12:00:00.001Z
u.plusSeconds(30).toIsoStringUtc();   // -> 2026-03-31T12:00:30.000Z
u.plusMinutes(-90).toIsoStringUtc();  // -> 2026-03-31T10:30:00.000Z
u.plusHours(12).toIsoStringUtc();     // -> 2026-04-01T00:00:00.000Z
u.plusDays(1).toIsoStringUtc();       // -> 2026-04-01T12:00:00.000Z
```

Months and years keep the day when they can, and step back when they cannot.

```javascript
u.plusMonth(1, 0).toIsoStringUtc();   // -> 2026-04-30T12:00:00.000Z   April has no 31st
u.plusYear(1, 0).toIsoStringUtc();    // -> 2027-03-31T12:00:00.000Z

Unixtime.fromUtc(2026, 1, 31).plusMonth(1, 0).toIsoStringUtc();
// -> 2026-02-28T00:00:00.000Z
Unixtime.fromUtc(2024, 2, 29).plusYear(1, 0).toIsoStringUtc();
// -> 2025-02-28T00:00:00.000Z
```

## Compare

```javascript
const a = Unixtime.fromUtc(2026, 3, 31);
const b = Unixtime.fromUtc(2026, 4, 1);

a.before(b);    // -> true
a.after(b);     // -> false
a.beforeEq(a);  // -> true
a.afterEq(a);   // -> true

b.between(a, Unixtime.fromUtc(2026, 5, 1));  // -> true
a.between(b, Unixtime.fromUtc(2026, 5, 1));  // -> false
```

They take anything, not only an `Unixtime`.

```javascript
a.before(b.timestamp);              // bigint
a.before(new Date(b.$timestamp));   // Date
a.before(b.$time, true);            // seconds, so pass true
```

## Week of month, week of year

Two rules are ready. The plain one starts the week on Sunday and counts the first
day as week 1. The ISO 8601 one starts on Monday and needs 4 days to make a week.

```javascript
const u = Unixtime.fromUtc(2026, 3, 31);

u.getWeekOfMonth(0);      // -> 5
u.getLastWeekOfMonth(0);  // -> 5    so this is the last week of March
u.getWeekOfYear(0);       // -> 14
u.getLastWeekOfYear(0);   // -> 53

u.getIsoWeekOfYear(0);    // -> 14
u.getIsoWeekOfMonth(0);   // -> 5
```

The two rules can disagree, and that is the point of having both.

```javascript
const j = Unixtime.fromUtc(2027, 1, 1);   // a Friday

j.getWeekOfYear(0);      // -> 1    a new year, so week 1
j.getIsoWeekOfYear(0);   // -> 53   ISO puts this day in the last week of 2026
j.getIsoWeekOfMonth(0);  // -> 0    0 means the last ISO week of December
```

Use `getLastWeekOfMonth` and `getLastWeekOfYear` to ask "is this the last week?"
without knowing how long the month or the year is.

## Types

```typescript
import type {
    DateTimeDetail, TimeDetail, TimeInput,
    RelativeDetail, RelativeTimeOptions, RelativeUnit, Duration,
} from 'infinite-unixtime';
```

## License

MIT
