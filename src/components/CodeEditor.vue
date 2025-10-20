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
  name:string,
  coderConfig?: CoderConfig
  readonly?: boolean
}>()
const code = defineModel('code', { type: Object as PropType<CodeData<CodeType>>,required:false })
const inited  = ref(false)
watch(() => props.coderConfig, (config, oldConfig) => {
  inited.value=false
  if (config && config !== oldConfig) {
    code.value = Object.fromEntries(config.fragments.map((fragment) => [fragment.name, '']))
    inited.value=true
  }
}, { immediate: true, deep: true })
// 响应式数据
const localCode = ref(code.value)


// 监听外部值变化
watch(
  () => code.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      localCode.value = newValue
    }
  }
)

// 监听本地值变化
watch(localCode, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    code.value = newVal
  }
})
</script>