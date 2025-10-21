<template>
  <div ref="editorContainer" class="monaco-editor-container h-full w-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import monaco from '../monaco-config';
// 定义组件属性
const props = defineProps<{
  default?:string
  modelValue?: string
  language?: string
  theme?: string
  readonly?: boolean
}>()

// 定义事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 响应式引用
const editorContainer = ref<HTMLDivElement | null>(null)
let editor: any = null
let updateTimeout: number | null = null

// 默认值
const language = props.language || 'javascript'
const theme = props.theme || 'vs-dark'

// 初始化编辑器
const initEditor = async () => {
  if (!editorContainer.value) return

  // 动态导入 Monaco
  const monaco = await import('monaco-editor')
  const initValue = props.modelValue||props.default || ''
  // 创建编辑器实例
  editor = monaco.editor.create(editorContainer.value, {
    value: initValue,
    language: language,
    theme: theme,
    readOnly: props.readonly || false,
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbersMinChars: 3,
    folding: true,
    smoothScrolling: true,
    
  })
  emit('update:modelValue',initValue)
  // 监听内容变化，使用防抖
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()
    
    // 清除之前的定时器
    if (updateTimeout) {
      clearTimeout(updateTimeout)
    }
    
    // 设置新的定时器，延迟更新
    updateTimeout = window.setTimeout(() => {
      emit('update:modelValue', value)
    }, 300) // 300ms 防抖延迟
  })
}

// 监听值变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && newValue !== editor.getValue()) {
      editor.setValue(newValue || '')
    }
  }
)

// 监听语言变化
watch(
  () => props.language,
  (newLanguage) => {
    if (editor && newLanguage) {
      monaco.editor.setModelLanguage(editor.getModel(), newLanguage)
    }
  }
)

onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
  
  // 清理定时器
  if (updateTimeout) {
    clearTimeout(updateTimeout)
  }
})

// 公开方法
defineExpose({
  editor
})

</script>