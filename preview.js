import { getTemplate } from "./src/template";

document.addEventListener('DOMContentLoaded', () => {
  const defaultFragmentShader = `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float r = sin(uv.x * 3.14159 * 2.0 + u_time) * 0.5 + 0.5;
    float g = sin(uv.y * 3.14159 * 4.0 + u_time) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 3.14159 + u_time) * 0.5 + 0.5;
    
    gl_FragColor = vec4(r, g, b, 1.0);
}`;

  const app = document.getElementById('app');
  if (app) {
    // 模拟 uuid
    const uuid = 'preview';
   
    app.innerHTML = getTemplate(uuid, defaultFragmentShader);

    // 等待DOM更新后再初始化编辑器
    setTimeout(() => {
      const container = document.querySelector('.live-shader-container');
      if (container) {
        try {
          if (typeof window.initShaderEditor === 'function') {
            window.initShaderEditor(container);
          } else {
            console.warn('initShaderEditor function not available yet');
            // 再次尝试，可能需要更多时间
            setTimeout(() => {
              if (typeof window.initShaderEditor === 'function') {
                window.initShaderEditor(container);
              } else {
                console.error('initShaderEditor function is not available');
              }
            }, 500);
          }
        } catch (e) {
          console.error('Error initializing shader editor:', e);
        }
      }
    }, 100);
  }
});