<template>
  <div id="app" v-if="initialized" class="live-shader-container min-h-[400px] min-w-[768px] flex h-full w-full relative overflow-hidden">
    <div class="live-shader-editor-wrapper flex flex-1 flex-col relative">
      <!-- 编辑器区域 -->
      <div class="flex-1 flex flex-col">
        <MonacoEditor 
          ref="monacoEditorRef"
          v-model="fragmentShaderCode" 
          language="glsl" 
          class="flex-1"
        />
      </div>
      
      <!-- Shader预览浮窗 -->
      <div 
        ref="previewRef"
        class="shader-preview absolute w-[320px] h-[320px] bg-gray-800 border border-gray-600 rounded shadow-lg z-10 cursor-move resize"
        :style="{ 
          top: previewPosition.y + 'px',
          left: previewPosition.x + 'px'
        }"
        @mousedown="startDrag"
      >
        <ShaderRenderer 
          ref="shaderRendererRef"
          :fragment-shader="compiledFragmentShader || fragmentShaderCode" 
          :vertex-shader="defaultVertexShader"
          @error="handleRendererError"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue'
import MonacoEditor from './components/MonacoEditor.vue'
import ShaderRenderer from './components/renderer/ShaderRenderer.vue'

// 默认的顶点着色器代码
const defaultVertexShader = `attribute vec2 a_position;
varying vec2 v_uv;

void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`

// 响应式数据
const initialized = ref(false)
const fragmentShaderCode = ref(`precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float r = sin(uv.x * 3.14159 * 2.0 + u_time) * 0.5 + 0.5;
    float g = sin(uv.y * 3.14159 * 4.0 + u_time) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 3.14159 + u_time) * 0.5 + 0.5;
    gl_FragColor = vec4(r, g, b, 1.0);
}`)
const compiledFragmentShader = ref('')
const errorContent = ref('')
const previewPosition = reactive({ x: 20, y: 20 })
let errorDecorationId: string[] = []

// 引用
const monacoEditorRef = ref<InstanceType<typeof MonacoEditor> | null>(null)
const previewRef = ref<HTMLDivElement | null>(null)
const shaderRendererRef = ref<InstanceType<typeof ShaderRenderer> | null>(null)

// 拖动相关变量
let isDragging = false
let dragOffset = { x: 0, y: 0 }

// 自动保存相关变量
let autoSaveTimer: number | null = null
let lastSavedCode: string = ''
let hasUnsavedChanges = false

// 开始拖动
const startDrag = (e: MouseEvent) => {
  if (!previewRef.value) return
  
  isDragging = true
  const rect = previewRef.value.getBoundingClientRect()
  dragOffset.x = e.clientX - rect.left
  dragOffset.y = e.clientY - rect.top
  
  e.preventDefault()
}

// 拖动中
const onDrag = (e: MouseEvent) => {
  if (!isDragging || !previewRef.value) return
  
  previewPosition.x = e.clientX - dragOffset.x
  previewPosition.y = e.clientY - dragOffset.y
  
  // 确保预览窗口不会移出视窗边界
  const previewRect = previewRef.value.getBoundingClientRect()
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  
  if (previewPosition.x < 0) previewPosition.x = 0
  if (previewPosition.y < 0) previewPosition.y = 0
  if (previewPosition.x + previewRect.width > windowWidth) {
    previewPosition.x = windowWidth - previewRect.width
  }
  if (previewPosition.y + previewRect.height > windowHeight) {
    previewPosition.y = windowHeight - previewRect.height
  }
}

// 结束拖动
const stopDrag = () => {
  isDragging = false
  // 保存位置到logseq
  savePreviewPosition()
}

