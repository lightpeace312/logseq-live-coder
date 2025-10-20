<template>
 
    <div v-if="!codeData"></div>
    <ShaderRenderer v-else-if="shaderCode" :fragment-shader="shaderCode.fragment" :vertex-shader="shaderCode.vertex" />
    <iframe v-else-if="htmlCode" ref="previewFrame" class="live-html-preview w-full h-full border-0" :data-id="uuid"></iframe>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ShaderRenderer from './ShaderRenderer.vue';
import { CodeData, CodeType } from '@/config';
import { createBaseVNode, PropType } from 'vue';
import { type CoderConfig, coderConfigList } from '@/config';

const props = defineProps({
    codeData: {
        type: Object as PropType<CodeData<CodeType>>,
        required: false
    },
    codeType: {
        type: String as PropType<CodeType>,
        required: true
    },
    uuid: {
        type: String
    }
});

// Computed for shader type narrowing
const shaderCode = computed(() => {
    if (props.codeType === 'shader') {
        return props.codeData as CodeData<'shader'>;
    }
    return null;
});

// Computed for html type narrowing
const htmlCode = computed(() => {
    if (props.codeType === 'html') {
        return props.codeData as CodeData<'html'>;
    }
    return null;
});

// If you need to inject HTML/CSS/JS into the iframe, you can do it here (e.g., in onMounted)
</script>