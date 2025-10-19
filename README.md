# Live Coder

本仓库为一个 Logseq 插件，用来实现实时代码编译显示。

参考常见的代码预览器设计，左侧是一个代码编辑器，右侧是编译后的效果，如果编译不通过则在右侧显示错误信息。

## 功能特点

- 实时编辑 GLSL shader 代码
- 实时编辑 HTML/CSS/JS 代码
- 即时预览渲染效果
- 错误提示显示
- 自动刷新动画效果

## 安装说明

1. 在 Logseq 的插件市场中搜索 "Live Coder" 并安装
2. 或者下载插件包，在 Logseq 的插件管理中选择"从磁盘加载未打包的插件"

## 使用方法

在 Logseq 中有几种方式可以创建一个代码编辑块：

1. **右键菜单**：在任意块中右键，选择 "Create Live Code Block"
2. **斜杠命令**：在块中输入 [/] 并搜索 "Live Code"

创建后会显示一个编辑器和预览窗口，可以在编辑器中编写代码，预览窗口会实时显示渲染效果。

## Shader 编程说明

- 支持标准 GLSL 语法
- 提供以下内置 uniform 变量：
  - `u_time`: 自 1970 年以来的秒数，可用于动画
  - `u_resolution`: 画布分辨率 (width, height)
- 需要设置 `gl_FragColor` 来指定像素颜色

示例：
```glsl
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    gl_FragColor = vec4(uv, 0.5, 1.0);
}
```

## HTML/CSS/JS 编程说明

- 支持标准 HTML/CSS/JS 语法
- 可以在不同标签页中编辑 HTML、CSS 和 JavaScript
- 实时预览网页效果

## 开发计划

- [x] 基础编辑器和预览界面
- [x] WebGL shader 编译和渲染
- [x] HTML/CSS/JS 编辑和预览
- [x] 实时错误显示
- [x] Logseq 插件集成
- [ ] 支持保存和加载代码
- [ ] 添加更多示例