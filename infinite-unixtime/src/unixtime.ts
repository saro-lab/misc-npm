import {
    _format, _get_day_of_year, _get_last_day_of_month,
    _iso_week_of_month, _iso_week_of_year,
    _last_iso_week_of_month, _last_iso_week_of_year,
    _last_week_of_month, _last_week_of_year,
    _duration_millis,
    _merge_all, _parse, _plus_month,
    _relative_format,
    _to_date_time_detail, _to_E, _to_EE,
    _to_relative,
    _to_time_detail,
    _to_week_un_timezone,
    _week_of_month, _week_of_year,
    _with_timezone_offset,
    MD1,
    MH1,
    MM1,
    MS1, to_timestamp
} from "./util.js";
import {DateTimeDetail, Duration, RelativeDetail, RelativeTimeOptions, RelativeUnit, TimeDetail} from "./index.js";

const RELATIVE_UNITS_ALL: readonly RelativeUnit[] = ['day', 'hour', 'minute', 'second'];
const RELATIVE_LIMIT_DEFAULT: Duration = {days: 30};

export class Unixtime {
    readonly timestamp: bigint;
    constructor(umillis: bigint) {
        this.timestamp = umillis;
    }
    get $timestamp(): number {
        return Number(this.timestamp);
    }
    get time(): bigint {
        return this.timestamp / 1000n;
    }
    get $time(): number {
        return Number(this.timestamp / 1000n);
    }

    public static now() {
        return new Unixtime(BigInt(new Date().getTime()));
    }
    public static fromDate(date: Date): Unixtime {
        return new Unixtime(BigInt(date.getTime()));
    }
    public static fromMillis(unixMillis: bigint|number|string|Unixtime|Date): Unixtime {
        if (unixMillis instanceof Unixtime) {
            return unixMillis;
        } else if (unixMillis instanceof Date) {
            return new Unixtime(BigInt(unixMillis.getTime()));
        }
        return new Unixtime(BigInt(typeof unixMillis === 'number' ? Math.floor(unixMillis) : unixMillis));
    }
    public static fromSeconds(unixSeconds: bigint|number|string|Unixtime|Date): Unixtime {
        if (unixSeconds instanceof Unixtime) {
            return unixSeconds;
        } else if (unixSeconds instanceof Date) {
            return new Unixtime(BigInt(unixSeconds.getTime()));
        }
        return new Unixtime(BigInt(typeof unixSeconds === 'number' ? Math.floor(unixSeconds) : unixSeconds) * 1000n);
    }
    public static from(
        year: number|bigint = 1, month: number|bigint = 1, day: number|bigint = 1,
        hour: number|bigint = 0, minute: number|bigint = 0, second: number|bigint = 0, millisecond: number|bigint = 0,
        timezoneOffset = new Date().getTimezoneOffset(),
    ): Unixtime {
        return new Unixtime(_merge_all(year, month, day, hour, minute, second, millisecond, timezoneOffset));
    }
    public static fromUtc(
        year: number|bigint = 1, month: number|bigint = 1, day: number|bigint = 1,
        hour: number|bigint = 0, minute: number|bigint = 0, second: number|bigint = 0, millisecond: number|bigint = 0,
    ): Unixtime {
        return new Unixtime(_merge_all(year, month, day, hour, minute, second, millisecond, 0));
    }

    public static parse(
        data: string, dateFormat: string, timezoneOffset = new Date().getTimezoneOffset(),
    ): Unixtime {
        return new Unixtime(_parse(data, dateFormat, timezoneOffset));
    }

    public static parseUtc(data: string, dateFormat: string): Unixtime {
        return new Unixtime(_parse(data, dateFormat, 0));
    }

    public toTimeDetail(timezoneOffset = new Date().getTimezoneOffset()): TimeDetail {
        return _to_time_detail(this.timestamp, timezoneOffset);
    }

