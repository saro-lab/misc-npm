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

export const vitepressLocales = {
  root: messages[DEFAULT_LOCALE],
  ...messages,
}
