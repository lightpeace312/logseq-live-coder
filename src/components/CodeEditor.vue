<template>
</template>

<script setup lang="ts">
// 由于我们重构了项目结构，这个组件不再需要
// 现在直接使用MonacoEditor组件
import { PropType, ref, watch } from 'vue'
import MonacoEditor from './MonacoEditor.vue'
import { CodeData, CoderConfig, CodeType } from '@/config';

const props = defineProps<{
  language: string,
  name: string,
  coderConfig?: CoderConfig
  readonly?: boolean
}>()

const code = defineModel('code', { type: Object as PropType<CodeData<CodeType>> | undefined, required: false })
const inited = ref(false)
let updateTimeout: number | null = null

// 初始化和配置变化处理
watch(() => props.coderConfig, (config, oldConfig) => {
  inited.value = false
  if (config && config !== oldConfig) {
    if (!code.value) {
      code.value = Object.fromEntries(
        config.fragments.map(fragment => [fragment.name, fragment.example || ''])
      ) as CodeData<CodeType>
    }
    inited.value = true
  }
}, { immediate: true, deep: true })

// 监听外部值变化（父组件更新）
watch(() => code.value, (newValue) => {
  // 不需要特殊处理，MonacoEditor会自动响应变化
}, { deep: true })
</script>