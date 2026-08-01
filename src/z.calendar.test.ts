import {assert, describe, expect, it} from 'vitest';
import "./index.js";
import {Unixtime} from "./unixtime";

const MD = 86400000;

// native Date reference builder.
// `Date.UTC(year, ...)` maps 0 ~ 99 to 1900 ~ 1999, `setUTCFullYear` does not.
const utc = (
    year: number, month: number, day: number,
    hours = 0, minutes = 0, seconds = 0, millis = 0,
): Date => {
    const d = new Date(0);
    d.setUTCFullYear(year, month - 1, day);
    d.setUTCHours(hours, minutes, seconds, millis);
    return d;
};

// proleptic gregorian leap year, asked to the native Date instead of our own rule
const refIsLeapYear = (year: number): boolean => utc(year, 2, 29).getUTCMonth() === 1;

const refDayLenOfMonth = (year: number, month: number): number =>
    new Date(utc(year, month + 1, 1).getTime() - MD).getUTCDate();

const refDayLenOfYear = (year: number): number => refIsLeapYear(year) ? 366 : 365;

// canonical ISO 8601 week of year: the week of the Thursday that shares this week
const refIsoWeekOfYear = (date: Date): number => {
    const isoWeek = date.getUTCDay() || 7;
    const thursday = new Date(date.getTime() + ((4 - isoWeek) * MD));
    const januaryFirst = utc(thursday.getUTCFullYear(), 1, 1);
    return Math.floor(Math.round((thursday.getTime() - januaryFirst.getTime()) / MD) / 7) + 1;
};

// december 28th always falls in the last ISO week of its own year
const refLastIsoWeekOfYear = (date: Date): number => {
    const isoWeek = date.getUTCDay() || 7;
    const thursday = new Date(date.getTime() + ((4 - isoWeek) * MD));
    return refIsoWeekOfYear(utc(thursday.getUTCFullYear(), 12, 28));
};

