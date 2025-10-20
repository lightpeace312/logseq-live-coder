<template>
  <div id="app" v-if="initialized" class="live-shader-container min-h-[400px] min-w-[768px] flex h-full w-full relative overflow-hidden">
      <div class="live-shader-editor-wrapper flex flex-1 border-r border-gray-600 flex-col">
        <div class="panel-header flex items-center h-8 bg-gray-900 border-b border-gray-600 text-gray-400 px-3 gap-4">
          <span>代码</span>
          <select id="codeType" class="code-type-selector bg-gray-700 text-gray-200 rounded text-xs px-1 py-0.5 border-0"
            :data-id="uuid" :value="codeType" @change="handleCodeTypeChange"> ">
            <option v-for="coderConfig in coderConfigList" :value="coderConfig.type">{{ coderConfig.name }}</option>
          </select>

          <!-- Shader 模式标签页 -->
          <template v-for="coderConfig in coderConfigList" >
            <div v-if="coderConfig.type==codeType" class="tabs shader-tabs flex items-center h-full text-sm border-l border-gray-600 overflow-x-auto">
              <div v-for="fragment in coderConfig.fragments"
                class="tab h-full px-3 cursor-pointer border-r border-gray-600 bg-gray-800 flex items-center"
                :class="{ 'active bg-gray-700 text-gray-300': activeTab === fragment.name }"
                @click="activeTab  = fragment.name;language=fragment.language" :data-tab="fragment.name">
                {{ fragment.name }}
              </div>
            </div>
          </template>
        </div>
        <!-- Shader 模式编辑器 -->
        <CodeEditor :language="language" :name="activeTab" :key="codeType" :coder-config='coderConfigList.find(item=>item.type==codeType)'
          v-model:code="codeData[codeType]"></CodeEditor>
      </div>
      
      <div class="live-shader-preview-wrapper flex flex-1 flex-col h-full">
        <div class="panel-header flex items-center h-8 bg-gray-900 border-b border-gray-600 text-gray-400 px-3">
          预览
        </div>
        <div class="panel-content flex flex-1 justify-center items-center bg-gray-800">
          <Renderer :codeType="codeType" :uuid="uuid" v-if="codeData" :codeData="codeData[codeType]">
          </Renderer </div>
          <div ref="errorDisplay"
            class="live-shader-error flex-1 p-2.5 bg-red-100 text-red-700 overflow-y-auto hidden" :data-id="uuid">
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { CodeData, CodeFragment, CoderConfig, coderConfigList, CodeType } from './config'
import { ref, onMounted } from 'vue'
import CodeEditor from './components/CodeEditor.vue'
import Renderer from './components/renderer/index.vue'
// 响应式数据
const uuid = ref('standalone')
const initialized = ref(false)
const codeData = ref<CodeData<CodeType> | {}>({})
const codeType = ref<CoderConfig["type"]>(coderConfigList[0].type)
const language = ref<CodeFragment['language']>(coderConfigList[0].fragments[0].language)
const activeTab = ref<CodeFragment['name']>(coderConfigList[0].fragments[0].name)
const handleCodeTypeChange = (event:Event) => {
  codeType.value = event.target.value
  activeTab.value = coderConfigList.find(config => config.type ===  event.target.value)?.fragments[0].name
  language.value = coderConfigList.find(config => config.type ===  event.target.value)?.fragments[0].language || ''
}
const errorDisplay = ref<HTMLDivElement | null>(null)

// 初始化函数
const init = () => {
  initialized.value = true
  console.log('Live Coder Vue App initialized')
}


onMounted(() => {
  init()
})
</script>