import {assert, describe, expect, it} from 'vitest';
import "./index.js";
import {Unixtime} from "./unixtime";

const ISO = `yyyy-MM-dd'T'HH:mm:ss.SSSXXX`;
const PLAIN = `yyyy-MM-dd HH:mm:ss.SSS`;
const PACKED = `yyyyMMddHHmmssSSS`;
const FULL = `yyyy-MM-dd (E) a hh:mm ss.SSS XXX`;
// no SSS, so it can only carry a whole second
const LONG = `EE, dd MM yyyy HH:mm:ss XXX`;

// [format, the smallest unit the format can carry in millis]
const FORMATS: [string, bigint][] = [[ISO, 1n], [PLAIN, 1n], [PACKED, 1n], [FULL, 1n], [LONG, 1000n]];

// the largest multiple of `unit` that is not after `millis`
const floorTo = (millis: bigint, unit: bigint): bigint => {
    const m = millis % unit;
    return millis - (m < 0n ? m + unit : m);
};

describe('parse', () => {

    it('reads back what format wrote', async () => {
        for (const [format, unit] of FORMATS) {
            for (const timezoneOffset of [0, -540, 540, -60, 720, -720, 1439, -1439]) {
                for (let i = 0; i < 2000; i++) {
                    // 1600 ~ 2400 AD
                    const timestamp = floorTo(BigInt(Math.floor(Math.random() * 25246944000000) - 11676096000000), unit);
                    const u = new Unixtime(timestamp);
                    const text = u.format(format, timezoneOffset);
                    assert.equal(
                        Unixtime.parse(text, format, timezoneOffset).timestamp,
                        timestamp,
                        `"${text}" as "${format}" (${timezoneOffset})`,
                    );
                }
            }
        }
    });

    it('reads back BC dates', async () => {
        for (const [format, unit] of FORMATS) {
            for (let i = 0; i < 5000; i++) {
                // 3000 BC ~ 1 BC
                const timestamp = floorTo(BigInt(Math.floor(Math.random() * 94608000000000) - 156766732800000), unit);
                const u = new Unixtime(timestamp);
                const text = u.formatUtc(format);
                assert.equal(
                    Unixtime.parseUtc(text, format).timestamp,
                    timestamp,
                    `"${text}" as "${format}"`,
                );
            }
        }
    });

    it('reads back years far outside of the native Date range', async () => {
        const years = [
            23948923423421773421234n,
            -3472472928838222222282881717114n,
            99999999999999999999n,
            -1n, 0n, 1n, 9n, 99n, 999n, 10000n, -10000n,
        ];
        for (const year of years) {
            for (const [format, unit] of FORMATS) {
                const u = Unixtime.fromUtc(year, 1, 31, 12, 34, 56, unit === 1n ? 789 : 0);
                const text = u.formatUtc(format);
                assert.equal(Unixtime.parseUtc(text, format).timestamp, u.timestamp, `"${text}" as "${format}"`);
                assert.equal(Unixtime.parseUtc(text, format).getYear(0), year, `year of "${text}"`);
            }
        }
    });

    it('reads the documented examples', async () => {
        assert.equal(
            Unixtime.parseUtc('2026-03-31T14:30:00.000Z', ISO).toIsoStringUtc(),
            '2026-03-31T14:30:00.000Z',
        );
        assert.equal(
            Unixtime.parse('2026-03-31T14:30:00.000+09:00', ISO, 0).toIsoStringUtc(),
            '2026-03-31T05:30:00.000Z',
        );
        assert.equal(
            Unixtime.parseUtc('20260331143000000', PACKED).toIsoStringUtc(),
            '2026-03-31T14:30:00.000Z',
        );
        assert.equal(
            Unixtime.parseUtc('23948923423421773421234-01-31', 'yyyy-MM-dd').timestamp,
            Unixtime.fromUtc(23948923423421773421234n, 1, 31).timestamp,
        );
        assert.equal(
            Unixtime.parseUtc('-0100-03-31', 'yyyy-MM-dd').getYear(0),
            -100n,
        );
    });

    it('takes the timezone from XXX over the argument', async () => {
        // +09:00 wins over the UTC argument
        assert.equal(Unixtime.parse('2026-03-31 00:00 +09:00', 'yyyy-MM-dd HH:mm XXX', 0).toIsoStringUtc(),
            '2026-03-30T15:00:00.000Z');
        // Z wins over the +09:00 argument
        assert.equal(Unixtime.parse('2026-03-31 00:00 Z', 'yyyy-MM-dd HH:mm XXX', -540).toIsoStringUtc(),
            '2026-03-31T00:00:00.000Z');
        // without XXX the argument is used
        assert.equal(Unixtime.parse('2026-03-31 00:00', 'yyyy-MM-dd HH:mm', -540).toIsoStringUtc(),
            '2026-03-30T15:00:00.000Z');
        // and the argument defaults to the local timezone, like `format` does
        assert.equal(Unixtime.parse('2026-03-31 00:00', 'yyyy-MM-dd HH:mm').timestamp,
            Unixtime.from(2026, 3, 31, 0, 0).timestamp);
        // +HHmm and +HH are accepted too
        assert.equal(Unixtime.parseUtc('2026-03-31 00:00 +0900', 'yyyy-MM-dd HH:mm XXX').toIsoStringUtc(),
            '2026-03-30T15:00:00.000Z');
        assert.equal(Unixtime.parseUtc('2026-03-31 00:00 +09', 'yyyy-MM-dd HH:mm XXX').toIsoStringUtc(),
            '2026-03-30T15:00:00.000Z');
        assert.equal(Unixtime.parseUtc('2026-03-31 00:00 -0330', 'yyyy-MM-dd HH:mm XXX').toIsoStringUtc(),
            '2026-03-31T03:30:00.000Z');
    });

    it('resolves am / pm', async () => {
        assert.equal(Unixtime.parseUtc('2026-03-31 AM 12:00', 'yyyy-MM-dd a hh:mm').toIsoStringUtc(),
            '2026-03-31T00:00:00.000Z');
        assert.equal(Unixtime.parseUtc('2026-03-31 AM 09:30', 'yyyy-MM-dd a hh:mm').toIsoStringUtc(),
            '2026-03-31T09:30:00.000Z');
        assert.equal(Unixtime.parseUtc('2026-03-31 PM 12:00', 'yyyy-MM-dd a hh:mm').toIsoStringUtc(),
            '2026-03-31T12:00:00.000Z');
        assert.equal(Unixtime.parseUtc('2026-03-31 PM 09:30', 'yyyy-MM-dd a hh:mm').toIsoStringUtc(),
            '2026-03-31T21:30:00.000Z');
        assert.equal(Unixtime.parseUtc('2026-03-31 pm 09:30', 'yyyy-MM-dd a hh:mm').toIsoStringUtc(),
            '2026-03-31T21:30:00.000Z');
        // HH wins when both are present
        assert.equal(Unixtime.parseUtc('2026-03-31 AM 09:30 21', 'yyyy-MM-dd a hh:mm HH').toIsoStringUtc(),
            '2026-03-31T21:30:00.000Z');
    });

    it('checks the day of week against the parsed date', async () => {
        // 2026-03-31 is a tuesday
        assert.equal(Unixtime.parseUtc('2026-03-31 Tue', 'yyyy-MM-dd E').toIsoStringUtc(),
            '2026-03-31T00:00:00.000Z');
        assert.equal(Unixtime.parseUtc('2026-03-31 tue', 'yyyy-MM-dd E').toIsoStringUtc(),
            '2026-03-31T00:00:00.000Z');
        assert.equal(Unixtime.parseUtc('2026-03-31 Tuesday', 'yyyy-MM-dd EE').toIsoStringUtc(),
            '2026-03-31T00:00:00.000Z');
        assert.equal(Unixtime.parseUtc('2026-03-31 2', 'yyyy-MM-dd e').toIsoStringUtc(),
            '2026-03-31T00:00:00.000Z');
        expect(() => Unixtime.parseUtc('2026-03-31 Mon', 'yyyy-MM-dd E')).toThrow(/day of week/);
        expect(() => Unixtime.parseUtc('2026-03-31 Monday', 'yyyy-MM-dd EE')).toThrow(/day of week/);
        expect(() => Unixtime.parseUtc('2026-03-31 1', 'yyyy-MM-dd e')).toThrow(/day of week/);
    });

    it('defaults the missing fields to 1970-01-01 00:00:00.000', async () => {
        assert.equal(Unixtime.parseUtc('12:34', 'HH:mm').timestamp, 45240000n);
        assert.equal(Unixtime.parseUtc('12:34', 'HH:mm').toIsoStringUtc(), '1970-01-01T12:34:00.000Z');
        assert.equal(Unixtime.parseUtc('2026', 'yyyy').toIsoStringUtc(), '2026-01-01T00:00:00.000Z');
        assert.equal(Unixtime.parseUtc('03', 'MM').toIsoStringUtc(), '1970-03-01T00:00:00.000Z');
        assert.equal(Unixtime.parseUtc('2026-03', 'yyyy-MM').toIsoStringUtc(), '2026-03-01T00:00:00.000Z');
    });

    it('keeps the quoted parts as literals', async () => {
        assert.equal(Unixtime.parseUtc('2026 yyyy escape', `yyyy 'yyyy escape'`).getYear(0), 2026n);
        assert.equal(Unixtime.parseUtc('2026-03-31T00:00', `yyyy-MM-dd'T'HH:mm`).toIsoStringUtc(),
            '2026-03-31T00:00:00.000Z');
        expect(() => Unixtime.parseUtc('2026 yyyy escapo', `yyyy 'yyyy escape'`)).toThrow(/Invalid Date Format/);
    });

    it('throws on anything that does not match', async () => {
        // literal mismatch
        expect(() => Unixtime.parseUtc('2026/03/31', 'yyyy-MM-dd')).toThrow(/Invalid Date Format/);
        // fixed width fields are strict
        expect(() => Unixtime.parseUtc('2026-3-1', 'yyyy-MM-dd')).toThrow(/Invalid Date Format/);
        expect(() => Unixtime.parseUtc('2026-03-31 12:34:56.7', PLAIN)).toThrow(/Invalid Date Format/);
        // leftover text
        expect(() => Unixtime.parseUtc('2026-03-31 and more', 'yyyy-MM-dd')).toThrow(/Invalid Date Format/);
        // truncated text
        expect(() => Unixtime.parseUtc('2026-03-', 'yyyy-MM-dd')).toThrow(/Invalid Date Format/);
        expect(() => Unixtime.parseUtc('', 'yyyy-MM-dd')).toThrow(/Invalid Date Format/);
        // not a number
        expect(() => Unixtime.parseUtc('abcd-03-31', 'yyyy-MM-dd')).toThrow(/Invalid Date Format/);
        expect(() => Unixtime.parseUtc('2026-ab-31', 'yyyy-MM-dd')).toThrow(/Invalid Date Format/);
        // unknown names
        expect(() => Unixtime.parseUtc('2026-03-31 Xyz', 'yyyy-MM-dd E')).toThrow(/Invalid Date Format/);
        expect(() => Unixtime.parseUtc('2026-03-31 NM', 'yyyy-MM-dd a')).toThrow(/Invalid Date Format/);
        expect(() => Unixtime.parseUtc('2026-03-31 7', 'yyyy-MM-dd e')).toThrow(/Invalid Date Format/);
        // broken timezone
        expect(() => Unixtime.parseUtc('2026-03-31 00:00 09:00', 'yyyy-MM-dd HH:mm XXX')).toThrow(/Invalid Date Format/);
        expect(() => Unixtime.parseUtc('2026-03-31 00:00 +9:00', 'yyyy-MM-dd HH:mm XXX')).toThrow(/Invalid Date Format/);
    });

    it('throws on a date that does not exist', async () => {
        expect(() => Unixtime.parseUtc('2026-13-01', 'yyyy-MM-dd')).toThrow(/Invalid Date/);
        expect(() => Unixtime.parseUtc('2026-00-01', 'yyyy-MM-dd')).toThrow(/Invalid Date/);
        expect(() => Unixtime.parseUtc('2026-03-00', 'yyyy-MM-dd')).toThrow(/Invalid Date/);
        expect(() => Unixtime.parseUtc('2026-03-32', 'yyyy-MM-dd')).toThrow(/Invalid Date/);
        expect(() => Unixtime.parseUtc('2026-04-31', 'yyyy-MM-dd')).toThrow(/Invalid Date/);
        // 2026 is not a leap year, 2024 is
        expect(() => Unixtime.parseUtc('2026-02-29', 'yyyy-MM-dd')).toThrow(/Invalid Date/);
        assert.equal(Unixtime.parseUtc('2024-02-29', 'yyyy-MM-dd').toIsoStringUtc(), '2024-02-29T00:00:00.000Z');
        // year 0 is a leap year, year -1 is not
        assert.equal(Unixtime.parseUtc('0000-02-29', 'yyyy-MM-dd').getDay(0), 29);
        expect(() => Unixtime.parseUtc('-0001-02-29', 'yyyy-MM-dd')).toThrow(/Invalid Date/);
        // out of range time
        expect(() => Unixtime.parseUtc('24:00', 'HH:mm')).toThrow(/Invalid Date/);
        expect(() => Unixtime.parseUtc('00:60', 'HH:mm')).toThrow(/Invalid Date/);
        expect(() => Unixtime.parseUtc('13 PM', 'hh a')).toThrow(/hour of am\/pm/);
        expect(() => Unixtime.parseUtc('00 AM', 'hh a')).toThrow(/hour of am\/pm/);
    });
});
