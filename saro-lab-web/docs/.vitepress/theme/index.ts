// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import { inBrowser, type Router } from 'vitepress'
import { nextTick, watch } from 'vue'

import Layout from './Layout.vue'
import './style.css'

const GA_ID = 'G-ZMKKCWRG7M'

// Routing is client-side, so the automatic page_view would only ever fire once.
// 라우팅이 클라이언트 사이드라, 자동 page_view 는 첫 진입 한 번만 찍힌다.
function setupAnalytics(router: Router): void {
  const win = window as any
  win.dataLayer = win.dataLayer || []
  win.gtag = function () {
    win.dataLayer.push(arguments)
  }
  win.gtag('js', new Date())
  win.gtag('config', GA_ID, { send_page_view: false })

  const send = () =>
    win.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname,
    })

  send()
  watch(
    () => router.route.path,
    () => void nextTick(send),
  )
}

export default {
  Layout,
  enhanceApp({ router }) {
    if (inBrowser) {
      setupAnalytics(router)
    }
  },
} satisfies Theme
