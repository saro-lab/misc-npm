<template>
  <div class="ud">
    <h2 class="ud-h1">{{ t('doc_reference') }}</h2>

    <section v-for="section in unixtimeDocs" :key="section.id" :id="section.id" class="ud-section">
      <h3 class="ud-h2">{{ t(section.titleKey) }}</h3>
      <p v-if="section.noteKey" class="ud-note">{{ t(section.noteKey) }}</p>
      <CodeBox
        v-for="(block, i) in section.blocks"
        :key="i"
        :lang="block.lang"
        :code="block.code"
        class="ud-code"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import CodeBox from './CodeBox.vue'
import { useTranslate } from '../src/langs'
import { unixtimeDocs } from '../src/unixtimeDocs'

const { t } = useTranslate()
</script>

<style scoped>
@reference 'tailwindcss';

.ud {
    @apply mt-10 pt-8;
    border-top: var(--divider);
}

.ud-h1 {
    @apply m-0! p-0! border-0! text-xl font-bold;
    color: var(--c-heading);
}

.ud-section {
    @apply mt-7;

    /* Anchored sections must clear the fixed header when jumped to.
       고정 헤더가 있으므로 앵커로 점프했을 때 제목이 가리지 않도록 띄운다. */
    scroll-margin-top: 4rem;
}

.ud-h2 {
    @apply m-0! p-0! border-0! text-base font-semibold;
    color: var(--c-heading);
}

.ud-note {
    @apply m-0! mt-1.5! text-[0.84rem] leading-relaxed;
    color: var(--c-text-2);
}

.ud-code {
    @apply mt-2.5;
}
</style>
