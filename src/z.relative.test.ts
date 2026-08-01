import {assert, describe, expect, it} from 'vitest';
import "./index.js";
import {Unixtime} from "./unixtime";
import {RelativeDetail, RelativeTimeOptions} from "./index.js";

const BASE = Unixtime.fromUtc(2026, 3, 31, 12, 0, 0, 0);

// `from` millis away from BASE
const at = (millis: number | bigint): Unixtime => BASE.plusMillis(millis);

const detail = (millis: number | bigint, options: RelativeTimeOptions = {}): RelativeDetail | null =>
    at(millis).toRelativeDetail({base: BASE, ...options});

const text = (millis: number | bigint, options: RelativeTimeOptions = {}): string | null =>
    at(millis).toRelative({base: BASE, locale: 'en', ...options});

const S = 1000;
const M = 60 * S;
const H = 60 * M;
const D = 24 * H;

describe('relative', () => {

    it('picks the largest unit that the difference fills', async () => {
        const cases: [number, number, string][] = [
            [0, -0, 'second'],
            [-1, -0, 'second'],
            [-999, -0, 'second'],
            [-S, -1, 'second'],
            [-3 * S, -3, 'second'],
            [-59 * S, -59, 'second'],
            [-M, -1, 'minute'],
            [-M - 999, -1, 'minute'],
            [-59 * M, -59, 'minute'],
            [-H, -1, 'hour'],
            [-23 * H, -23, 'hour'],
            [-D, -1, 'day'],
            [-30 * D, -30, 'day'],
        ];
        for (const [millis, value, unit] of cases) {
            const d = detail(millis);
            assert.deepEqual(
                [d?.value, d?.unit], [value, unit],
                `${millis}ms`,
            );
        }
    });

    it('truncates toward zero instead of rounding', async () => {
        // 59.9 seconds is still 59 seconds, never 60
        assert.equal(detail(-59 * S - 999)?.value, -59);
        assert.equal(detail(-59 * S - 999)?.unit, 'second');
        // 90 minutes is 1 hour
        assert.deepEqual([detail(-90 * M)?.value, detail(-90 * M)?.unit], [-1, 'hour']);
        // 47 hours is 1 day
        assert.deepEqual([detail(-47 * H)?.value, detail(-47 * H)?.unit], [-1, 'day']);
    });

    it('reports the future with a positive value', async () => {
        assert.deepEqual([detail(S)?.value, detail(S)?.unit], [1, 'second']);
        assert.deepEqual([detail(31 * M)?.value, detail(31 * M)?.unit], [31, 'minute']);
        assert.deepEqual([detail(30 * D)?.value, detail(30 * D)?.unit], [30, 'day']);
        assert.equal(text(S), 'in 1 second');
        assert.equal(text(3 * D), 'in 3 days');
    });

    it('keeps the raw difference in millis', async () => {
        assert.equal(detail(-59 * S - 999)?.millis, -59999n);
        assert.equal(detail(3 * D)?.millis, 259200000n);
        // bigint all the way, so a difference outside the Number range is still exact
        const far = Unixtime.fromUtc(300000, 1, 1);
        const away = far.timestamp - BASE.timestamp;
        assert.equal(away > BigInt(Number.MAX_SAFE_INTEGER), true);
        assert.equal(far.toRelativeDetail({base: BASE, limit: false})?.millis, away);
    });

    it('returns null beyond the limit', async () => {
        // the default limit is 30 days, and it is inclusive
        assert.equal(detail(-30 * D)?.value, -30);
        assert.equal(detail(-30 * D - 1), null);
        assert.equal(detail(30 * D + 1), null);
        assert.equal(text(-30 * D - 1), null);
        // a custom limit, in any mix of units
        assert.equal(detail(-2 * H, {limit: {hours: 2}})?.value, -2);
        assert.equal(detail(-2 * H - 1, {limit: {hours: 2}}), null);
        assert.equal(detail(-90 * M, {limit: {hours: 1, minutes: 30}})?.value, -1);
        assert.equal(detail(-90 * M - 1, {limit: {hours: 1, minutes: 30}}), null);
        assert.equal(detail(-D, {limit: {millis: 1}}), null);
        // false lifts the limit
        assert.equal(detail(-3650 * D, {limit: false})?.value, -3650);
    });

    it('reports a time too far away for a safe integer as null', async () => {
        const far = Unixtime.fromUtc(23948923423421773421234n, 1, 31);
        assert.equal(far.toRelativeDetail({base: BASE, limit: false, units: ['day']}), null);
        assert.equal(far.toRelative({base: BASE, limit: false, units: ['day']}), null);
        // right at the edge of what a Number can hold
        const days = BigInt(Number.MAX_SAFE_INTEGER);
        assert.equal(
            BASE.plusDays(days).toRelativeDetail({base: BASE, limit: false, units: ['day']})?.value,
            Number.MAX_SAFE_INTEGER,
        );
        assert.equal(
            BASE.plusDays(days + 1n).toRelativeDetail({base: BASE, limit: false, units: ['day']}),
            null,
        );
    });

    it('only uses the units it is given', async () => {
        // no hour or day, so it keeps counting minutes
        assert.deepEqual(
            [detail(-90 * M, {units: ['minute', 'second']})?.value, detail(-90 * M, {units: ['minute', 'second']})?.unit],
            [-90, 'minute'],
        );
        assert.deepEqual(
            [detail(-3 * D, {units: ['hour']})?.value, detail(-3 * D, {units: ['hour']})?.unit],
            [-72, 'hour'],
        );
        // nothing fills the smallest unit given, so it reports zero of it
        assert.deepEqual(
            [detail(-30 * S, {units: ['day', 'hour']})?.value, detail(-30 * S, {units: ['day', 'hour']})?.unit],
            [-0, 'hour'],
        );
        // the order of the array does not matter
        assert.deepEqual(
            [detail(-3 * H, {units: ['second', 'day', 'hour']})?.value, detail(-3 * H, {units: ['second', 'day', 'hour']})?.unit],
            [-3, 'hour'],
        );
        expect(() => detail(-S, {units: []})).toThrow(/units is empty/);
    });

    it('reports the future as now when asked to', async () => {
        assert.deepEqual([detail(S, {future: 'now'})?.value, detail(S, {future: 'now'})?.unit], [-0, 'second']);
        assert.deepEqual([detail(400 * D, {future: 'now'})?.value, detail(400 * D, {future: 'now'})?.unit], [-0, 'second']);
        // which is what makes it read as the past, not as "in 0 seconds"
        assert.equal(text(S, {future: 'now'}), '0 seconds ago');
        assert.equal(text(S, {future: 'now', numeric: 'auto'}), 'now');
        assert.equal(text(S, {future: 'now', locale: 'ko'}), '0초 전');
        // the past is untouched
        assert.equal(detail(-3 * S, {future: 'now'})?.value, -3);
        assert.equal(detail(-400 * D, {future: 'now'}), null);
        // the clamped time is never beyond the limit
        assert.equal(detail(400 * D, {future: 'now', limit: {millis: 1}})?.value, 0);
        // and the smallest unit given is the one used
        assert.deepEqual(
            [detail(S, {future: 'now', units: ['minute']})?.value, detail(S, {future: 'now', units: ['minute']})?.unit],
            [-0, 'minute'],
        );
    });

    it('defaults the base to now', async () => {
        assert.equal(Unixtime.now().toRelativeDetail()?.value, 0);
        assert.equal(Unixtime.now().plusSeconds(-3).toRelativeDetail()?.unit, 'second');
        assert.equal(Unixtime.now().plusSeconds(-3).toRelativeDetail()?.value, -3);
        assert.equal(Unixtime.now().plusDays(-31).toRelativeDetail(), null);
        // and takes anything a Unixtime can be built from
        for (const base of [BASE, BASE.$timestamp, BASE.timestamp, BASE.timestamp.toString(), new Date(BASE.$timestamp)]) {
            assert.equal(at(-3 * D).toRelativeDetail({base})?.value, -3, `base ${typeof base}`);
        }
    });

    it('leaves the wording to the locale', async () => {
        // numeric: 'always' is the default
        assert.equal(text(0), '0 seconds ago');
        assert.equal(text(-D), '1 day ago');
        assert.equal(text(0, {numeric: 'auto'}), 'now');
        assert.equal(text(-D, {numeric: 'auto'}), 'yesterday');
        assert.equal(text(D, {numeric: 'auto'}), 'tomorrow');
        assert.equal(text(-3 * D, {locale: 'ko'}), '3일 전');
        assert.equal(text(3 * S, {locale: 'ko'}), '3초 후');
        assert.equal(text(0, {locale: 'ko', numeric: 'auto'}), '지금');
        assert.equal(text(0, {locale: 'ja', numeric: 'auto'}), '今');
        // a list of locales, the first supported one wins
        assert.equal(text(-3 * D, {locale: ['xx', 'ko']}), '3일 전');
        // style goes straight to Intl.RelativeTimeFormat
        assert.equal(text(-3 * D, {style: 'narrow'}), '3d ago');
        // the exact wording is ICU data, so only the fact that style reaches it is asserted
        assert.notEqual(
            text(-3 * D, {locale: 'fr', style: 'short'}),
            text(-3 * D, {locale: 'fr', style: 'long'}),
        );
    });
});
