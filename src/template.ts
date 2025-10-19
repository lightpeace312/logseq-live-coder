export function getTemplate(uuid: string, defaultFragmentShader: string) {
  return `
        <div class="live-shader-container" data-uuid="${uuid}">
          <div class="live-shader-editor-wrapper">
            <div class="panel-header">
              代码
               <select class="code-type-selector" data-id="${uuid}">
                <option value="shader">Shader</option>
                <option value="html">HTML</option>
              </select>
              <!-- Shader 模式标签页 -->
               <div class="tabs shader-tabs">
                <div class="tab active" data-tab="fragment">Fragment</div>
                <div class="tab" data-tab="vertex">Vertex</div>
              </div>
              <!-- HTML 模式标签页 -->
              <div class="tabs html-tabs" style="display: none;">
                <div class="tab active" data-tab="html">HTML</div>
                <div class="tab" data-tab="css">CSS</div>
                <div class="tab" data-tab="js">JavaScript</div>
              </div>
             
            </div>
           
            
            <!-- Shader 模式编辑器 -->
            <textarea class="live-shader-editor" data-type="fragment" data-id="${uuid}">${defaultFragmentShader}</textarea>
            <textarea class="live-shader-editor" data-type="vertex" data-id="${uuid}" style="display: none;"></textarea>
            <!-- HTML 模式编辑器 -->
            <textarea class="live-html-editor" data-type="html" data-id="${uuid}" style="display: none;"></textarea>
            <textarea class="live-html-editor" data-type="css" data-id="${uuid}" style="display: none;"></textarea>
            <textarea class="live-html-editor" data-type="js" data-id="${uuid}" style="display: none;"></textarea>
          </div>
          <div class="live-shader-preview-wrapper">
            <div class="panel-header">预览</div>
            <div class="panel-content">
              <canvas class="live-shader-canvas" width="384" height="384" data-id="${uuid}"></canvas>
              <iframe class="live-html-preview" data-id="${uuid}" style="display: none;"></iframe>
            </div>
            <div class="live-shader-error" data-id="${uuid}"></div>
          </div>
        </div>
      `
}

export function getStyle(){
  return `
    .live-shader-container .panel-header {
      line-height:1em;
      padding:0px 12px ;

      color:#808080;
      height:28px;
      background-color: #242424;
      border-bottom: 1px solid #4f4f4f;
      display: flex;
      gap:18px;
      /* justify-content: space-between; */
      align-items: center;
    }

    .live-shader-container .code-type-selector {
      border-radius: 5px;
      box-shadow: 2px;
      padding: 2px 2px;
      font-size:12px;
      border: none;
      background-color: #3a3a3a;
      color:#d0d4dd;

    }

    /* 标签页样式 */
    .live-shader-container .tabs {
      display: flex;align-items: center;
      height:100%;font-size:14px;
      border-left: 1px solid #404040;

    }

    .live-shader-container .tab {
      height:100%;padding:0px 12px;
      cursor: pointer;
      border-right: 1px solid #404040;
      background-color: #2a2a2a;
      color:#999;
      display:flex;align-items: center;
    }

    .live-shader-container .tab.active {
      color:rgb(164, 169, 179);
      background-color: #3a3a3a;
    }

    .live-shader-editor, .live-html-editor {
      flex: 1;
      border: none;
      resize: none;
      padding: 10px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      outline: none;
    }

    .live-shader-container {
      display: flex;
      height: 500px;
      width: 100%;
      position: relative;
    }

    .live-shader-editor-wrapper {
      flex: 1;
      border-right: 1px solid #4f4f4f;
      display: flex;
      flex-direction: column;
    }

    .live-shader-preview-wrapper {
      height:100%;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .live-shader-container .panel-content {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #1e1e1e;
    }

    .live-shader-canvas {
      max-width: 100%;
      max-height: 100%;
    }

    .live-html-preview {
      width: 100%;
      height: 100%;
      border: none;
    }

    .live-shader-error {
      flex: 1;
      padding: 10px;
      background-color: #ffeeee;
      color: #cc0000;
      overflow-y: auto;
      display: none;
    }
    
    .live-shader-container .monaco-editor-container {
      height: 100%;
      width: 100%;
    }
    
    /* Monaco Editor 样式修复 */
    .live-shader-container .monaco-editor {
      height: 100%;
      width: 100%;
    }
    
    .live-shader-container .monaco-editor .margin {
      background-color: #1e1e1e !important;
    }
    
    .live-shader-container .monaco-editor .monaco-editor-background {
      background-color: #1e1e1e !important;
    }
    
    /* 覆盖Logseq默认样式对Monaco的影响 */
    .live-shader-container .monaco-scrollable-element>.shadow {
      box-shadow: none !important;
    }
    
    .live-shader-container .monaco-editor .minimap {
      display: none !important;
    }
    
    /* 确保编辑器内容区域正确显示 */
    .live-shader-container .monaco-editor .view-line {
      color: #d4d4d4 !important;
    }
    
    .live-shader-container .monaco-editor .line-numbers {
      color: #858585 !important;
    }
    
    /* 修复字体显示问题 */
    .live-shader-container .monaco-editor,
    .live-shader-container .monaco-editor .margin-view-overlays {
      font-family: "Input", "JetBrains Mono", "Fira Code", "Consolas", "Courier New", monospace !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
    }
    
    /* 确保编辑器工具提示正确显示 */
    .monaco-editor .monaco-hover {
      background-color: #252526 !important;
      color: #cccccc !important;
      border: 1px solid #454545 !important;
      box-shadow: 0 2px 8px #000000 !important;
    }
    
    /* 修复自动补全窗口样式 */
    .monaco-editor .suggest-widget {
      background-color: #252526 !important;
      border: 1px solid #454545 !important;
    }
    
    .monaco-editor .suggest-widget .monaco-list .monaco-list-row {
      color: #d4d4d4 !important;
    }
    
    .monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused {
      background-color: #04395e !important;
    }
    
    /* 修复错误标记显示 */
    .monaco-editor .squiggly-error {
      background: none !important;
      border-bottom: 2px solid #f48771 !important;
    }
    
    /* 修复搜索框样式 */
    .monaco-editor .find-widget {
      background-color: #2d2d30 !important;
      border: 1px solid #454545 !important;
    }
  `
}