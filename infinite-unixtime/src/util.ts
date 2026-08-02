// unixtime = unixtime seconds
// umillis = unixtime milliseconds

// Y = YEAR, L = LEAP 1 DAY
import {DateTimeDetail, Duration, RelativeDetail, RelativeUnit, TimeDetail, Unixtime} from "./index.js";

const Y1 = 365n; // 1 year
const Y1L = Y1 + 1n; // 1 year (leap)
const Y4 = (Y1 * 4n) + 1n; // 4 years
const Y100 = (Y4 * 25n) - 1n; // 100 years
const Y400 = (Y100 * 4n) + 1n; // 400 years

// M = MILLISECOND
export const MS1 = 1000n;
export const MM1 = MS1 * 60n;
export const MH1 = MM1 * 60n;
export const MD1 = MH1 * 24n;
export const MY400 = Y400 * MD1;

// unix millis to y2k (2000/01/01)
const Y2K_UMILLIS = 946684800000n;
// unix millis to - year zero (0000/01/01)
const ZY_UMILLIS = -62167219200000n;

const DAY_LEN_IN_MONTH = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAY_LEN_IN_MONTH_ACC = [0, 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

const WEEK_E = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_EE = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WEEK_MIN_DAYS = 1;
const ISO_WEEK_MIN_DAYS = 4;

function zerofill(n: number|bigint|string, fill: number): string {
    if (typeof n === 'string') {
        let sign = n.startsWith("-") ? "-" : "";
        return sign + n.substring(sign.length).padStart(fill, "0");
    } else if (typeof n === 'bigint') {
        return zerofill(n.toString(), fill);
    } else if (typeof n === 'number') {
        return zerofill(n.toString(), fill);
    }
    throw new Error(`is not number or bigint: ${n}`);
}

function toIntRange(n: number|bigint, min: number|null = null, max: number|null = null): number {
    if (typeof n === 'bigint') {
        return toIntRange(Number(n), min, max);
    }
    if (typeof n === 'number') {
        if (Number.isSafeInteger(n)) {
            if (min == null || n >= min) {
                if (max == null || n <= max) {
                    return n;
                }
            }
        }
    }
    throw new Error(`is not range of int: ${n}`);
}

function toBigIntRange(n: number|bigint, min: bigint|null = null, max: bigint|null = null): bigint {
    if (typeof n === 'number') {
        return toBigIntRange(BigInt(n), min, max);
    } else if (typeof n === 'bigint') {
        if (min == null || n >= min) {
            if (max == null || n <= max) {
                return n;
            }
        }
    }
    throw new Error(`is not range of bigint: ${n}`);
}

export function _to_XXX(detail: DateTimeDetail): string {
    let tz = detail.timezoneOffset * -1;
    if (tz === 0) {
        return 'Z';
    }
    const sign = tz > 0 ? '+' : '-';
    tz = Math.abs(tz);
    const h = Math.floor(tz / 60);
    const m = tz % 60;
    return `${sign}${zerofill(h, 2)}:${zerofill(m, 2)}`;
}

export function _to_a(detail: DateTimeDetail): string {
    return detail.hours >= 12 ? 'PM' : 'AM';
}

export function _to_E(week: number): string {
    return WEEK_E[week % 7];
}

export function _to_EE(week: number): string {
    return WEEK_EE[week % 7];
}

export function _floor_div(a: bigint, b: bigint): bigint {
    const q = a / b;
    return (a % b !== 0n && (a < 0n) !== (b < 0n)) ? q - 1n : q;
}

export function _floor_mod(a: bigint, b: bigint): bigint {
    const m = a % b;
    return (m !== 0n && (m < 0n) !== (b < 0n)) ? m + b : m;
}

export function _with_timezone_offset(millis: bigint, timezoneOffset: number): bigint {
    return millis - (BigInt(timezoneOffset) * MM1)
}

export function to_timestamp(n: Unixtime|number|bigint|string|Date, seconds: boolean = false): bigint {
    if (typeof n === 'bigint') {
        return seconds ? n * 1000n : n;
    } else if (typeof n === 'number') {
        return seconds ? BigInt(Math.floor(n)) * 1000n : BigInt(Math.floor(n));
    } else if (typeof n === 'string') {
        return seconds ? BigInt(n) * 1000n : BigInt(n);
    } else if (n instanceof Date) {
        return BigInt(n.getTime());
    } else if (n instanceof Unixtime) {
        return n.timestamp
    }
    throw new Error(`is not timestamp: ${n}`);
}

// [leapYear, leapCount]
export function _get_leap_info(year: bigint): [boolean, bigint] {
    const leapYear = ((year % 4n === 0n) && (year % 100n !== 0n)) || (year % 400n === 0n);
    const offset = (year >= 0n ? 1n : 0n) + (leapYear ? -1n : 0n);
    year = year < 0 ? -year : year;
    return [leapYear, (year / 4n) - (year / 100n) + (year / 400n) + offset];
}

export function _get_last_day_of_month(month: number, leapYear: boolean): number {
    if (month === 2 && !leapYear) {
        return DAY_LEN_IN_MONTH[month] - 1;
    }
    return DAY_LEN_IN_MONTH[month];
}

export function _merge_month_day(month: number, day: number, leapYear: boolean): number {
    const t = DAY_LEN_IN_MONTH_ACC[month] + (day - 1);
    return !leapYear && t >= 60 ? t - 1 : t;
}

export function _merge_all(
    _year: number|bigint = 1,
    _month: number|bigint = 1,
    _day: number|bigint = 1,
    _hours: number|bigint = 0,
    _minutes: number|bigint = 0,
    _seconds: number|bigint = 0,
    _milliseconds: number|bigint = 0,
    _timezoneOffset = new Date().getTimezoneOffset(),
): bigint {
    try {
        _year = BigInt(_year);
        let reverse = _year < 0n;
        let year = reverse ? -_year : _year;
        let [leapYear, leapCount] = _get_leap_info(_year);
        let month = toIntRange(_month, 1, 12);
        let day = toIntRange(_day, 1, _get_last_day_of_month(month, leapYear));
        let dayOfYear = BigInt(_merge_month_day(month, day, leapYear));
        let tz = toBigIntRange(_timezoneOffset, -1440n, 1440n) * MM1;
        let inDay = (
            (toBigIntRange(_hours, 0n, 23n) * MH1) +
            (toBigIntRange(_minutes, 0n, 59n) * MM1) +
            (toBigIntRange(_seconds, 0n, 59n) * MS1) +
            toBigIntRange(_milliseconds, 0n, 999n)
        );
        let time: bigint;
        if (reverse) {
            year = year - 1n;
            const maskYear = (leapYear ? Y1L : Y1) * MD1;
            const inYear = maskYear - ((dayOfYear * MD1) + inDay);
            const rt = (((year * Y1) + leapCount) * MD1) + inYear;
            time = -rt + ZY_UMILLIS + tz
        } else {
            time = (((year * Y1) + leapCount + dayOfYear) * MD1) + inDay + ZY_UMILLIS + tz
        }
        return time;
    } catch (e) {
        throw new Error(`Unixtime: Invalid Date: ${_year}-${_month}-${_day} ${_hours}:${_minutes}:${_seconds}.${_milliseconds}`);
    }
}

export function _split_day_of_year(dayOfYear: number, leapYear: boolean): [number, number] {
    const days = (!leapYear && dayOfYear >= 59) ? (dayOfYear + 1) : dayOfYear;
    for (let i = 12; i >= 2; i--) {
        if (days >= DAY_LEN_IN_MONTH_ACC[i]) {
            return [i, (days - DAY_LEN_IN_MONTH_ACC[i]) + 1];
        }
    }
    return [1, days + 1];
}

export function _to_week_un_timezone(umillis: bigint): number {
    let t: bigint;
    if (umillis >= 0) {
        t = ((umillis / MD1) + 4n) % 7n;
    } else {
        t = ((umillis + 1n) / MD1) - 1n;
        t = ((t + 4n) % 7n + 7n) % 7n;
    }
    return Number(t)
}

// year, leap, dayYear, milliseconds
export function _split_year(umillis: bigint): [bigint, boolean, number, bigint] {
    let year = 2000n;
    const y2kMillis = umillis - Y2K_UMILLIS;

    // 0 <= t < (400 years in millis)
    let c400 = y2kMillis / MY400;
    let t = y2kMillis % MY400;
    if (t < 0n) {
        c400 -= 1n;
        t += MY400;
    }
    year += c400 * 400n;

    // in day
    let milliseconds = t % MD1;

    // left time (day)
    // 0 <= t < (day of 400 Year)
    t /= MD1;

    const y100c = (t - 1n) / Y100;
    let leap: boolean = y100c === 0n;
    // t > 100 years = not leap year
    if (!leap) {
        year += (y100c * 100n);
        t = (t - 1n) % Y100;

        // if (t > 100 years and first 4 years) is not leap year
        if (t >= (Y1 * 4n)) {
            year += 4n;
            t -= (Y1 * 4n);
            leap = true;
        }
    } // else leap year

    // 4 years - un leap year
    if (leap) {
        let y4c = t / Y4;
        if (y4c > 0n) {
            year += (y4c * 4n);
            t = t % Y4;
            leap = true;
        }
    }

    // 1 year
    const d1l = leap ? 1n : 0n;
    const y1c = (t - d1l) / Y1;
    if (y1c > 0n) {
        year += y1c;
        t -= ((y1c * Y1) + (y1c > 0n ? d1l : 0n));
        leap = false;
    }

    return [year, leap, Number(t), milliseconds];
}

// hours, minutes, seconds, millis
export function _split_day(millisInDay: bigint): [number, number, number, number] {
    return ([
        Number(millisInDay / MH1),
        Number((millisInDay % MH1) / MM1),
        Number((millisInDay % MM1) / MS1),
        Number(millisInDay % MS1)
    ])
}

export function _to_date_time_detail(umillis: bigint, timezoneOffset: number): DateTimeDetail {
    const t = _with_timezone_offset(umillis, timezoneOffset);
    const week = _to_week_un_timezone(t);
    const [year, leapYear, dayOfYear, millisOfDay] = _split_year(t);
    const [month, day] = _split_day_of_year(dayOfYear, leapYear);
    const [hours, minutes, seconds, milliseconds] = _split_day(millisOfDay);
    return ({ leapYear, year, month, day, week, hours, minutes, seconds, milliseconds, timezoneOffset });
}

export function _to_time_detail(umillis: bigint, timezoneOffset: number): TimeDetail {
    const t = _with_timezone_offset(umillis, timezoneOffset);
    const [hours, minutes, seconds, milliseconds] = _split_day(t % MD1);
    return { hours, minutes, seconds, milliseconds, timezoneOffset };
}

// 1 ~ 366
export function _get_day_of_year(detail: DateTimeDetail): number {
    return _merge_month_day(detail.month, detail.day, detail.leapYear) + 1;
}

export function _get_day_len_of_year(leapYear: boolean): number {
    return leapYear ? 366 : 365;
}

// keeps the day of month when possible: 2000-03-31 +1 month -> 2000-04-30
export function _plus_month(detail: DateTimeDetail, months: bigint): bigint {
    const total = (detail.year * 12n) + BigInt(detail.month - 1) + months;
    const year = _floor_div(total, 12n);
    const month = Number(_floor_mod(total, 12n)) + 1;
    const [leapYear] = _get_leap_info(year);
    const lastDay = _get_last_day_of_month(month, leapYear);
    return _merge_all(
        year, month, detail.day > lastDay ? lastDay : detail.day,
        detail.hours, detail.minutes, detail.seconds, detail.milliseconds, detail.timezoneOffset,
    );
}

// day of week (0 = Sunday) of the day that is `back` days before `week`
function _week_back(week: number, back: number): number {
    return ((week - (back % 7)) % 7 + 7) % 7;
}

// 0 = first day of week ... 6 = last day of week
function _week_index(week: number, firstDayOfWeek: number): number {
    return ((week - firstDayOfWeek) % 7 + 7) % 7;
}

// week number of `day` within a period that starts at `firstWeek` (day of week of day 1)
function _week_of(day: number, firstIndex: number, minDays: number): number {
    const week = Math.floor(((day - 1) + firstIndex) / 7) + 1;
    // the leading partial week belongs to the previous period when it is too short
    return (7 - firstIndex) >= minDays ? week : week - 1;
}

export function _week_of_month(detail: DateTimeDetail): number {
    const first = _week_back(detail.week, detail.day - 1);
    return _week_of(detail.day, _week_index(first, 0), WEEK_MIN_DAYS);
}

export function _last_week_of_month(detail: DateTimeDetail): number {
    const first = _week_back(detail.week, detail.day - 1);
    const last = _get_last_day_of_month(detail.month, detail.leapYear);
    return _week_of(last, _week_index(first, 0), WEEK_MIN_DAYS);
}

export function _week_of_year(detail: DateTimeDetail): number {
    const dayOfYear = _get_day_of_year(detail);
    const first = _week_back(detail.week, dayOfYear - 1);
    return _week_of(dayOfYear, _week_index(first, 0), WEEK_MIN_DAYS);
}

export function _last_week_of_year(detail: DateTimeDetail): number {
    const dayOfYear = _get_day_of_year(detail);
    const first = _week_back(detail.week, dayOfYear - 1);
    return _week_of(_get_day_len_of_year(detail.leapYear), _week_index(first, 0), WEEK_MIN_DAYS);
}

export function _iso_week_of_month(detail: DateTimeDetail): number {
    const first = _week_back(detail.week, detail.day - 1);
    return _week_of(detail.day, _week_index(first, 1), ISO_WEEK_MIN_DAYS);
}

export function _last_iso_week_of_month(detail: DateTimeDetail): number {
    const first = _week_back(detail.week, detail.day - 1);
    const last = _get_last_day_of_month(detail.month, detail.leapYear);
    return _week_of(last, _week_index(first, 1), ISO_WEEK_MIN_DAYS);
}

// ISO 8601: 53 weeks when Jan 1st is Thursday, or a leap year starting on Wednesday
function _iso_week_len_of_year(januaryFirstWeek: number, leapYear: boolean): number {
    return (januaryFirstWeek === 4 || (leapYear && januaryFirstWeek === 3)) ? 53 : 52;
}

// [iso week of year, offset of the ISO week based year (-1 | 0 | 1)]
function _iso_week_year(detail: DateTimeDetail): [number, number] {
    const dayOfYear = _get_day_of_year(detail);
    const januaryFirstWeek = _week_back(detail.week, dayOfYear - 1);
    // 1 = Monday ... 7 = Sunday
    const isoWeek = _week_index(detail.week, 1) + 1;
    const week = Math.floor((dayOfYear - isoWeek + 10) / 7);
    if (week < 1) {
        // belongs to the last ISO week of the previous year
        return [_iso_week_len_of_year(..._iso_previous_year(detail, januaryFirstWeek)), -1];
    }
    const len = _iso_week_len_of_year(januaryFirstWeek, detail.leapYear);
    // belongs to the first ISO week of the next year
    return week > len ? [1, 1] : [week, 0];
}

function _iso_previous_year(detail: DateTimeDetail, januaryFirstWeek: number): [number, boolean] {
    const [leapYear] = _get_leap_info(detail.year - 1n);
    return [_week_back(januaryFirstWeek, _get_day_len_of_year(leapYear)), leapYear];
}

function _iso_next_year(detail: DateTimeDetail, januaryFirstWeek: number): [number, boolean] {
    const [leapYear] = _get_leap_info(detail.year + 1n);
    const days = _get_day_len_of_year(detail.leapYear);
    return [((januaryFirstWeek + days) % 7 + 7) % 7, leapYear];
}

export function _iso_week_of_year(detail: DateTimeDetail): number {
    return _iso_week_year(detail)[0];
}

export function _last_iso_week_of_year(detail: DateTimeDetail): number {
    const januaryFirstWeek = _week_back(detail.week, _get_day_of_year(detail) - 1);
    switch (_iso_week_year(detail)[1]) {
        case -1: return _iso_week_len_of_year(..._iso_previous_year(detail, januaryFirstWeek));
        case 1: return _iso_week_len_of_year(..._iso_next_year(detail, januaryFirstWeek));
    }
    return _iso_week_len_of_year(januaryFirstWeek, detail.leapYear);
}

// from the largest unit to the smallest
const RELATIVE_UNITS: [RelativeUnit, bigint][] = [['day', MD1], ['hour', MH1], ['minute', MM1], ['second', MS1]];

const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);