    public toDateTimeDetail(timezoneOffset = new Date().getTimezoneOffset()): DateTimeDetail {
        return _to_date_time_detail(this.timestamp, timezoneOffset);
    }

    public format(dateFormat: string, timezoneOffset = new Date().getTimezoneOffset()): string {
        return _format(this.toDateTimeDetail(timezoneOffset), dateFormat);
    }

    public formatUtc(dateFormat: string): string {
        return _format(this.toDateTimeDetail(0), dateFormat);
    }

    public toRelativeDetail(options: RelativeTimeOptions = {}): RelativeDetail | null {
        const base = options.base === undefined ? BigInt(new Date().getTime()) : to_timestamp(options.base);
        const limit = options.limit === false ? null : _duration_millis(options.limit ?? RELATIVE_LIMIT_DEFAULT);
        return _to_relative(
            this.timestamp - base,
            options.units ?? RELATIVE_UNITS_ALL,
            limit,
            options.future ?? 'keep',
        );
    }

    public toRelative(options: RelativeTimeOptions = {}): string | null {
        const detail = this.toRelativeDetail(options);
        if (detail === null) {
            return null;
        }
        return _relative_format(
            detail.value, detail.unit,
            options.locale, options.numeric ?? 'always', options.style ?? 'long',
        );
    }

    public toString(timezoneOffset = new Date().getTimezoneOffset()): string {
        return this.format(`yyyy-MM-dd (E) a hh:mm ss.SSS XXX`, timezoneOffset);
    }

    public getYear(timezoneOffset = new Date().getTimezoneOffset()): bigint {
        return this.toDateTimeDetail(timezoneOffset).year;
    }

    public getYearNumber(timezoneOffset = new Date().getTimezoneOffset()): number {
        return Number(this.toDateTimeDetail(timezoneOffset).year);
    }

    public getMonth(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toDateTimeDetail(timezoneOffset).month;
    }

    public getLastDayOfMonth(timezoneOffset = new Date().getTimezoneOffset()): number {
        const detail = this.toDateTimeDetail(timezoneOffset);
        return _get_last_day_of_month(detail.month, detail.leapYear);
    }

    public getDay(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toDateTimeDetail(timezoneOffset).day;
    }

    public isLeapYear(timezoneOffset = new Date().getTimezoneOffset()): boolean {
        return this.toDateTimeDetail(timezoneOffset).leapYear;
    }

    public getDayOfYear(timezoneOffset = new Date().getTimezoneOffset()): number {
        return _get_day_of_year(this.toDateTimeDetail(timezoneOffset));
    }

    public getWeekOfMonth(timezoneOffset = new Date().getTimezoneOffset()): number {
        return _week_of_month(this.toDateTimeDetail(timezoneOffset));
    }

    public getLastWeekOfMonth(timezoneOffset = new Date().getTimezoneOffset()): number {
        return _last_week_of_month(this.toDateTimeDetail(timezoneOffset));
    }

    public getWeekOfYear(timezoneOffset = new Date().getTimezoneOffset()): number {
        return _week_of_year(this.toDateTimeDetail(timezoneOffset));
    }

    public getLastWeekOfYear(timezoneOffset = new Date().getTimezoneOffset()): number {
        return _last_week_of_year(this.toDateTimeDetail(timezoneOffset));
    }

    public getIsoWeekOfMonth(timezoneOffset = new Date().getTimezoneOffset()): number {
        return _iso_week_of_month(this.toDateTimeDetail(timezoneOffset));
    }

    public getLastIsoWeekOfMonth(timezoneOffset = new Date().getTimezoneOffset()): number {
        return _last_iso_week_of_month(this.toDateTimeDetail(timezoneOffset));
    }

    public getIsoWeekOfYear(timezoneOffset = new Date().getTimezoneOffset()): number {
        return _iso_week_of_year(this.toDateTimeDetail(timezoneOffset));
    }

