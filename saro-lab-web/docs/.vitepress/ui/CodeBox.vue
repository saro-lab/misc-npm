<template>
  <div :class="`language-${props.lang}`">
    <button :title="t('copy_code')" class="copy" @click="doCopyToClipboard($event?.target, copy)"></button>
    <span class="lang">{{ props.lang }}</span>
    <!-- Highlighting only happens in the browser, so the plain source is rendered until then —
         otherwise the server sends an empty box and the code is invisible without JS.
         하이라이팅은 브라우저에서만 일어나므로 그전까지는 원본을 그대로 보여준다.
         아니면 서버가 빈 상자를 보내 JS 없이는 코드가 아예 보이지 않는다. -->
    <div v-if="hl" v-html="hl"></div>
    <pre v-else class="shiki"><code>{{ props.code }}</code></pre>
  </div>
</template>


<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from "vue";
import {doCopyToClipboard, getHighlighter} from "../src/comm";
import {useTranslate} from "../src/langs";

const {t} = useTranslate();

const props = defineProps<{
  lang: string
  code: string
}>();

let copy = ref(props.code);
let hl = ref('');
let highlighter: any|null = null;

function make(lang: string, code: string) {
  if (!highlighter) {
    return;
  }
  copy.value = code;
  hl.value = highlighter.codeToHtml(code, {
    lang: lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark'
    },
    defaultColor: false
  } as any);
}

watch(
    [() => props.lang, () => props.code],
    async ([newLang, newCode], [oldLang, oldCode]) => {
      make(newLang, newCode);
    },
    { immediate: false }
);

onMounted(async () => {
  highlighter = await getHighlighter();
  await nextTick(() => make(props.lang, props.code));
});
</script>
