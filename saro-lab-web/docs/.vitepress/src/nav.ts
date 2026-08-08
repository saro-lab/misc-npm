import { computed, type ComputedRef } from 'vue'
import { useData } from 'vitepress'
import type { MessageKey } from '../locales'
import { localProjects, siteProjects } from './projects'

export type NavLink = {
  path: string
  icon?: string
  titleKey?: MessageKey
  title?: string
  navKey?: MessageKey
  sub?: boolean
  // The menu is shared by every locale, so a page only some locales carry needs listing here.
  // 메뉴는 모든 로케일이 공유하므로, 일부 로케일에만 있는 페이지는 여기에 적어야 한다.
  locales?: string[]
}

export type NavExternal = {
  external: string
  icon?: string
  title?: string
  titleKey?: MessageKey
}

export type NavGroup = { labelKey: MessageKey }

export type NavEntry = NavLink | NavExternal | NavGroup

export function isGroup(entry: NavEntry): entry is NavGroup {
  return 'labelKey' in entry
}

export function isExternal(entry: NavEntry): entry is NavExternal {
  return 'external' in entry
}

export function isLink(entry: NavEntry): entry is NavLink {
  return !isGroup(entry) && !isExternal(entry)
}

export function inLocale(entry: NavEntry, locale: string): boolean {
  return !isLink(entry) || !entry.locales || entry.locales.includes(locale)
}

export type NavSection = {
  titleKey: MessageKey
  entries: NavEntry[]
}

// Built from the project registry — an address written twice eventually gets fixed only once.
// 프로젝트 레지스트리에서 만들어낸다. 주소가 두 군데 적히면 언젠가 한쪽만 고치게 된다.
export const navSections: NavSection[] = [
  {
    titleKey: 'menu_tool',
    entries: localProjects.map((project) => ({
      path: project.path!,
      title: project.name,
      icon: project.logo,
    })),
  },
  {
    titleKey: 'menu_projects',
    entries: siteProjects.map((project) => ({
      external: project.site!,
      title: project.name,
      icon: project.logo,
    })),
  },
]

export const pageOrder: NavLink[] = navSections.flatMap(
  (section) => section.entries.filter(isLink) as NavLink[],
)

export function useNavSections(): ComputedRef<NavSection[]> {
  const locale = useLocale()
  return computed(() =>
    navSections
      .map((section) => ({
        ...section,
        entries: section.entries.filter((entry) => inLocale(entry, locale.value)),
      }))
      .filter((section) => section.entries.some((entry) => !isGroup(entry))),
  )
}

export function usePageOrder(): ComputedRef<NavLink[]> {
  const locale = useLocale()
  return computed(() => pageOrder.filter((entry) => inLocale(entry, locale.value)))
}

export function useLocale(): ComputedRef<string> {
  const { localeIndex } = useData()
  return computed(() => (localeIndex.value === 'root' ? '' : localeIndex.value))
}

// Drops the first segment whether it is a real locale (`ko/…`) or the literal `[lang]/…`,
// so both kinds of page compare against `NavLink.path` the same way.
// 첫 세그먼트가 실제 로케일이든 동적 라우트의 `[lang]` 이든 똑같이 떼어내,
// 두 종류의 페이지가 `NavLink.path` 와 같은 방식으로 비교된다.
export function useCurrentPath(): ComputedRef<string> {
  const { page } = useData()
  return computed(() => {
    const [, ...rest] = page.value.relativePath.replace(/\.md$/, '').split('/')
    const path = `/${rest.join('/')}`
    return path.endsWith('/index') ? path.slice(0, -'index'.length) : path
  })
}
