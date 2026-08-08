<template>
  <div class="ph g-frame">
    <header class="ph-hero">
      <h1 class="ph-title">{{ t('home_tagline') }}</h1>
    </header>

    <section v-for="group in groups" :key="group.title" class="ph-section">
      <h2 class="ph-h2">{{ t(group.title) }}</h2>
      <div class="ph-cards">
        <ProjectCard v-for="project in group.items" :key="project.id" :project="project" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ProjectCard from './ProjectCard.vue'
import { useTranslate } from '../src/langs'
import { localProjects, siteProjects } from '../src/projects'
import type { MessageKey } from '../locales'

const { t } = useTranslate()

// The list itself lives in src/projects.ts; this only decides the order of the two groups.
// 목록 자체는 src/projects.ts 가 쥐고 있고, 여기서는 두 그룹의 순서만 정한다.
const groups: { title: MessageKey; items: typeof siteProjects }[] = [
  { title: 'home_projects', items: siteProjects },
  { title: 'home_tools', items: localProjects },
]
</script>

<style scoped>
@reference 'tailwindcss';

.ph {
    @apply pb-8 @container;
}

.ph-hero {
    @apply text-center pt-12 pb-10;
}
.ph-logo {
    @apply w-16 h-16 mx-auto mb-5;
}
.ph-title {
    @apply m-0! text-3xl font-bold border-0! p-0!;
    color: var(--c-heading);
}
.ph-org {
    @apply inline-block mt-4 font-mono text-[0.8rem];
}

.ph-section + .ph-section {
    @apply mt-10;
}
.ph-h2 {
    @apply m-0! p-0! border-0! text-lg font-semibold;
    color: var(--c-heading);
}
.ph-cards {
    @apply grid grid-cols-1 gap-3 mt-4;
}
</style>