describe('BC / UTC integrity', () => {

    it('every day from 100 BC to 100 AD keeps its date, weekday and time', async () => {
        const from = utc(-100, 1, 1).getTime();
        const to = utc(101, 1, 1).getTime();
        let previousWeek = -1;

        for (let ts = from, i = 0; ts < to; ts += MD, i++) {
            // spread the time of day around so the fields are exercised too
            const millis = (i * 37) % MD;
            const date = new Date(ts + millis);
            const u = Unixtime.fromMillis(BigInt(ts + millis));
            const detail = u.toDateTimeDetail(0);

            const expected = [
                date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCDay(),
                date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds(),
            ].join(' ');
            const actual = [
                Number(detail.year), detail.month, detail.day, detail.week,
                detail.hours, detail.minutes, detail.seconds, detail.milliseconds,
            ].join(' ');

            if (expected !== actual) {
                assert.fail(`${new Date(ts).toISOString()}: expected "${expected}" but got "${actual}"`);
            }

            // the weekday must never skip or repeat across the BC/AD border
            if (previousWeek >= 0) {
                assert.equal(detail.week, (previousWeek + 1) % 7, `weekday twisted at ${expected}`);
            }
            previousWeek = detail.week;

            // day of year, counted from the native Date
            const dayOfYear = Math.round((ts - utc(date.getUTCFullYear(), 1, 1).getTime()) / MD) + 1;
            assert.equal(u.getDayOfYear(0), dayOfYear, `day of year at ${expected}`);
            assert.equal(u.isLeapYear(0), refIsLeapYear(date.getUTCFullYear()), `leap year at ${expected}`);

            // and the same date must merge back to the same timestamp
            assert.equal(
                Unixtime.fromUtc(
                    detail.year, detail.month, detail.day,
                    detail.hours, detail.minutes, detail.seconds, detail.milliseconds,
                ).timestamp,
                BigInt(ts + millis),
                `merge back at ${expected}`,
            );
        }
    });

    it('random days over 50000 BC ~ 50000 AD keep their date and weekday', async () => {
        const from = utc(-50000, 1, 1).getTime();
        const to = utc(50000, 1, 1).getTime();
        const days = Math.round((to - from) / MD);

        for (let i = 0; i < 200000; i++) {
            const ts = from + (Math.floor(Math.random() * days) * MD) + Math.floor(Math.random() * MD);
            const date = new Date(ts);
            const detail = Unixtime.fromMillis(BigInt(ts)).toDateTimeDetail(0);

            const expected = [
                date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCDay(),
                date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds(),
            ].join(' ');
            const actual = [
                Number(detail.year), detail.month, detail.day, detail.week,
                detail.hours, detail.minutes, detail.seconds, detail.milliseconds,
            ].join(' ');

            if (expected !== actual) {
                assert.fail(`${ts}: expected "${expected}" but got "${actual}"`);
            }
        }
    });

    // regression: the negative side of _split_year used to lose the leap flag
    // when the time landed exactly on a 400 year boundary
    it('january 1st 00:00:00.000 UTC of a 400 year boundary is a leap year', async () => {
        for (const year of [-2000n, -1600n, -1200n, -800n, -400n, 0n, 400n, 800n, 1200n, 1600n, 2000n, 2400n]) {
            const u = Unixtime.fromUtc(year, 1, 1);
            assert.equal(u.getYear(0), year, `year ${year}`);
            assert.equal(u.getMonth(0), 1, `month of ${year}`);
            assert.equal(u.getDay(0), 1, `day of ${year}`);
            assert.equal(u.getDayOfYear(0), 1, `day of year of ${year}`);
            assert.equal(u.isLeapYear(0), true, `leap year of ${year}`);
            assert.equal(u.getLastDayOfMonth(0), 31, `last day of january of ${year}`);
            assert.equal(u.plusMonth(1, 0).getLastDayOfMonth(0), 29, `last day of february of ${year}`);
        }
        for (const year of [-1900n, -100n, 100n, 1700n, 1800n, 1900n, 2100n]) {
            assert.equal(Unixtime.fromUtc(year, 1, 1).isLeapYear(0), false, `leap year of ${year}`);
        }
    });

    it('BC leap years follow the proleptic gregorian rule', async () => {
        // year 0 = 1 BC, year -1 = 2 BC (astronomical year numbering, same as java.time)
        for (const year of [0, -4, -8, -400, -800, -2000]) {
            const u = Unixtime.fromUtc(year, 2, 29);
            assert.equal(u.getMonth(0), 2, `${year}-02-29 exists`);
            assert.equal(u.getDay(0), 29, `${year}-02-29 exists`);
            assert.equal(u.timestamp, BigInt(utc(year, 2, 29).getTime()), `${year}-02-29 timestamp`);
        }
        for (const year of [-1, -2, -3, -100, -200, -300, -1900]) {
            expect(() => Unixtime.fromUtc(year, 2, 29), `${year}-02-29 must not exist`).toThrow();
        }
    });

    it('keeps the README BC assertions', async () => {
        assert.equal(Unixtime.fromUtc(0, 1, 1).timestamp, -62167219200000n);
        assert.equal(Unixtime.fromUtc(0, 1, 1).getWeekShort(0), 'Sat');
        assert.equal(Unixtime.fromUtc(-2, 12, 31, 23, 59, 59).timestamp, -62198755201000n);
        assert.equal(Unixtime.fromUtc(-2, 12, 31, 23, 59, 59).getWeekShort(0), 'Thu');
        assert.equal(Unixtime.fromUtc(-4, 2, 29, 23, 59, 59).timestamp, -62288265601000n);
        assert.equal(Unixtime.fromUtc(-4, 2, 29, 23, 59, 59).getWeekShort(0), 'Thu');
        assert.equal(Unixtime.fromUtc(-2000, 2, 29, 23, 59, 59).timestamp, -125275939201000n);
        assert.equal(Unixtime.fromUtc(-2000, 2, 29, 23, 59, 59).getWeekShort(0), 'Tue');
        assert.equal(Unixtime.fromUtc(-2000, 3, 1, 0, 0, 0).timestamp, -125275939200000n);
        assert.equal(Unixtime.fromUtc(-2000, 3, 1, 0, 0, 0).getWeekShort(0), 'Wed');
    });
});

