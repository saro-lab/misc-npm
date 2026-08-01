import {Unixtime} from "./unixtime.js";

export * from "./unixtime.js";

export type DateTimeDetail = {
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
}

export type TimeDetail = {
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
    readonly milliseconds: number;
    readonly timezoneOffset: number;
}

export type TimeInput = Unixtime | number | bigint | string | Date;

export type RelativeUnit = 'day' | 'hour' | 'minute' | 'second';

export type Duration = {
    readonly days?: number;
    readonly hours?: number;
    readonly minutes?: number;
    readonly seconds?: number;
    readonly millis?: number;
}

export type RelativeDetail = {
    readonly value: number;
    readonly unit: RelativeUnit;
    readonly millis: bigint;
}

export type RelativeTimeOptions = {
    readonly base?: TimeInput;
    readonly limit?: Duration | false;
    readonly units?: readonly RelativeUnit[];
    readonly future?: 'keep' | 'now';
    readonly locale?: string | string[];
    readonly numeric?: 'always' | 'auto';
    readonly style?: 'long' | 'short' | 'narrow';
}
