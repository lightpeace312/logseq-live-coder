<template>
    <div></div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

// 代码内容
const htmlCode = ref(defaultHTML)
const cssCode = ref(defaultCSS)
const jsCode = ref(defaultJS)
// 监听HTML代码变化并更新预览
watch([htmlCode, cssCode, jsCode], () => {
  if (language.value === 'html') {
    updateHTMLPreview()
  }
}, { immediate: true })

// 更新HTML预览
const updateHTMLPreview = () => {
  if (!previewFrame.value) return
  
  const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>${cssCode.value}</style>
</head>
<body>
  ${htmlCode.value}
  <script>${jsCode.value}<\/script>
</body>
</html>
  `
  
  try {
    const iframeDoc = previewFrame.value.contentDocument || previewFrame.value.contentWindow?.document
    if (iframeDoc) {
      iframeDoc.open()
      iframeDoc.write(fullHTML)
      iframeDoc.close()
    }
  } catch (e) {
    console.warn('无法直接写入iframe内容，尝试使用srcdoc属性', e)
    previewFrame.value.srcdoc = fullHTML
  }
}

// DOM 引用
const previewFrame = ref<HTMLIFrameElement | null>(null)
</script>