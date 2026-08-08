<template>
  <a class="pc" :href="href" :target="isSite ? '_blank' : undefined" :rel="isSite ? 'noreferrer' : undefined">
    <img class="pc-logo" :src="project.logo" :alt="project.name" width="48" height="48" loading="lazy" />

    <div class="pc-body">
      <div class="pc-head">
        <span class="pc-name">{{ project.name }}</span>
        <span class="pc-tag">{{ t(project.tagKey) }}</span>
      </div>

      <p class="pc-desc">{{ t(project.descKey) }}</p>

      <div v-if="project.langs?.length" class="pc-langs">
        <span v-for="lang in project.langs" :key="lang" class="pc-lang">{{ lang }}</span>
      </div>
    </div>

    <!-- 카드 전체가 링크라 이 줄은 목적지를 알려주는 표시일 뿐, 중첩 링크가 아니다 -->
    <div class="pc-go">
      <span class="pc-go-label">{{ isSite ? t('open_site') : t('menu_tool') }}</span>
      <span translate="no" class="material-symbols-outlined pc-go-icon">
        {{ isSite ? 'open_in_new' : 'arrow_forward' }}
      </span>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoot, useTranslate } from '../src/langs'
import { useLocale } from '../src/nav'
import { projectUrl, type Project } from '../src/projects'

const props = defineProps<{ project: Project }>()

const { t } = useTranslate()
const root = useRoot()
const locale = useLocale()

const isSite = computed(() => props.project.kind === 'site')
/* 큰 프로젝트는 자기 사이트의 현재 로케일 페이지로 나간다 — 한국어로 읽던 사람이
   영어 랜딩에 떨어지지 않도록. */
const href = computed(() => projectUrl(props.project, root.value, locale.value))
</script>

<style scoped>
@reference 'tailwindcss';

.pc {
    @apply flex items-start gap-4 p-4 rounded-xl no-underline! transition-colors duration-150;
    color: inherit;
    background-color: color-mix(in srgb, currentColor 4%, transparent);
    border: 1px solid color-mix(in srgb, currentColor 8%, transparent);

    &:hover {
        background-color: color-mix(in srgb, currentColor 8%, transparent);
        border-color: color-mix(in srgb, var(--c-link-1) 35%, transparent);
    }
    /* 카드 전체가 클릭 대상이므로 포커스 링도 카드에 준다 */
    &:focus-visible {
        outline: 2px solid var(--ctrl-ring);
        outline-offset: 2px;
    }
}

.pc-logo {
    @apply w-12 h-12 shrink-0 mt-0.5;
}

.pc-body {
    @apply flex-1 min-w-0;
}

.pc-head {
    @apply flex flex-wrap items-baseline gap-x-2 gap-y-0.5;
}
.pc-name {
    @apply text-[1.05rem] font-semibold;
    color: var(--c-heading);
}
.pc-tag {
    @apply text-[0.78rem];
    color: var(--c-muted);
}

.pc-desc {
    @apply m-0! mt-1.5! text-[0.86rem] leading-relaxed;
    color: var(--c-text-2);
}

.pc-langs {
    @apply flex flex-wrap gap-1 mt-2.5;
}
.pc-lang {
    @apply px-1.5 py-0.5 rounded font-mono text-[0.68rem];
    color: color-mix(in srgb, var(--ctrl-fg) 70%, transparent);
    background-color: var(--ctrl-bg);
    border: 1px solid var(--ctrl-border);
}

.pc-go {
    @apply flex items-center gap-1 shrink-0 self-center text-[0.78rem] font-medium;
    color: var(--c-link-1);
}
/* 좁은 화면에서는 화살표만 남긴다 — 카드가 세 줄로 접히는 것보다 낫다 */
@container (max-width: 34rem) {
    .pc-go-label {
        @apply hidden;
    }
}
.pc-go-icon {
    @apply text-base!;
}
</style>
