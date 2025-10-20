// // 从模块导入常量和函数
// import { defaultFragmentShader, defaultVertexShader, defaultHTML, defaultCSS, defaultJS } from './src/constants';
// import { initWebGL, createShader, createProgram, showShaderError, hideShaderError, render, compileAndDisplay } from './src/shader-renderer';
// import { updateHTMLPreview } from './src/html-renderer';
// import { initMonacoEditors ,setupTabSwitching, setupCodeTypeSwitching, saveEditorContent } from './src/editor-manager';
// import { initMonaco } from './src/monaco-config';
// import '@logseq/libs'
// // WebGL上下文和程序
// let gl = null;
// let program = null;
// let lastRenderTime = 0;
// let animationFrameId = null;
// let saveTimeout = null;

// // 启动着色器动画循环
// function startAnimationLoop(canvas, shaders) {
//     function animate(timestamp) {
//         if (timestamp - lastRenderTime > 16) {
//             render(canvas, shaders);
//             lastRenderTime = timestamp;
//         }
//         animationFrameId = requestAnimationFrame(animate);
//     }
//     animationFrameId = requestAnimationFrame(animate);
// }

// // 停止动画循环
// function stopAnimationLoop() {
//     if (animationFrameId) {
//         cancelAnimationFrame(animationFrameId);
//         animationFrameId = null;
//     }
// }

// // 初始化着色器编辑器
// export function initShaderEditor(container) {
//     if (!container) {
//         console.error('Container element not found');
//         return;
//     }
    
//     const canvas = container.querySelector('.live-shader-canvas');
//     const shaders = {
//         vertex: defaultVertexShader,
//         fragment: defaultFragmentShader
//     };
    
//     // 获取UUID用于保存内容
//     const uuid = container.getAttribute('data-uuid');
    
//     let activeTab = 'fragment';
//     let language = 'shader';
    
//     initWebGL(canvas);
//     const editors = initMonacoEditors(container);
//     setupTabSwitching(container, editors);
    
//     setupCodeTypeSwitching(container, editors, (newType, editors) => {
//         language = newType;
        
//         const shaderTabsContainer = container.querySelector('.shader-tabs');
//         const htmlTabsContainer = container.querySelector('.html-tabs');
//         const canvas = container.querySelector('.live-shader-canvas');
//         const iframe = container.querySelector('.live-html-preview');
        
//         if (language === 'shader') {
//             shaderTabsContainer.style.display = 'flex';
//             htmlTabsContainer.style.display = 'none';
//             canvas.style.display = 'block';
//             iframe.style.display = 'none';
            
//             Object.keys(editors._containers || {}).forEach(type => {
//                 if (editors._containers[type]) {
//                     editors._containers[type].style.display = (type === activeTab && (type === 'fragment' || type === 'vertex')) ? 'block' : 'none';
//                 }
//             });
            
//             startAnimationLoop(canvas, shaders);
//         } else {
//             shaderTabsContainer.style.display = 'none';
//             htmlTabsContainer.style.display = 'flex';
//             canvas.style.display = 'none';
//             iframe.style.display = 'block';
            
//             Object.keys(editors._containers || {}).forEach(type => {
//                 if (editors._containers[type]) {
//                     editors._containers[type].style.display = (type === activeTab && (type === 'html' || type === 'css' || type === 'js')) ? 'block' : 'none';
//                 }
//             });
            
//             stopAnimationLoop();
//             updateHTMLPreview(editors, container);
//         }
//     });
    
//     if (editors.fragment) editors.fragment.setValue(defaultFragmentShader);
//     if (editors.vertex) editors.vertex.setValue(defaultVertexShader);
//     if (editors.html) editors.html.setValue(defaultHTML);
//     if (editors.css) editors.css.setValue(defaultCSS);
//     if (editors.js) editors.js.setValue(defaultJS);
    
//     // 设置内容变化监听器以保存内容
//     Object.keys(editors).forEach(type => {
//         if (type.startsWith('_')) return;
        
//         if (editors[type] && typeof editors[type].onDidChangeModelContent === 'function') {
//             editors[type].onDidChangeModelContent(() => {
//                 if (language === 'shader') {
//                     shaders[type] = editors[type].getValue();
//                     compileAndDisplay(canvas, shaders);
//                 } else {
//                     updateHTMLPreview(editors, container);
//                 }
                
//                 // 防抖保存，避免过于频繁的保存操作
//                 if (saveTimeout) clearTimeout(saveTimeout);
//                 saveTimeout = setTimeout(() => {
//                     if (uuid) {
//                         saveEditorContent(uuid, editors);
//                     }
//                 }, 2000); // 2秒后保存
//             });
//         }
//     });
    
//     if (language === 'shader') {
//         compileAndDisplay(canvas, shaders);
//         startAnimationLoop(canvas, shaders);
//     } else {
//         updateHTMLPreview(editors, container);
//     }
    
//     return editors;
// }

// // 初始化所有编辑器
// function initAllEditors() {
//     const containers = document.querySelectorAll('.live-shader-container');
//     const editors = [];
//     containers.forEach(container => {
//         editors.push(initShaderEditor(container));
//     });
//     return editors;
// }

// // 页面加载完成后初始化
// document.addEventListener('DOMContentLoaded', () => {
//     // 初始化Monaco
//     initMonaco();
    
//     // 确保Monaco Editor已加载
//     if (typeof require !== 'undefined') {
//         require(['vs/editor/editor.main'], function() {
//             initAllEditors();
//         });
//     } else {
//         // 如果require不可用，尝试直接初始化
//         setTimeout(() => {
//             try {
//                 initAllEditors();
//             } catch (e) {
//                 console.error('Failed to initialize editors:', e);
//             }
//         }, 100);
//     }
// });

// window.initShaderEditor = initShaderEditor;
// window.initAllEditors = initAllEditors;