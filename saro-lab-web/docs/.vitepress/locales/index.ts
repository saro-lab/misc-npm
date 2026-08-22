import { ar } from './ar'
import { bn } from './bn'
import { de } from './de'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { hi } from './hi'
import { id } from './id'
import { ja } from './ja'
import { ko } from './ko'
import { pt } from './pt'
import { ru } from './ru'
import { ur } from './ur'
import { zh } from './zh'

// Adding a language means this file and one new `<code>.ts` — `langPaths.ts` does the routes.
// 언어 추가는 이 파일과 새 `<code>.ts` 뿐이다. 라우트는 `langPaths.ts` 가 만든다.
export const messages = { en, ko, ja, zh, de, fr, es, ar, id, pt, hi, ru, bn, ur }

export type LocaleCode = keyof typeof messages
export type Messages = typeof en
export type MessageKey = keyof Messages

export const localeCodes = Object.keys(messages) as LocaleCode[]

export const localeNames = Object.fromEntries(
  localeCodes.map((code) => [code, messages[code].label]),
) as Record<LocaleCode, string>

export const DEFAULT_LOCALE: LocaleCode = 'en'

// Right-to-left scripts. VitePress copies the locale's `dir` onto `<html dir>` — on the
// server for the first paint, and again from the client router on every route change — so
// declaring it here is all the wiring the layout needs.
// 오른쪽에서 왼쪽으로 읽는 문자. VitePress 가 로케일의 `dir` 을 `<html dir>` 로 옮긴다
// (SSR 첫 페인트 + 라우트 변경 시 클라이언트 라우터). 그래서 여기 선언만으로 배선이 끝난다.
export const RTL_LOCALES: readonly string[] = ['ar', 'ur']

export type TextDir = 'ltr' | 'rtl'

export function localeDir(code: string): TextDir {
  return RTL_LOCALES.includes(code) ? 'rtl' : 'ltr'
}

function withDir(code: LocaleCode) {
  return { ...messages[code], dir: localeDir(code) }
}

export const vitepressLocales = {
  root: withDir(DEFAULT_LOCALE),
  ...(Object.fromEntries(localeCodes.map((code) => [code, withDir(code)])) as {
    [K in LocaleCode]: ReturnType<typeof withDir>
  }),
}
