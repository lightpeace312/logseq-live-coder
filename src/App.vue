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
      
      <!-- 保存按钮 -->
      <button 
        @click="saveAndCompile" 
        class="save-button absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg z-10"
      >
        保存并编译
      </button>
      
      <!-- Shader预览浮窗 -->
      <div 
        ref="previewRef"
        class="shader-preview absolute w-[320px] h-[320px] bg-gray-800 border border-gray-600 rounded shadow-lg z-10 cursor-move"
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
import { ref, onMounted, onUnmounted, reactive } from 'vue'
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
}

// 保存并编译代码
const saveAndCompile = () => {
  // 清除之前的错误标记和内容
  clearEditorErrors()
  errorContent.value = ''
  
  // 更新编译后的着色器代码
  compiledFragmentShader.value = fragmentShaderCode.value
  
  // 强制重新编译着色器
  if (shaderRendererRef.value) {
    shaderRendererRef.value.markForUpdate()
  }
  
  // 模拟同步到logseq块内容（实际项目中需要替换为真实的logseq API调用）
  console.log("同步代码到logseq块内容:", fragmentShaderCode.value)
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
const init = () => {
  initialized.value = true
  console.log('Live Coder Vue App initialized')
}

onMounted(() => {
  init()
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  
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
  `
  document.head.appendChild(style)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.save-button {
  transition: all 0.2s ease;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.shader-preview {
  transition: opacity 0.2s ease;
}

.error-panel {
  max-height: 200px;
  overflow-y: auto;
}
</style>