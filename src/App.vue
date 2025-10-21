<template>
  <div id="app" v-if="initialized" class="live-shader-container min-h-[400px] min-w-[768px] flex h-full w-full relative overflow-hidden">
    <div class="live-shader-editor-wrapper flex flex-1 border-r border-gray-600 flex-col">
      <div class="panel-header flex items-center h-8 bg-gray-900 border-b border-gray-600 text-gray-400 px-3 gap-4">
        <span>代码</span>
        <select id="codeType" class="code-type-selector bg-gray-700 text-gray-200 rounded text-xs px-1 py-0.5 border-0"
          :data-id="uuid" :value="codeType" @change="handleCodeTypeChange">
          <option v-for="coderConfig in coderConfigList" :value="coderConfig.type">{{ coderConfig.name }}</option>
        </select>

        <!-- Shader 模式标签页 -->
        <template v-for="coderConfig in coderConfigList">
          <div v-if="coderConfig.type==codeType"
            class="tabs shader-tabs flex items-center h-full text-sm border-l border-gray-600 overflow-x-auto">
            <div v-for="fragment in coderConfig.fragments"
              class="tab h-full px-3 cursor-pointer border-r border-gray-600 bg-gray-800 flex items-center"
              :class="{ 'active bg-gray-700 text-gray-300': activeTab === fragment.name }"
              @click="activeTab  = fragment.name;language=fragment.language" :data-tab="fragment.name">
              {{ fragment.name }}
            </div>
          </div>
        </template>
        
        <button @click="saveAndCompile" class="ml-auto text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
          保存并编译
        </button>
      </div>
      <!-- Shader 模式编辑器 -->
      <CodeEditor :language="language" :name="activeTab" :key="codeType" :coder-config='coderConfigList.find(item=>item.type==codeType)'
        v-model:code="codeData[codeType]"></CodeEditor>
    </div>

    <div class="live-shader-preview-wrapper flex flex-1 flex-col h-full">
      <div class="panel-header flex items-center h-8 bg-gray-900 border-b border-gray-600 text-gray-400 px-3 justify-between">
        <span>预览</span>
        <button @click="toggleErrorPanel" class="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
          {{ isExpanded ? '隐藏错误' : '显示错误' }}
        </button>
      </div>
      <div class="panel-content flex flex-1 justify-center items-center bg-gray-800 relative">
        <Renderer 
          :codeType="codeType" 
          :uuid="uuid" 
          v-if="codeData" 
          :codeData="codeData[codeType]"
          @error="handleRendererError"
        >
        </Renderer>
      </div>
      <div 
        class="error-panel-container border-t border-gray-600"
        :class="{ 'collapsed': !isExpanded }"
        ref="errorPanelRef"
      >
        <div class="error-panel-header flex justify-between items-center bg-gray-900 px-3 py-1 cursor-row-resize" 
             @mousedown="startResize">
          <span class="text-xs text-gray-400">错误信息</span>
          <span class="text-xs text-gray-500">{{ errorCount }} 个错误</span>
        </div>
        <div 
          ref="errorDisplayRef"
          class="live-shader-error bg-red-100 text-red-700 overflow-y-auto text-sm"
          :class="{ 'hidden': !isExpanded }"
          :style="{ height: errorPanelHeight + 'px' }"
        >{{ errorContent }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CodeData, CodeFragment, CoderConfig, coderConfigList, CodeType } from './config'
import { ref, onMounted, onUnmounted } from 'vue'
import CodeEditor from './components/CodeEditor.vue'
import Renderer from './components/renderer/index.vue'

// 响应式数据
const uuid = ref('standalone')
const initialized = ref(false)
const codeData = ref<CodeData<CodeType> | {}>({})
const codeType = ref<CoderConfig["type"]>(coderConfigList[0].type)
const language = ref<CodeFragment['language']>(coderConfigList[0].fragments[0].language)
const activeTab = ref<CodeFragment['name']>(coderConfigList[0].fragments[0].name)

// 错误面板相关
const isExpanded = ref(false)
const errorPanelHeight = ref(150)
const errorCount = ref(0)
const errorPanelRef = ref<HTMLElement | null>(null)
const errorDisplayRef = ref<HTMLDivElement | null>(null)
const errorContent = ref<string>('')
let isResizing = ref(false)
let errorTimeout: number | null = null

const handleCodeTypeChange = (event: Event) => {
  codeType.value = (event.target as HTMLSelectElement).value
  activeTab.value = coderConfigList.find(config => config.type === (event.target as HTMLSelectElement).value)?.fragments[0].name || ''
  language.value = coderConfigList.find(config => config.type === (event.target as HTMLSelectElement).value)?.fragments[0].language || ''
}

// 切换错误面板显示/隐藏
const toggleErrorPanel = () => {
  isExpanded.value = !isExpanded.value
}

// 错误面板调整大小功能
const startResize = (e: MouseEvent) => {
  isResizing.value = true
  e.preventDefault()
  
  const startY = e.clientY
  const startHeight = errorPanelHeight.value
  
  const doDrag = (e: MouseEvent) => {
    if (!isResizing.value) return
    
    const diff = e.clientY - startY
    errorPanelHeight.value = Math.max(50, Math.min(400, startHeight - diff))
  }
  
  const stopDrag = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', doDrag)
    document.removeEventListener('mouseup', stopDrag)
  }
  
  document.addEventListener('mousemove', doDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 处理渲染器错误
const handleRendererError = (error: string) => {
  errorCount.value = 1
  errorContent.value = `[${new Date().toLocaleTimeString()}] ${error}\n\n`
  isExpanded.value = true
}

// 保存并编译代码
const saveAndCompile = () => {
  // 清除之前的错误信息
  errorContent.value = ''
  errorCount.value = 0
  
  // 如果之前有延时任务，先清除
  if (errorTimeout) {
    clearTimeout(errorTimeout)
  }
  
  // 2秒后检查错误
  errorTimeout = window.setTimeout(() => {
    // 这里可以添加额外的错误检查逻辑
    console.log("检查代码错误...")
  }, 2000)
}

// 全局错误处理
const handleError = (event: ErrorEvent) => {
  errorCount.value++
  if (event.message) {
    const errorMessage = `[${new Date().toLocaleTimeString()}] ${event.message}\n${event.filename}:${event.lineno}:${event.colno}\n\n`
    errorContent.value += errorMessage
    isExpanded.value = true
  }
}

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  errorCount.value++
  const errorMessage = `[${new Date().toLocaleTimeString()}] Unhandled Promise Rejection: ${event.reason}\n\n`
  errorContent.value += errorMessage
  isExpanded.value = true
}

// 初始化函数
const init = () => {
  initialized.value = true
  console.log('Live Coder Vue App initialized')
}

onMounted(() => {
  init()
  window.addEventListener('error', handleError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
})

onUnmounted(() => {
  window.removeEventListener('error', handleError)
  window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  
  if (errorTimeout) {
    clearTimeout(errorTimeout)
  }
})
</script>

<style scoped>
.error-panel-container {
  display: flex;
  flex-direction: column;
  min-height: 30px;
}

.error-panel-container.collapsed .live-shader-error {
  display: none !important;
}

.live-shader-error {
  min-height: 50px;
  max-height: 400px;
  white-space: pre-wrap;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  padding: 8px;
}
</style>