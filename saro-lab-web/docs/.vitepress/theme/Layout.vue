<template>
  <div class="mb-16 @container/layout">
    <!-- 로케일 경로로 넘어가는 중에는 아무것도 그리지 않는다. 곧 사라질 화면이고,
         무엇보다 404가 아닌데 404 화면이 스쳐 보이면 안 된다. -->
    <template v-if="redirecting"></template>

    <template v-else-if="localeIndex !== 'root'">
      <header class="g-glass drop-none @min-md:border-b! absolute w-full z-50 text-[0.9rem]">
        <div class="g-frame g-frame-full">
          <div class="header-content select-none flex items-center h-[3rem] gap-1 px-1.5 @max-[46rem]:px-2">
            <!-- 헤더 아이콘은 전부 인라인 SVG다 — 아이콘 폰트를 기다리는 동안 글리프
                 자리가 비거나 네모로 뜨는 구간이 없고, currentColor 로 테마를 그대로 탄다 -->
            <div v-if="hasMenu" class="hdr-btn g-link-hover @min-[60rem]:hidden!" @click="onMenu = !onMenu">
              <svg class="hdr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </div>
            <a :href="`${root}/`" class="flex items-center gap-1.5 font-medium text-[1rem] px-1">
              <!-- 1.15em — 마크가 갈래까지 있어서 글자 높이에 맞추면 안쪽이 뭉갠다 -->
              <Logo class="w-[1.15em] h-[1.15em]" />SARO Lab
            </a>
            <div class="flex-1"></div>

            <!-- Points at the first document until there is a second one to choose between.
                 고를 두 번째 문서가 생기기 전까지는 첫 문서로 바로 보낸다. -->
            <a :href="`${root}${docsPath}`" class="hdr-btn hdr-nav g-link-hover">
              <svg class="hdr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span class="hdr-label">{{ t('menu_docs') }}</span>
            </a>

            <a
              href="https://github.com/saro-lab"
              target="_blank"
              rel="noreferrer"
              class="hdr-btn hdr-github g-link-hover"
              :title="t('open_github')"
              :aria-label="t('open_github')"
            >
              <svg class="hdr-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>

            <div class="hdr-btn g-link-hover" @click="isDark = !isDark">
              <svg v-if="isDark" class="hdr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <svg v-else class="hdr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 1.5v2.2M12 20.3v2.2M4.22 4.22l1.56 1.56M18.22 18.22l1.56 1.56M1.5 12h2.2M20.3 12h2.2M4.22 19.78l1.56-1.56M18.22 5.78l1.56-1.56" />
              </svg>
            </div>

            <SelectLanguage />
          </div>
        </div>
      </header>

      <div class="h-[3rem]"><!-- header gap --></div>

      <!-- items-start: 사이드바와 본문은 각자 자기 내용만큼만 높아진다 (짧은 쪽이 늘어나지 않게) -->
      <div class="mt-4 g-frame g-frame-full" :class="hasMenu ? 'flex items-start justify-center gap-[1rem]' : ''">
        <Menu v-if="hasMenu" v-model="onMenu" />
        <main v-if="hasPage" :class="hasMenu ? 'g-glass rd-box g-frame flex-1 md' : ''">
          <Content />
          <PageNav v-if="hasMenu" />
        </main>
        <div v-else class="flex-1 g-glass rd-box">
          <div class="pt-[9rem] pb-[10rem]">
            <div class="text-3xl text-center">404<br /><br />{{ t('page_not_found') }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- Shown at the un-prefixed root, which redirects to a language as soon as JS runs. -->
    <div v-else class="g-frame pt-[9rem] pb-[10rem] text-center">
      <Logo class="w-14 h-14 mx-auto mb-5" />
      <div class="text-3xl">SARO Lab</div>
      <div class="mt-8 flex flex-wrap justify-center gap-6">
        <a v-for="[code, name] in languages" :key="code" :href="`/${code}/`" class="g-link">{{ name }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Content, inBrowser, useData, useRouter } from 'vitepress'
import { computed, onMounted, ref } from 'vue'

import Logo from '../ui/Logo.vue'
import Menu from '../ui/Menu.vue'
import PageNav from '../ui/PageNav.vue'
import SelectLanguage from '../ui/SelectLanguage.vue'
import { applyLanguage, languageList, useRoot, useTranslate } from '../src/langs'
import { pageOrder } from '../src/nav'

const { t } = useTranslate()

// https://vitepress.dev/reference/runtime-api#usedata
const { page, frontmatter, isDark, localeIndex } = useData()

const root = useRoot()

/** Shown at the un-prefixed root, which redirects to a language as soon as JS runs. */
const languages = Object.entries(languageList)

const docsPath = pageOrder[0]?.path ?? '/'

const hasPage = computed(() => !page.value.isNotFound)
const hasMenu = computed(() => hasPage.value && frontmatter.value?.layout !== 'home')

const onMenu = ref(false)

/* Run during setup rather than from `onMounted`: the redirect has to be under
   way before the first paint, otherwise the fallback markup below flashes on
   its way out. The visitor's language still comes from cookie → browser
   preference → default, exactly as before. */
const redirecting = ref(inBrowser && applyLanguage())

useRouter().onBeforeRouteChange = () => {
  onMenu.value = false
}

onMounted(() => {
  if (page.value.isNotFound) {
    document.title = 'SARO Lab'
  }
})
</script>

<style scoped>
.header-content,
.header-content * {
  line-height: 1;
}
</style>
