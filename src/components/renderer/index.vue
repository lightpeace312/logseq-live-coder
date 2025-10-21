<template>
    <div v-if="!codeData"></div>
    <ShaderRenderer 
      v-else-if="shaderCode" 
      :fragment-shader="shaderCode.fragment" 
      :vertex-shader="shaderCode.vertex" 
      @error="handleShaderError"
    />
    <iframe v-else-if="htmlCode" ref="previewFrame" class="live-html-preview w-full h-full border-0" :data-id="uuid"></iframe>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ShaderRenderer from './ShaderRenderer.vue';
import { CodeData, CodeType } from '@/config';

const props = defineProps({
    codeData: {
        type: Object as () => CodeData<CodeType> | undefined,
        required: false
    },
    codeType: {
        type: String as () => CodeType,
        required: true
    },
    uuid: {
        type: String
    }
});

const emit = defineEmits<{
  (e: 'error', error: string): void
}>();

// Computed for shader type narrowing
const shaderCode = computed(() => {
    if (props.codeType === 'shader' && props.codeData) {
        return props.codeData as CodeData<'shader'>;
    }
    return null;
});

// Computed for html type narrowing
const htmlCode = computed(() => {
    if (props.codeType === 'html' && props.codeData) {
        return props.codeData as CodeData<'html'>;
    }
    return null;
});

// 处理着色器错误
const handleShaderError = (error: string) => {
  emit('error', error);
};

// If you need to inject HTML/CSS/JS into the iframe, you can do it here (e.g., in onMounted)
</script>