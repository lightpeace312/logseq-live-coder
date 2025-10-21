<template>
  <div class="h-[200px] flex-1 ">
    <template v-for="(fragment,index) in coderConfig?.fragments" :key="index">
      <div class="flex flex-col h-full" v-show="fragment.name == name">
        <div class="flex-1">
          <MonacoEditor v-if="inited&&code" 
          :default="fragment.example" v-model="code[fragment.name]"
           :language="fragment.language" :readonly="readonly" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
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