    public getLastIsoWeekOfYear(timezoneOffset = new Date().getTimezoneOffset()): number {
        return _last_iso_week_of_year(this.toDateTimeDetail(timezoneOffset));
    }

    public getWeek(timezoneOffset = new Date().getTimezoneOffset()): number {
        return _to_week_un_timezone(_with_timezone_offset(this.timestamp, timezoneOffset))
    }

    public getWeekShort(timezoneOffset = new Date().getTimezoneOffset()): string {
        return _to_E(this.getWeek(timezoneOffset));
    }

    public getWeekLong(timezoneOffset = new Date().getTimezoneOffset()): string {
        return _to_EE(this.getWeek(timezoneOffset));
    }

    public getHours(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toTimeDetail(timezoneOffset).hours;
    }

    public getHours12(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toTimeDetail(timezoneOffset).hours % 12 || 12;
    }

    public getAmPm(timezoneOffset = new Date().getTimezoneOffset()): string {
        return this.getHours(timezoneOffset) < 12 ? "AM" : "PM";
    }

    public getMinutes(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toTimeDetail(timezoneOffset).minutes;
    }

    public getSeconds(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toTimeDetail(timezoneOffset).seconds;
    }

    public getMilliseconds(timezoneOffset = new Date().getTimezoneOffset()): number {
        return this.toTimeDetail(timezoneOffset).milliseconds;
    }

    public toStringUtc(): string {
        return this.formatUtc(`yyyy-MM-dd (E) a hh:mm ss.SSS XXX`);
    }

    public toIsoString(timezoneOffset = new Date().getTimezoneOffset()): string {
        return this.format(`yyyy-MM-ddTHH:mm:ss.SSSXXX`, timezoneOffset);
    }

    public toIsoStringUtc(): string {
        return this.formatUtc(`yyyy-MM-ddTHH:mm:ss.SSSXXX`);
    }

    public plusMillis(milliseconds: number|bigint): Unixtime {
        return new Unixtime(this.timestamp + BigInt(milliseconds));
    }

    public plusSeconds(seconds: number|bigint): Unixtime {
        return new Unixtime(this.timestamp + (BigInt(seconds) * MS1));
    }

    public plusMinutes(minutes: number|bigint): Unixtime {
        return new Unixtime(this.timestamp + (BigInt(minutes) * MM1));
    }

    public plusHours(hours: number|bigint): Unixtime {
        return new Unixtime(this.timestamp + (BigInt(hours) * MH1));
    }

    public plusDays(days: number|bigint): Unixtime {
        return new Unixtime(this.timestamp + (BigInt(days) * MD1));
    }

    public plusMonth(months: number|bigint, timezoneOffset = new Date().getTimezoneOffset()): Unixtime {
        return new Unixtime(_plus_month(this.toDateTimeDetail(timezoneOffset), BigInt(months)));
    }

    public plusYear(years: number|bigint, timezoneOffset = new Date().getTimezoneOffset()): Unixtime {
        return new Unixtime(_plus_month(this.toDateTimeDetail(timezoneOffset), BigInt(years) * 12n));
    }

    public before(time: Unixtime|number|bigint|string|Date, seconds: boolean = false): boolean {
        return this.timestamp < to_timestamp(time, seconds);
    }

    public beforeEq(time: Unixtime|number|bigint|string|Date, seconds: boolean = false): boolean {
        return this.timestamp <= to_timestamp(time, seconds)
    }

    public after(time: Unixtime|number|bigint|string|Date, seconds: boolean = false): boolean {
        return this.timestamp > to_timestamp(time, seconds)
    }

    public afterEq(time: Unixtime|number|bigint|string|Date, seconds: boolean = false): boolean {
        return this.timestamp >= to_timestamp(time, seconds)
    }

    public between(start: Unixtime|number|bigint|string|Date, end: Unixtime|number|bigint|string|Date, seconds: boolean = false): boolean {
        return this.afterEq(start, seconds) && this.beforeEq(end, seconds);
    }
}