export function _duration_millis(duration: Duration): bigint {
    return (
        (BigInt(Math.trunc(duration.days ?? 0)) * MD1) +
        (BigInt(Math.trunc(duration.hours ?? 0)) * MH1) +
        (BigInt(Math.trunc(duration.minutes ?? 0)) * MM1) +
        (BigInt(Math.trunc(duration.seconds ?? 0)) * MS1) +
        BigInt(Math.trunc(duration.millis ?? 0))
    );
}

// null when `millis` is farther away than `limit`, or too far for a safe integer
export function _to_relative(
    millis: bigint, units: readonly RelativeUnit[], limit: bigint | null, future: 'keep' | 'now',
): RelativeDetail | null {
    if (future === 'now' && millis > 0n) {
        millis = 0n;
    }
    const abs = millis < 0n ? -millis : millis;
    if (limit !== null && abs > limit) {
        return null;
    }
    let unit: RelativeUnit | null = null;
    let size = 0n;
    for (const [u, s] of RELATIVE_UNITS) {
        if (!units.includes(u)) {
            continue;
        }
        // the smallest enabled unit so far, kept in case nothing is filled
        unit = u;
        size = s;
        // the largest enabled unit the difference actually fills
        if (abs >= s) {
            break;
        }
    }
    if (unit === null) {
        throw new Error(`Unixtime: Invalid Relative Options: units is empty`);
    }
    const value = abs / size;
    if (value > MAX_SAFE) {
        return null;
    }
    // Intl.RelativeTimeFormat reads the sign, and it tells -0 from 0,
    // so a time that is not in the future has to stay on the negative side of zero
    return {value: millis <= 0n ? -Number(value) : Number(value), unit, millis};
}

