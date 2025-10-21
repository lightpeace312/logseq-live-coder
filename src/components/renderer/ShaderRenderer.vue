<template>
  <canvas ref="canvasRef" class="h-[320px] min-w-[320px]"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  fragmentShader: string
  vertexShader: string
}>()

const emit = defineEmits<{
  (e: 'error', error: string): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let animationId: number | null = null
let lastRenderTime = 0
let needsUpdate = false
let positionBuffer: WebGLBuffer | null = null

// 初始化WebGL
const initWebGL = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  gl = canvas.getContext('webgl') 
  
  if (!gl) {
    const errorMsg = 'Unable to initialize WebGL'
    console.error(errorMsg)
    emit('error', errorMsg)
    return
  }
  
  // 设置WebGL参数
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  
  // 创建顶点缓冲区
  initBuffers()
}

// 创建顶点缓冲区
const initBuffers = () => {
  if (!gl) return
  
  // 创建位置缓冲区
  positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  
  // 定义全屏四边形的顶点坐标
  const positions = new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0
  ])
  
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
}

// 创建着色器
const createShader = (type: number, source: string) => {
  if (!gl) return null
  
  const shader = gl.createShader(type)
  if (!shader) return null
  
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errorMsg = `Shader compile error: ${gl.getShaderInfoLog(shader)}`
    console.error(errorMsg)
    emit('error', errorMsg)
    gl.deleteShader(shader)
    return null
  }
  
  return shader
}

// 创建着色器程序
const createProgram = (vertexShader: WebGLShader | null, fragmentShader: WebGLShader | null) => {
  if (!gl || !vertexShader || !fragmentShader) return null
  
  const program = gl.createProgram()
  if (!program) return null
  
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const errorMsg = `Program link error: ${gl.getProgramInfoLog(program)}`
    console.error(errorMsg)
    emit('error', errorMsg)
    gl.deleteProgram(program)
    return null
  }
  
  return program
}

// 编译和显示着色器
const compileAndDisplay = () => {
  if (!gl) return
  
  // 清除之前的错误
  emit('error', '')
  
  const vertexShader = createShader(gl.VERTEX_SHADER, props.vertexShader)
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, props.fragmentShader)
  
  if (!vertexShader || !fragmentShader) {
    console.error('Failed to create shaders')
    return
  }
  
  const newProgram = createProgram(vertexShader, fragmentShader)
  if (!newProgram) {
    console.error('Failed to create program')
    return
  }
  
  // 清理旧程序
  if (program) {
    gl.deleteProgram(program)
  }
  
  program = newProgram
  gl.useProgram(program)
  
  // 设置顶点属性
  if (positionBuffer) {
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
  }
  
  needsUpdate = false
}

// 渲染函数
const render = (timestamp: number) => {
  if (!gl || !program || !canvasRef.value) return
  
  // 如果需要更新，重新编译着色器
  if (needsUpdate) {
    compileAndDisplay()
  }
  
  // 控制帧率，约60FPS
  if (timestamp - lastRenderTime > 16) {
    const canvas = canvasRef.value
    gl.viewport(0, 0, canvas.width, canvas.height)
    
    // 获取uniform变量位置
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    
    // 设置uniform变量
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
    gl.uniform1f(timeLocation, timestamp / 1000)
    
    // 绘制全屏四边形
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    
    lastRenderTime = timestamp
  }
  
  animationId = requestAnimationFrame(render)
}

// 启动动画循环
const startAnimationLoop = () => {
  stopAnimationLoop() // 先停止现有的动画循环
  animationId = requestAnimationFrame(render)
}

// 停止动画循环
const stopAnimationLoop = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

// 标记需要更新
const markForUpdate = () => {
  needsUpdate = true
}

// 监听着色器变化，但不立即更新，只标记需要更新
watch([() => props.fragmentShader, () => props.vertexShader], () => {
  markForUpdate()
}, { immediate: false })

onMounted(() => {
  initWebGL()
  // 初始编译
  compileAndDisplay()
  startAnimationLoop()
})

onBeforeUnmount(() => {
  stopAnimationLoop()
  if (gl && program) {
    gl.deleteProgram(program)
  }
})

// 暴露方法给父组件，用于手动触发更新
defineExpose({
  compileAndDisplay,
  markForUpdate
})
</script>