// 保存预览窗口位置
const savePreviewPosition = () => {
  if (typeof logseq !== 'undefined') {
    const uuid = getBlockUUID()
    if (uuid) {
      logseq.Editor.upsertBlockProperty(uuid, 'liveCoderPreviewPosition', { 
        x: previewPosition.x, 
        y: previewPosition.y 
      }).catch(console.error)
    }
  } else if (window.parent !== window) {
    // 在iframe模式下，通过postMessage与父窗口通信
    window.parent.postMessage({
      type: 'SAVE_PREVIEW_POSITION',
      uuid: getBlockUUID(),
      position: { x: previewPosition.x, y: previewPosition.y }
    }, '*');
  }
}

// 保存并编译代码
const saveAndCompile = () => {
  // 只有在有未保存更改时才保存
  if (!hasUnsavedChanges) return
  
  // 清除之前的错误标记和内容
  clearEditorErrors()
  errorContent.value = ''
  
  // 更新编译后的着色器代码
  compiledFragmentShader.value = fragmentShaderCode.value
  
  // 强制重新编译着色器
  if (shaderRendererRef.value) {
    shaderRendererRef.value.markForUpdate()
  }
  
  // 保存代码到logseq
  saveCodeToLogseq()
  
  // 更新最后保存的代码
  lastSavedCode = fragmentShaderCode.value
  hasUnsavedChanges = false
  
}

// 保存代码到logseq块
const saveCodeToLogseq = () => {
  console.log("同步代码到logseq块内容:", fragmentShaderCode.value)
  if (typeof logseq !== 'undefined') {
    const uuid = getBlockUUID()
    if (uuid) {
      logseq.Editor.upsertBlockProperty(uuid, 'liveCoderFragmentContent', fragmentShaderCode.value)
        .catch(console.error)
    }
  } else if (window.parent !== window) {
    // 在iframe模式下，通过postMessage与父窗口通信
    window.parent.postMessage({
      type: 'SAVE_CONTENT',
      uuid: getBlockUUID(),
      content: fragmentShaderCode.value
    }, '*');
  }
}

// 获取块UUID
const getBlockUUID = () => {
  // 在iframe模式下，从URL参数获取uuid
  if (window.parent !== window) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('uuid')
  }
  
  // 在独立模式下，使用默认uuid
  return 'standalone'
}

// 加载代码和状态
const loadContentAndState = async () => {
  if (typeof logseq !== 'undefined') {
    const uuid = getBlockUUID()
    if (uuid) {
      try {
        // 加载代码内容
        const block = await logseq.Editor.getBlock(uuid)
        if (block && block.properties) {
          // 加载代码
          if (block.properties.liveCoderFragmentContent) {
            fragmentShaderCode.value = block.properties.liveCoderFragmentContent
            lastSavedCode = fragmentShaderCode.value
          }
          
          // 加载预览位置
          if (block.properties.liveCoderPreviewPosition) {
            previewPosition.x = block.properties.liveCoderPreviewPosition.x
            previewPosition.y = block.properties.liveCoderPreviewPosition.y
          }
        }
      } catch (error) {
        console.error('Failed to load content and state:', error)
      }
    }
  } else if (window.parent !== window) {
    // 在iframe模式下，通过postMessage与父窗口通信加载内容
    return new Promise((resolve) => {
      // 监听来自父窗口的消息
      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === 'CONTENT_AND_STATE_LOADED' && event.data.uuid === getBlockUUID()) {
          // 加载代码
          if (event.data.content.code) {
            fragmentShaderCode.value = event.data.content.code
            lastSavedCode = fragmentShaderCode.value
          }
          
          // 加载预览位置
          if (event.data.content.position) {
            previewPosition.x = event.data.content.position.x
            previewPosition.y = event.data.content.position.y
          }
          
          // 移除事件监听器
          window.removeEventListener('message', messageHandler)
          resolve(null)
        }
      };
      
      // 添加事件监听器
      window.addEventListener('message', messageHandler)
      
      // 请求加载内容和状态
      window.parent.postMessage({
        type: 'LOAD_CONTENT_AND_STATE',
        uuid: getBlockUUID()
      }, '*');
      
      // 设置超时
      setTimeout(() => {
        window.removeEventListener('message', messageHandler)
        resolve(null)
      }, 1000)
    })
  }
}