// Intl.RelativeTimeFormat is expensive to build, and lists build the same one over and over
const RELATIVE_FORMATTERS = new Map<string, Intl.RelativeTimeFormat>();

export function _relative_format(
    value: number, unit: RelativeUnit,
    locale: string | string[] | undefined, numeric: 'always' | 'auto', style: 'long' | 'short' | 'narrow',
): string {
    const key = `${Array.isArray(locale) ? locale.join(',') : locale ?? ''} ${numeric} ${style}`;
    let formatter = RELATIVE_FORMATTERS.get(key);
    if (formatter === undefined) {
        formatter = new Intl.RelativeTimeFormat(locale, {numeric, style});
        RELATIVE_FORMATTERS.set(key, formatter);
    }
    return formatter.format(value, unit);
}

export function _format(detail: DateTimeDetail, format: string): string {
    return format.split(/'/).map((s, i) => {
        if (i % 2 === 0) {
            return (s
                    .replace(/yyyy|yy|MM|dd|HH|hh|mm|ss|SSS|XXX|a|e|EE|E/g, (e) => {
                        switch (e) {
                            case 'yyyy': return zerofill(detail.year, 4);
                            case 'yy': return zerofill(detail.year, 2);
                            case 'MM': return zerofill(detail.month, 2);
                            case 'dd': return zerofill(detail.day, 2);
                            case 'HH': return zerofill(detail.hours, 2);
                            case 'hh': return zerofill(detail.hours % 12 || 12, 2);
                            case 'mm': return zerofill(detail.minutes, 2);
                            case 'ss': return zerofill(detail.seconds, 2);
                            case 'SSS': return zerofill(detail.milliseconds, 3);
                            case 'XXX': return _to_XXX(detail);
                            case 'a': return _to_a(detail);
                            case 'e': return detail.week.toString();
                            case 'E': return _to_E(detail.week);
                            case 'EE': return _to_EE(detail.week);
                        }
                        return e;
                    })
            )
        } else {
            return s;
        }
    }).join('');
}

