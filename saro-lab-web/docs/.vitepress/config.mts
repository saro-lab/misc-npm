import { defineConfig, type HeadConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

import { DEFAULT_LOCALE, localeCodes, vitepressLocales } from './locales'

const SITE_HOST = 'https://lab.saro.me'
const SITE_NAME = 'SARO Lab'
const SITE_DESC =
  'Open source from SARO Lab — distributed systems, developer tools, and libraries. MIT licensed.'

// 아이콘은 전부 컴포넌트 안의 인라인 SVG다 — 아이콘 폰트는 더 이상 받지 않는다.
const FONT_TEXT = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400..700&display=swap'

/** `ko/tool/time.md` → `{ locale: 'ko', path: '/tool/time' }`. 로케일이 아니면 둘 다 빈 문자열. */
function splitLocale(relativePath: string): { locale: string; path: string } {
  const [first, ...rest] = relativePath.replace(/\.md$/, '').split('/')
  if (!localeCodes.includes(first as never)) {
    return { locale: '', path: '' }
  }
  return { locale: first, path: rest.length ? `/${rest.join('/')}` : '' }
}

export default defineConfig({
  title: SITE_NAME,
  titleTemplate: `:title | ${SITE_NAME}`,
  description: SITE_DESC,
  head: [
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-ZMKKCWRG7M' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: FONT_TEXT }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:image', content: `${SITE_HOST}/og.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${SITE_HOST}/og.png` }],
    ['meta', { name: 'theme-color', content: '#12101f' }],
  ],
  sitemap: { hostname: SITE_HOST },
  /**
   * 페이지마다 canonical / hreflang / OG / JSON-LD 를 심는다. hreflang 은 전
   * 로케일 + `x-default` 를 모두 내보내야 검색엔진이 같은 문서의 언어 판본들을
   * 하나로 묶는다.
   */
  transformPageData(pageData) {
    if (pageData.relativePath === '404.md') {
      pageData.title = SITE_NAME
      pageData.titleTemplate = false
    }
    if (!pageData.title) {
      pageData.titleTemplate = false
    }

    const { locale, path } = splitLocale(pageData.relativePath)
    const url = locale ? `${SITE_HOST}/${locale}${path}` : SITE_HOST
    const title = pageData.title ? `${pageData.title} | ${SITE_NAME}` : SITE_NAME
    const description = pageData.description || SITE_DESC

    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
    ]

    if (locale) {
      for (const code of localeCodes) {
        head.push(['link', { rel: 'alternate', hreflang: code, href: `${SITE_HOST}/${code}${path}` }])
      }
      head.push([
        'link',
        { rel: 'alternate', hreflang: 'x-default', href: `${SITE_HOST}/${DEFAULT_LOCALE}${path}` },
      ])
    }

    if (pageData.title) {
      head.push(
        ['meta', { property: 'og:title', content: title }],
        ['meta', { name: 'twitter:title', content: title }],
      )
    }
    if (pageData.description) {
      head.push(
        ['meta', { property: 'og:description', content: description }],
        ['meta', { name: 'twitter:description', content: description }],
      )
    }

    head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': locale ? 'TechArticle' : 'WebSite',
        name: title,
        url,
        description,
        inLanguage: locale || DEFAULT_LOCALE,
        publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_HOST },
      }),
    ])

    pageData.frontmatter.head = [...(pageData.frontmatter.head ?? []), ...head]
  },
  locales: vitepressLocales,
  appearance: true,
  cleanUrls: true,
  vite: {
    plugins: [tailwindcss() as never],
    // infinite-unixtime 은 BigInt 리터럴을 쓴다 — es2019 이하로 내리면 빌드가 깨진다.
    build: { target: 'esnext' },
    /* 패키지의 `exports.require` 가 가리키는 dist/index.cjs 가 배포 tarball 에 없다.
       SSR 이 CJS 경로를 타지 않도록 번들에 포함시킨다. */
    ssr: { noExternal: ['infinite-unixtime'] },
  },
})
