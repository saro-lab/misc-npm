<template>
  <div class="relative select-language">
    <div class="hdr-btn hdr-nav text-[0.9rem]! g-link-hover" open-lang-list-btn>
      <!-- pointer-events-none: SVG 자식이 클릭 타깃이 되면 [open-lang-list-btn] 매칭이 빗나간다 -->
      <svg class="hdr-icon pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 3.6 9A14 14 0 0 1 12 21a14 14 0 0 1-3.6-9A14 14 0 0 1 12 3z" />
      </svg>
      <span class="hdr-label" open-lang-list-btn>{{langName}}</span>
    </div>
    <!-- -end-1.5: RTL 에서는 목록이 헤더 왼쪽 끝에 맞춰 떨어져야 한다 -->
    <div v-if="showLangList" class="absolute top-10 -end-1.5 text-center">
      <div class="absolute isolate inset-0 -z-1! g-glass rd-box"></div>
      <div class="text-sm! my-3 px-6 g-link-hover" v-for="[code, name] in languages" :key="code" @click="applyLanguage(code)">{{name}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useData} from "vitepress";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {applyLanguage, languageList, languageRandom} from "../src/langs";

const { localeIndex } = useData();

/** Randomised once per visit so no single language is permanently listed first. */
const languages = languageRandom();
const langName = computed<any>(() => languageList[localeIndex.value] || '-');
const showLangList = ref(false);

function hideLangList(event: MouseEvent) {
  if (showLangList.value) {
    showLangList.value = false;
  } else if ((event.target as HTMLElement).matches('[open-lang-list-btn]')) {
    showLangList.value = true;
  }
}

onMounted(() => {
  document.addEventListener('click', hideLangList);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', hideLangList);
})
</script>
