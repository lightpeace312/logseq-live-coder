// 默认 fragment shader 代码
export const defaultFragmentShader = `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float r = sin(uv.x * 3.14159 * 2.0 + u_time) * 0.5 + 0.5;
    float g = sin(uv.y * 3.14159 * 4.0 + u_time) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 3.14159 + u_time) * 0.5 + 0.5;
    
    gl_FragColor = vec4(r, g, b, 1.0);
}`;

// Vertex shader 代码（默认）
export const defaultVertexShader = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// 默认 HTML 代码
export const defaultHTML = `<h1>Hello, World!</h1>
<p>This is a live HTML preview.</p>`;

// 默认 CSS 代码
export const defaultCSS = `body {
background:white;
  font-family: Arial, sans-serif;
  margin: 20px;
}`;

// 默认 JS 代码
export const defaultJS = `console.log('Hello from live JavaScript!');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM is ready');
});`;