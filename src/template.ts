export function getTemplate(uuid: string, defaultFragmentShader: string) {
  return `
        <div class="live-shader-container" data-uuid="${uuid}">
          <div class="live-shader-editor-wrapper">
            <div class="panel-header">
            <span>代码</span>
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
              <canvas class="live-shader-canvas" width="320" height="320" data-id="${uuid}"></canvas>
              <iframe class="live-html-preview" data-id="${uuid}" style="display: none;"></iframe>
            </div>
            <div class="live-shader-error" data-id="${uuid}"></div>
          </div>
        </div>
      `
}

