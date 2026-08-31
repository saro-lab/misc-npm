<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="hdr-btn g-link-hover gap-1 px-2 text-[0.9rem] font-medium"
      aria-haspopup="dialog"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg class="hdr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 3.6 9A14 14 0 0 1 12 21a14 14 0 0 1-3.6-9A14 14 0 0 1 12 3z" />
      </svg>
      <span translate="no" class="@max-[32rem]:hidden!">{{ langName }}</span>
    </button>

    <div
      v-if="open"
      role="dialog"
      aria-label="language"
      class="lang-menu g-glass absolute top-full -end-1.5 z-50 mt-1 w-[10rem] rounded-xl py-1.5 text-center"
    >
      <input
        ref="searchInput"
        :value="query"
        type="text"
        class="lang-search mb-1.5 block w-full px-3 py-1.5 text-center text-[0.875rem]"
        placeholder="language"
        aria-label="language"
        @compositionstart="composing = true"
        @compositionend="onCompositionEnd"
        @input="onInput"
        @keydown="onSearchKeyDown"
      />
      <button
        v-for="([code, name], index) in filteredLanguages"
        :key="code"
        type="button"
        translate="no"
        class="lang-item flex w-full items-center justify-center px-3 py-1.5 text-[0.875rem] g-link-hover"
        :class="{ 'font-semibold lang-item-active': index === activeIndex }"
        @click="pick(code)"
      >
        {{ name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { applyLanguage, languageList, languageMatches, languageRandom } from '../src/langs'

const { lang } = useData()
const languages = languageRandom()
const langName = computed(() => (languageList as Record<string, string>)[lang.value] ?? lang.value)
const query = ref('')
const activeIndex = ref(-1)
const composing = ref(false)
const filteredLanguages = computed(() => languages.filter(([code, name]) => {
  return code !== lang.value && languageMatches(code, name, query.value)
}))

watch(query, () => {
  activeIndex.value = filteredLanguages.value.length ? 0 : -1
})

const root = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const open = ref(false)

function onPointerDown(event: Event): void {
  const target = event.target as Node | null
  if (target && root.value?.contains(target)) return
  open.value = false
}

function onKeyDown(event: Event): void {
  if ((event as KeyboardEvent).key === 'Escape') open.value = false
}

function onInput(event: Event): void {
  query.value = (event.target as HTMLInputElement).value
}

function onCompositionEnd(event: CompositionEvent): void {
  composing.value = false
  query.value = (event.target as HTMLInputElement).value
}

function onSearchKeyDown(event: KeyboardEvent): void {
  if (composing.value || event.isComposing) return

  const direction = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
  if (!direction && event.key !== 'Enter') return

  const items = filteredLanguages.value
  if (!items.length) return

  event.preventDefault()
  if (event.key === 'Enter') {
    if (activeIndex.value >= 0) pick(items[activeIndex.value][0])
    return
  }

  activeIndex.value = activeIndex.value < 0
    ? direction > 0 ? 0 : items.length - 1
    : (activeIndex.value + direction + items.length) % items.length
}

watch(open, (value) => {
  const method = value ? 'addEventListener' : 'removeEventListener'
  document[method]('pointerdown', onPointerDown)
  document[method]('keydown', onKeyDown)
  if (!value) {
    query.value = ''
    activeIndex.value = -1
    return
  }
  requestAnimationFrame(() => searchInput.value?.focus())
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeyDown)
})

function pick(code: string): void {
  open.value = false
  applyLanguage(code)
}
</script>

<style scoped>
.lang-search,
.lang-search:hover,
.lang-search:focus {
  color: inherit;
  background: transparent;
  border-color: transparent;
  outline: none;
  box-shadow: none;
}

.lang-menu .lang-item {
  line-height: 1.25rem;
  opacity: 0.9;
}

.lang-menu .lang-item:hover,
.lang-menu .lang-item:focus-visible,
.lang-menu .lang-item-active {
  color: var(--c-link-2);
  font-weight: 600;
  opacity: 1;
}

@media (pointer: coarse) {
  .lang-item {
    min-height: 2.75rem;
  }
}
</style>