// token = null means a literal that must match as is
type FormatElement = { readonly token: string | null, readonly text: string };

// the shortest text `_format` can ever produce for an element
function _min_length(element: FormatElement): number {
    switch (element.token) {
        case null: return element.text.length;
        case 'yyyy': return 4;
        case 'yy': return 2;
        case 'SSS': return 3;
        case 'XXX': return 1; // Z
        case 'a': return 2;
        case 'e': return 1;
        case 'E': return 3;
        case 'EE': return 6; // Sunday
        default: return 2; // MM dd HH hh mm ss
    }
}

// splits a format into literals and tokens, exactly the way `_format` reads it
export function _tokenize_format(format: string): FormatElement[] {
    const elements: FormatElement[] = [];
    format.split(/'/).forEach((s, i) => {
        if (i % 2 === 1) {
            if (s.length > 0) {
                elements.push({token: null, text: s});
            }
            return;
        }
        const re = /yyyy|yy|MM|dd|HH|hh|mm|ss|SSS|XXX|a|e|EE|E/g;
        let last = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(s)) !== null) {
            if (m.index > last) {
                elements.push({token: null, text: s.substring(last, m.index)});
            }
            elements.push({token: m[0], text: m[0]});
            last = m.index + m[0].length;
        }
        if (last < s.length) {
            elements.push({token: null, text: s.substring(last)});
        }
    });
    return elements;
}