// 处理渲染器错误
const handleRendererError = (error: string) => {
  if (error) {
    errorContent.value = `[${new Date().toLocaleTimeString()}] ${error}`
    showEditorError(error)
  } else {
    // 清除错误
    clearEditorErrors()
    errorContent.value = ''
  }
}

// 在编辑器中显示错误
const showEditorError = (error: string) => {
  if (!monacoEditorRef.value || !monacoEditorRef.value.editor) return
  
  // 动态导入 monaco-editor
  import('monaco-editor').then((monaco) => {
    // 尝试从错误信息中提取行号
    const lineMatch = error.match(/ERROR: \d+:(\d+):/) || error.match(/(\d+):(\d+)/); // GLSL 编译器常见格式
    let lineNumber = 1;
    if (lineMatch) {
      lineNumber = parseInt(lineMatch[1]);
    }

    const editor = monacoEditorRef.value.editor;
    const model = editor.getModel();
    
    if (model) {
      // 清除之前的错误装饰
      errorDecorationId = editor.deltaDecorations(errorDecorationId, [{
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: 'inline-error-line',
          glyphMarginClassName: 'inline-error-glyph',
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          hoverMessage: { value: error }
        }
      }]);
    }
  });
}

// 清除编辑器中的错误标记
const clearEditorErrors = () => {
  if (!monacoEditorRef.value || !monacoEditorRef.value.editor) return
  
  import('monaco-editor').then((monaco) => {
    const editor = monacoEditorRef.value.editor;
    errorDecorationId = editor.deltaDecorations(errorDecorationId, []);
  });
}

// 初始化函数
const init = async () => {
  // 加载内容和状态
  await loadContentAndState()
  
  initialized.value = true
  console.log('Live Coder Vue App initialized')
}

// 启动自动保存定时器
const startAutoSave = () => {
  // 清除已有的定时器
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
  
  // 每2秒检查并自动保存（只有在有更改时才保存）
  autoSaveTimer = window.setInterval(() => {
    saveAndCompile()
  }, 2000)
}

onMounted(() => {
  init().then(() => {
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
    
    // 启动自动保存
    startAutoSave()
    
    // 添加CSS样式用于错误显示
    const style = document.createElement('style')
    style.innerHTML = `
      .inline-error-line {
        background-color: #dc2626 !important; /* 大红色背景 */
        color: white !important;
        position: relative;
      }
      
      .inline-error-line::after {
        content: attr(data-error);
        position: absolute;
        bottom: -20px;
        left: 0;
        background-color: #dc2626;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        z-index: 100;
        white-space: nowrap;
      }
      
      .inline-error-glyph {
        background-color: #dc2626;
        color: white;
        mask: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='white' d='M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm3.5 10.5L8 8l-3.5 3.5-1-1L7 7 3.5 3.5l1-1L8 6l3.5-3.5 1 1L9 7l3.5 3.5-1 1z'/></svg>") no-repeat 50% 50%;
        -webkit-mask: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='white' d='M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm3.5 10.5L8 8l-3.5 3.5-1-1L7 7 3.5 3.5l1-1L8 6l3.5-3.5 1 1L9 7l3.5 3.5-1 1z'/></svg>") no-repeat 50% 50%;
      }
      
      .resize {
        overflow: auto;
        resize: both;
      }
    `
    document.head.appendChild(style)
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  
  // 清除自动保存定时器
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
  
  // 在卸载前保存一次
  saveAndCompile()
})

// 监听代码变化
watch(fragmentShaderCode, (newCode) => {
  // 检查是否有未保存的更改
  hasUnsavedChanges = newCode !== lastSavedCode
  
  // 代码变化时立即标记着色器需要更新，但不立即编译
  if (shaderRendererRef.value) {
    shaderRendererRef.value.markForUpdate()
  }
}, { immediate: true })
</script>

<style scoped>
.shader-preview {
  transition: opacity 0.2s ease;
}

.error-panel {
  max-height: 200px;
  overflow-y: auto;
}
</style>