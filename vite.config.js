import { defineConfig } from 'vite';

export default defineConfig({
  // 使用相对路径
  base: './',
  build:{
    cssCodeSplit:false
  }
  // 正确解析@logseq/libs模块
});