// the reverse of `_format`
export function _parse(data: string, format: string, timezoneOffset: number): bigint {
    const elements = _tokenize_format(format);

    // minLeft[i] = the shortest text the elements from i to the end can consume
    const minLeft: number[] = new Array(elements.length + 1);
    minLeft[elements.length] = 0;
    for (let i = elements.length - 1; i >= 0; i--) {
        minLeft[i] = minLeft[i + 1] + _min_length(elements[i]);
    }

    const fail = (at: number): never => {
        throw new Error(`Unixtime: Invalid Date Format: cannot parse "${data}" as "${format}" at index ${at}`);
    };

    const isDigit = (at: number): boolean => {
        const c = data.charCodeAt(at);
        return c >= 48 && c <= 57;
    };

    const digits = (at: number, size: number): number => {
        if ((at + size) > data.length) {
            fail(at);
        }
        let n = 0;
        for (let i = 0; i < size; i++) {
            if (!isDigit(at + i)) {
                fail(at + i);
            }
            n = (n * 10) + (data.charCodeAt(at + i) - 48);
        }
        return n;
    };

    const name = (at: number, names: string[]): number => {
        const upper = data.substring(at).toUpperCase();
        for (let i = 0; i < names.length; i++) {
            if (upper.startsWith(names[i].toUpperCase())) {
                return i;
            }
        }
        return fail(at);
    };

    let pos = 0;
    let year: bigint | null = null;
    let month: number | null = null;
    let day: number | null = null;
    let hours: number | null = null;
    let hours12: number | null = null;
    let minutes: number | null = null;
    let seconds: number | null = null;
    let milliseconds: number | null = null;
    let pm: boolean | null = null;
    let tz: number | null = null;
    let week: number | null = null;

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        switch (element.token) {
            case null: {
                if (!data.startsWith(element.text, pos)) {
                    fail(pos);
                }
                pos += element.text.length;
                break;
            }
            // the year has no upper bound, so it takes every digit it can while
            // still leaving enough text for the rest of the format
            case 'yyyy':
            case 'yy': {
                let negative = false;
                if (data.charAt(pos) === '-') {
                    negative = true;
                    pos++;
                } else if (data.charAt(pos) === '+') {
                    pos++;
                }
                const from = pos;
                let to = pos;
                while (to < data.length && isDigit(to)) {
                    to++;
                }
                if (to === from) {
                    fail(from);
                }
                while (to > (from + 1) && (data.length - to) < minLeft[i + 1]) {
                    to--;
                }
                year = BigInt(data.substring(from, to));
                if (negative) {
                    year = -year;
                }
                pos = to;
                break;
            }
            case 'MM': month = digits(pos, 2); pos += 2; break;
            case 'dd': day = digits(pos, 2); pos += 2; break;
            case 'HH': hours = digits(pos, 2); pos += 2; break;
            case 'hh': hours12 = digits(pos, 2); pos += 2; break;
            case 'mm': minutes = digits(pos, 2); pos += 2; break;
            case 'ss': seconds = digits(pos, 2); pos += 2; break;
            case 'SSS': milliseconds = digits(pos, 3); pos += 3; break;
            case 'a': {
                pm = name(pos, ['AM', 'PM']) === 1;
                pos += 2;
                break;
            }
            case 'e': {
                if (!isDigit(pos) || data.charCodeAt(pos) > 54) {
                    fail(pos);
                }
                week = data.charCodeAt(pos) - 48;
                pos++;
                break;
            }
            case 'E':
            case 'EE': {
                const names = element.token === 'E' ? WEEK_E : WEEK_EE;
                week = name(pos, names);
                pos += names[week].length;
                break;
            }
            // Z or +HH:mm or +HHmm or +HH
            case 'XXX': {
                const c = data.charAt(pos);
                if (c === 'Z' || c === 'z') {
                    tz = 0;
                    pos++;
                    break;
                }
                if (c !== '+' && c !== '-') {
                    fail(pos);
                }
                // '+09:00' is 9 hours ahead of UTC, which is a timezone offset of -540
                const sign = c === '+' ? -1 : 1;
                pos++;
                const h = digits(pos, 2);
                pos += 2;
                let m = 0;
                if (data.charAt(pos) === ':') {
                    m = digits(pos + 1, 2);
                    pos += 3;
                } else if ((data.length - (pos + 2)) >= minLeft[i + 1] && isDigit(pos) && isDigit(pos + 1)) {
                    m = digits(pos, 2);
                    pos += 2;
                }
                tz = sign * ((h * 60) + m);
                break;
            }
            default: fail(pos);
        }
    }

    if (pos !== data.length) {
        fail(pos);
    }

    let hoursOfDay = 0;
    if (hours !== null) {
        hoursOfDay = hours;
    } else if (hours12 !== null) {
        if (pm === null) {
            hoursOfDay = hours12;
        } else {
            if (hours12 < 1 || hours12 > 12) {
                throw new Error(`Unixtime: Invalid Date Format: hour of am/pm is out of range: "${data}" as "${format}"`);
            }
            hoursOfDay = (hours12 % 12) + (pm ? 12 : 0);
        }
    } else if (pm !== null) {
        hoursOfDay = pm ? 12 : 0;
    }

    const offset = tz === null ? timezoneOffset : tz;
    const umillis = _merge_all(
        year === null ? 1970n : year,
        month === null ? 1 : month,
        day === null ? 1 : day,
        hoursOfDay,
        minutes === null ? 0 : minutes,
        seconds === null ? 0 : seconds,
        milliseconds === null ? 0 : milliseconds,
        offset,
    );

    if (week !== null && _to_week_un_timezone(_with_timezone_offset(umillis, offset)) !== week) {
        throw new Error(`Unixtime: Invalid Date Format: day of week does not match: "${data}" as "${format}"`);
    }

    return umillis;
}