describe('plusMonth / plusYear', () => {

    const ymd = (u: Unixtime): string => u.formatUtc('yyyy-MM-dd HH:mm:ss.SSS');

    it('keeps the day of month, clamping to the last day', async () => {
        // the day must stay put, and only shrink when the target month is shorter
        assert.equal(ymd(Unixtime.fromUtc(2026, 3, 31).plusMonth(1, 0)), '2026-04-30 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2026, 4, 30).plusMonth(1, 0)), '2026-05-30 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2026, 5, 30).plusMonth(1, 0)), '2026-06-30 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2026, 1, 31).plusMonth(1, 0)), '2026-02-28 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2024, 1, 31).plusMonth(1, 0)), '2024-02-29 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2026, 1, 31).plusMonth(3, 0)), '2026-04-30 00:00:00.000');

        // clamping is not remembered, the original day is lost by design
        assert.equal(ymd(Unixtime.fromUtc(2026, 3, 31).plusMonth(1, 0).plusMonth(1, 0)), '2026-05-30 00:00:00.000');
    });

    it('crosses the year, including backwards and through year zero', async () => {
        assert.equal(ymd(Unixtime.fromUtc(2026, 12, 31).plusMonth(1, 0)), '2027-01-31 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2026, 1, 31).plusMonth(-1, 0)), '2025-12-31 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2026, 3, 31).plusMonth(-1, 0)), '2026-02-28 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2026, 3, 31).plusMonth(-13, 0)), '2025-02-28 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2026, 6, 15).plusMonth(0, 0)), '2026-06-15 00:00:00.000');

        // 1 AD january -> 1 BC december (year 0)
        assert.equal(ymd(Unixtime.fromUtc(1, 1, 31).plusMonth(-1, 0)), '0000-12-31 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(0, 1, 31).plusMonth(-1, 0)), '-0001-12-31 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(0, 12, 31).plusMonth(1, 0)), '0001-01-31 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(-1, 12, 31).plusMonth(1, 0)), '0000-01-31 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(0, 1, 31).plusMonth(1, 0)), '0000-02-29 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(-1, 1, 31).plusMonth(1, 0)), '-0001-02-28 00:00:00.000');
    });

    it('keeps the time of day', async () => {
        assert.equal(
            ymd(Unixtime.fromUtc(2026, 3, 31, 23, 59, 59, 999).plusMonth(1, 0)),
            '2026-04-30 23:59:59.999',
        );
        assert.equal(
            Unixtime.from(2026, 3, 31, 13, 45, 0, 0, -540).plusMonth(1, -540).toIsoString(-540),
            '2026-04-30T13:45:00.000+09:00',
        );
    });

    it('plusYear clamps february 29th', async () => {
        assert.equal(ymd(Unixtime.fromUtc(2024, 2, 29).plusYear(1, 0)), '2025-02-28 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2024, 2, 29).plusYear(4, 0)), '2028-02-29 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2024, 2, 29).plusYear(-1, 0)), '2023-02-28 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2000, 2, 29).plusYear(100, 0)), '2100-02-28 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(-4, 2, 29).plusYear(1, 0)), '-0003-02-28 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(-4, 2, 29).plusYear(4, 0)), '0000-02-29 00:00:00.000');
        assert.equal(ymd(Unixtime.fromUtc(2026, 6, 15).plusYear(1, 0)), '2027-06-15 00:00:00.000');
    });

    it('plusYear equals plusMonth by twelve', async () => {
        const u = Unixtime.fromUtc(2024, 2, 29, 11, 22, 33, 444);
        for (let y = -30; y <= 30; y++) {
            assert.equal(u.plusYear(y, 0).timestamp, u.plusMonth(y * 12, 0).timestamp, `${y} year`);
        }
    });

    it('survives huge bigint steps', async () => {
        const u = Unixtime.fromUtc(2026, 1, 31);
        assert.equal(ymd(u.plusYear(1000000000000n, 0)), '1000000002026-01-31 00:00:00.000');
        assert.equal(ymd(u.plusYear(-1000000000000n, 0)), '-999999997974-01-31 00:00:00.000');
        assert.equal(u.plusMonth(12000000n, 0).getYear(0), 2026n + 1000000n);
    });

    it('matches a reference implementation from 100 BC to 2200 AD', async () => {
        for (let year = -100; year <= 2200; year += 7) {
            for (let month = 1; month <= 12; month++) {
                for (const day of [1, 15, 28, 29, 30, refDayLenOfMonth(year, month)]) {
                    if (day > refDayLenOfMonth(year, month)) {
                        continue;
                    }
                    const u = Unixtime.fromUtc(year, month, day, 12, 34, 56, 789);
                    for (const months of [-25, -13, -12, -11, -1, 1, 11, 12, 13, 25]) {
                        const total = (year * 12) + (month - 1) + months;
                        const ny = Math.floor(total / 12);
                        const nm = (((total % 12) + 12) % 12) + 1;
                        const nd = Math.min(day, refDayLenOfMonth(ny, nm));
                        assert.equal(
                            ymd(u.plusMonth(months, 0)),
                            `${ny < 0 ? '-' : ''}${String(Math.abs(ny)).padStart(4, '0')}-` +
                            `${String(nm).padStart(2, '0')}-${String(nd).padStart(2, '0')} 12:34:56.789`,
                            `${year}-${month}-${day} plus ${months} month`,
                        );
                    }
                }
            }
        }
    });
});

describe('week of month / week of year', () => {

    // BC and AD years covering every weekday of january 1st, leap and non leap,
    // and both sides of the 100 / 400 year leap exceptions
    const YEARS = [
        -2000, -401, -400, -399, -101, -100, -99, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5,
        99, 100, 101, 399, 400, 401, 1200, 1582, 1600, 1900, 1904, 1999, 2000, 2001,
        2020, 2024, 2025, 2026, 2027, 2028, 2100, 2400,
    ];

    it('matches a counting reference implementation', async () => {
        for (const year of YEARS) {
            const dayLenOfYear = refDayLenOfYear(year);

            // walked references, counted day by day instead of computed
            let weekOfYear = 1; // sunday start, minimal 1 day, so day 1 is always week 1
            let lastWeekOfYear = 0;
            let lastWeekOfMonth = 0;
            let lastIsoWeekOfMonth = 0;

            for (let month = 1; month <= 12; month++) {
                const dayLenOfMonth = refDayLenOfMonth(year, month);
                const firstWeek = utc(year, month, 1).getUTCDay();
                let weekOfMonth = 1;
                // ISO: the leading partial week belongs to the previous month when shorter than 4 days
                let isoWeekOfMonth = (7 - ((firstWeek + 6) % 7)) >= 4 ? 1 : 0;

                for (let day = 1; day <= dayLenOfMonth; day++) {
                    const date = utc(year, month, day);
                    const week = date.getUTCDay();
                    if (day > 1) {
                        if (week === 0) weekOfMonth++;
                        if (week === 1) isoWeekOfMonth++;
                    }
                    if (!(month === 1 && day === 1)) {
                        if (week === 0) weekOfYear++;
                    }

                    const u = Unixtime.fromMillis(BigInt(date.getTime()));
                    const at = `${year}-${month}-${day}`;

                    assert.equal(u.getWeekOfMonth(0), weekOfMonth, `week of month at ${at}`);
                    assert.equal(u.getWeekOfYear(0), weekOfYear, `week of year at ${at}`);
                    assert.equal(u.getIsoWeekOfMonth(0), isoWeekOfMonth, `iso week of month at ${at}`);
                    assert.equal(u.getIsoWeekOfYear(0), refIsoWeekOfYear(date), `iso week of year at ${at}`);
                    assert.equal(u.getLastIsoWeekOfYear(0), refLastIsoWeekOfYear(date), `last iso week of year at ${at}`);
                    assert.equal(
                        u.getDayOfYear(0),
                        Math.round((date.getTime() - utc(year, 1, 1).getTime()) / MD) + 1,
                        `day of year at ${at}`,
                    );
                }

                lastWeekOfMonth = weekOfMonth;
                lastIsoWeekOfMonth = isoWeekOfMonth;
                lastWeekOfYear = weekOfYear;

                // every day of the month reports the same last week of month
                for (let day = 1; day <= dayLenOfMonth; day++) {
                    const u = Unixtime.fromUtc(year, month, day);
                    assert.equal(u.getLastWeekOfMonth(0), lastWeekOfMonth, `last week of month at ${year}-${month}-${day}`);
                    assert.equal(u.getLastIsoWeekOfMonth(0), lastIsoWeekOfMonth, `last iso week of month at ${year}-${month}-${day}`);
                }
            }

            // every day of the year reports the same last week of year
            for (let dayOfYear = 1; dayOfYear <= dayLenOfYear; dayOfYear++) {
                const u = Unixtime.fromMillis(BigInt(utc(year, 1, 1).getTime() + ((dayOfYear - 1) * MD)));
                assert.equal(u.getLastWeekOfYear(0), lastWeekOfYear, `last week of year at ${year} day ${dayOfYear}`);
            }
        }
    });

    it('holds the ISO 8601 invariants', async () => {
        for (const year of YEARS) {
            // january 4th and december 28th are always in the first / last ISO week
            assert.equal(Unixtime.fromUtc(year, 1, 4).getIsoWeekOfYear(0), 1, `${year}-01-04`);
            const december28 = Unixtime.fromUtc(year, 12, 28);
            assert.equal(
                december28.getIsoWeekOfYear(0),
                december28.getLastIsoWeekOfYear(0),
                `${year}-12-28 is in the last ISO week`,
            );
            assert.include([52, 53], december28.getLastIsoWeekOfYear(0), `${year} ISO week count`);

            for (let dayOfYear = 1; dayOfYear <= refDayLenOfYear(year); dayOfYear++) {
                const u = Unixtime.fromMillis(BigInt(utc(year, 1, 1).getTime() + ((dayOfYear - 1) * MD)));
                const week = u.getIsoWeekOfYear(0);
                assert.isTrue(week >= 1 && week <= u.getLastIsoWeekOfYear(0), `${year} day ${dayOfYear} week ${week}`);
                // the ISO week only changes on monday
                const next = u.plusDays(1);
                assert.equal(
                    next.getIsoWeekOfYear(0) === week,
                    next.getWeek(0) !== 1,
                    `${year} day ${dayOfYear} ISO week must change on monday only`,
                );
            }
        }
    });

    it('reads the known 2026 calendar', async () => {
        // 2026-01-01 is a thursday, so 2026 has 53 ISO weeks
        const januaryFirst = Unixtime.fromUtc(2026, 1, 1);
        assert.equal(januaryFirst.getWeekShort(0), 'Thu');
        assert.equal(januaryFirst.getWeekOfYear(0), 1);
        assert.equal(januaryFirst.getWeekOfMonth(0), 1);
        assert.equal(januaryFirst.getIsoWeekOfYear(0), 1);
        assert.equal(januaryFirst.getLastIsoWeekOfYear(0), 53);
        assert.equal(januaryFirst.getIsoWeekOfMonth(0), 1);
        assert.equal(januaryFirst.getDayOfYear(0), 1);

        // 2026-04-01 is a wednesday
        assert.equal(Unixtime.fromUtc(2026, 4, 1).getWeekShort(0), 'Wed');
        assert.equal(Unixtime.fromUtc(2026, 4, 1).getWeekOfMonth(0), 1);
        assert.equal(Unixtime.fromUtc(2026, 4, 4).getWeekOfMonth(0), 1);
        assert.equal(Unixtime.fromUtc(2026, 4, 5).getWeekOfMonth(0), 2); // sunday
        assert.equal(Unixtime.fromUtc(2026, 4, 30).getWeekOfMonth(0), 5);
        assert.equal(Unixtime.fromUtc(2026, 4, 1).getLastWeekOfMonth(0), 5);
        // ISO: 04-01 ~ 04-05 is a 5 day leading week, long enough to be week 1
        assert.equal(Unixtime.fromUtc(2026, 4, 1).getIsoWeekOfMonth(0), 1);
        assert.equal(Unixtime.fromUtc(2026, 4, 6).getIsoWeekOfMonth(0), 2); // monday
        assert.equal(Unixtime.fromUtc(2026, 4, 30).getIsoWeekOfMonth(0), 5);
        assert.equal(Unixtime.fromUtc(2026, 4, 1).getLastIsoWeekOfMonth(0), 5);

        // 2026-08-01 is a saturday, so ISO week 1 of august starts on 08-03
        assert.equal(Unixtime.fromUtc(2026, 8, 1).getWeekShort(0), 'Sat');
        assert.equal(Unixtime.fromUtc(2026, 8, 1).getWeekOfMonth(0), 1);
        assert.equal(Unixtime.fromUtc(2026, 8, 1).getIsoWeekOfMonth(0), 0);
        assert.equal(Unixtime.fromUtc(2026, 8, 2).getIsoWeekOfMonth(0), 0);
        assert.equal(Unixtime.fromUtc(2026, 8, 3).getIsoWeekOfMonth(0), 1);

        // 2025-12-29 (monday) already belongs to ISO week 1 of 2026
        assert.equal(Unixtime.fromUtc(2025, 12, 29).getIsoWeekOfYear(0), 1);
        assert.equal(Unixtime.fromUtc(2025, 12, 29).getLastIsoWeekOfYear(0), 53);
        // 2027-01-01 (friday) still belongs to ISO week 53 of 2026
        assert.equal(Unixtime.fromUtc(2027, 1, 1).getIsoWeekOfYear(0), 53);
        assert.equal(Unixtime.fromUtc(2027, 1, 1).getLastIsoWeekOfYear(0), 53);
        assert.equal(Unixtime.fromUtc(2027, 1, 4).getIsoWeekOfYear(0), 1);
        assert.equal(Unixtime.fromUtc(2027, 1, 4).getLastIsoWeekOfYear(0), 52);

        assert.equal(Unixtime.fromUtc(2026, 12, 31).getDayOfYear(0), 365);
        assert.equal(Unixtime.fromUtc(2024, 12, 31).getDayOfYear(0), 366);
        assert.equal(Unixtime.fromUtc(2024, 3, 1).getDayOfYear(0), 61);
        assert.equal(Unixtime.fromUtc(2026, 3, 1).getDayOfYear(0), 60);
    });

    it('follows the timezone offset', async () => {
        // 2026-04-01T00:30+09:00 is still 2026-03-31 in UTC
        const u = Unixtime.from(2026, 4, 1, 0, 30, 0, 0, -540);
        assert.equal(u.getDayOfYear(-540), 91);
        assert.equal(u.getDayOfYear(0), 90);
        assert.equal(u.getWeekOfMonth(-540), 1);
        assert.equal(u.getWeekOfMonth(0), 5);
        assert.equal(u.getLastWeekOfMonth(-540), 5);
        assert.equal(u.getLastWeekOfMonth(0), 5);
    });
});
