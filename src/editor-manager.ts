/// <reference path="../global.d.ts" />

import { defaultFragmentShader, defaultVertexShader, defaultHTML, defaultCSS, defaultJS } from './constants';

import monaco from './monaco-config';

// 声明logseq变量以解决TypeScript编译错误
declare const logseq: any;

// 初始化 Monaco Editor
export function initMonacoEditors(container: HTMLElement) {
    const editors: any = {};
    
    // 获取所有编辑器元素
    const shaderEditors = container.querySelectorAll('.live-shader-editor');
    const htmlEditors = container.querySelectorAll('.live-html-editor');
    
    // 创建容器映射以跟踪 Monaco 容器和编辑器
    const editorContainers: Record<string, HTMLElement> = {};
    
    // 确保主题已定义
    try {
        monaco.editor.defineTheme('logseq-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: '569CD6' },
                { token: 'identifier', foreground: '9CDCFE' },
                { token: 'operator', foreground: 'D4D4D4' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'comment', foreground: '6A9955' }
            ],
            colors: {
                'editor.background': '#1E1E1E',
                'editor.lineHighlightBackground': '#2F2F2F'
            }
        });
    } catch (e) {
        // 主题可能已定义，忽略错误
        console.debug('Theme already defined', e);
    }
    
    // 设置主题
    monaco.editor.setTheme('logseq-dark');
    
    // 初始化 Shader 编辑器
    shaderEditors.forEach(editorEl => {
        const type = editorEl.getAttribute('data-type');
        if (!type) return;
        
        // 获取默认值
        let value = (editorEl as HTMLTextAreaElement).value;
        if (!value) {
            // 设置默认值
            if (type === 'fragment') {
                value = defaultFragmentShader;
            } else if (type === 'vertex') {
                value = defaultVertexShader;
            }
        }
        
        // 创建 Monaco Editor 容器
        const monacoContainer = document.createElement('div');
        monacoContainer.className = 'monaco-editor-container';
        monacoContainer.style.height = '100%';
        monacoContainer.style.display = (editorEl as HTMLElement).style.display; // 继承显示属性
        
        // 保存容器引用
        editorContainers[type] = monacoContainer;
        
        // 替换 textarea
        editorEl.parentNode?.replaceChild(monacoContainer, editorEl);
        
        // 创建 Monaco Editor 实例
        if (typeof monaco !== 'undefined') {
            editors[type] = monaco.editor.create(monacoContainer, {
                value: value,
                language: type === 'fragment' || type === 'vertex' ? 'glsl' : 'plaintext',
                theme: 'logseq-dark',
                automaticLayout: true,
                formatOnType: true,
                formatOnPaste: true,
                tabCompletion: 'on',
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto'
                },
                minimap: {
                    enabled: false
                },
                fontSize: 14,
                lineHeight: 21,
                fontFamily: '"Input", "JetBrains Mono", "Fira Code", "Consolas", "Courier New", monospace'
            });
            
            // 添加格式化快捷键 (Ctrl+Shift+I 或 Cmd+Shift+I)
            editors[type].addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI, () => {
                editors[type].getAction('editor.action.formatDocument').run();
            });
            
            // 添加Tab补全快捷键
            editors[type].addCommand(monaco.KeyCode.Tab, () => {
                const action = editors[type].getAction('editor.action.triggerSuggest');
                if (action) {
                    action.run();
                }
            });
        } else {
            // 如果 Monaco 未加载，使用 textarea 作为后备
            monacoContainer.parentNode?.replaceChild(editorEl, monacoContainer);
            (editorEl as HTMLTextAreaElement).value = value;
            editors[type] = {
                getValue: () => (editorEl as HTMLTextAreaElement).value,
                setValue: (val: string) => (editorEl as HTMLTextAreaElement).value = val,
                onDidChangeModelContent: (callback: () => void) => editorEl.addEventListener('input', callback),
                layout: () => {},
                dispose: () => {}
            };
        }
    });
    
    // 初始化 HTML 编辑器
    htmlEditors.forEach(editorEl => {
        const type = editorEl.getAttribute('data-type');
        if (!type) return;
        
        let value = '';
        
        // 设置默认值
        switch(type) {
            case 'html':
                value = defaultHTML;
                break;
            case 'css':
                value = defaultCSS;
                break;
            case 'js':
                value = defaultJS;
                break;
        }
        
        // 创建 Monaco Editor 容器
        const monacoContainer = document.createElement('div');
        monacoContainer.className = 'monaco-editor-container';
        monacoContainer.style.height = '100%';
        monacoContainer.style.display = (editorEl as HTMLElement).style.display; // 继承显示属性
        
        // 保存容器引用
        editorContainers[type] = monacoContainer;
        
        // 替换 textarea
        editorEl.parentNode?.replaceChild(monacoContainer, editorEl);
        
        // 创建 Monaco Editor 实例
        if (typeof monaco !== 'undefined') {
            let language = 'html';
            if (type === 'css') language = 'css';
            if (type === 'js') language = 'javascript';
            
            editors[type] = monaco.editor.create(monacoContainer, {
                value: value,
                language: language,
                theme: 'logseq-dark',
                automaticLayout: true,
                formatOnType: true,
                formatOnPaste: true,
                tabCompletion: 'on',
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto'
                },
                minimap: {
                    enabled: false
                },
                fontSize: 14,
                lineHeight: 21,
                fontFamily: '"Input", "JetBrains Mono", "Fira Code", "Consolas", "Courier New", monospace'
            });
            
            // 添加格式化快捷键 (Ctrl+Shift+I 或 Cmd+Shift+I)
            editors[type].addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI, () => {
                editors[type].getAction('editor.action.formatDocument').run();
            });
            
            // 添加Tab补全快捷键
            editors[type].addCommand(monaco.KeyCode.Tab, () => {
                const action = editors[type].getAction('editor.action.triggerSuggest');
                if (action) {
                    action.run();
                }
            });
        } else {
            // 如果 Monaco 未加载，使用 textarea 作为后备
            monacoContainer.parentNode?.replaceChild(editorEl, monacoContainer);
            (editorEl as HTMLTextAreaElement).value = value;
            editors[type] = {
                getValue: () => (editorEl as HTMLTextAreaElement).value,
                setValue: (val: string) => (editorEl as HTMLTextAreaElement).value = val,
                onDidChangeModelContent: (callback: () => void) => editorEl.addEventListener('input', callback),
                layout: () => {},
                dispose: () => {}
            };
        }
    });
    
    // 将容器映射附加到编辑器对象上
    editors._containers = editorContainers;
    
    return editors;
}

// 设置标签页切换
export function setupTabSwitching(container: HTMLElement, editors: any) {
    const shaderTabs = container.querySelectorAll('.shader-tabs .tab');
    const htmlTabs = container.querySelectorAll('.html-tabs .tab');
    
    // Shader 标签页切换
    shaderTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.getAttribute('data-tab');
            if (!tabType) return;
            
            // 更新活动标签样式
            shaderTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 显示对应的编辑器容器
            Object.keys(editors._containers || {}).forEach(type => {
                if (editors._containers[type]) {
                    editors._containers[type].style.display = (type === tabType) ? 'block' : 'none';
                }
            });
            
            // 如果是 Monaco 编辑器，调用 layout 方法
            if (editors[tabType] && typeof editors[tabType].layout === 'function') {
                // 延迟调用layout以确保DOM更新完成
                setTimeout(() => {
                    editors[tabType].layout();
                }, 0);
            }
        });
    });
    
    // HTML 标签页切换
    htmlTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.getAttribute('data-tab');
            if (!tabType) return;
            
            // 更新活动标签样式
            htmlTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 显示对应的编辑器容器
            Object.keys(editors._containers || {}).forEach(type => {
                if (editors._containers[type]) {
                    editors._containers[type].style.display = (type === tabType) ? 'block' : 'none';
                }
            });
            
            // 如果是 Monaco 编辑器，调用 layout 方法
            if (editors[tabType] && typeof editors[tabType].layout === 'function') {
                // 延迟调用layout以确保DOM更新完成
                setTimeout(() => {
                    editors[tabType].layout();
                }, 0);
            }
        });
    });
}

// 设置代码类型切换
export function setupCodeTypeSwitching(container: HTMLElement, editors: any, onCodeTypeChange: (newType: string, editors: any) => void) {
    const codeTypeSelector = container.querySelector('.code-type-selector') as HTMLSelectElement;
    if (!codeTypeSelector) return;
    
    codeTypeSelector.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const newType = target.value;
        onCodeTypeChange(newType, editors);
    });
}

// 获取编辑器内容
export function getEditorContent(editors: any) {
    const content: any = {};
    
    // 获取着色器内容
    if (editors.fragment || editors.vertex) {
        content.shader = {
            fragment: editors.fragment ? editors.fragment.getValue() : '',
            vertex: editors.vertex ? editors.vertex.getValue() : ''
        };
    }
    
    // 获取HTML内容
    if (editors.html || editors.css || editors.js) {
        content.html = {
            html: editors.html ? editors.html.getValue() : '',
            css: editors.css ? editors.css.getValue() : '',
            js: editors.js ? editors.js.getValue() : ''
        };
    }
    
    return JSON.stringify(content);
}

// 保存编辑器内容到Logseq块
export async function saveEditorContent(uuid: string, editors: any) {
    if (typeof logseq !== 'undefined') {
        try {
            const content = getEditorContent(editors);
            // 将内容保存到块属性中
            await logseq.Editor.upsertBlockProperty(uuid, 'liveCoderContent', content);
        } catch (error) {
            console.error('Failed to save editor content:', error);
        }
    }
}

// 从Logseq块加载编辑器内容
export async function loadEditorContent(uuid: string, editors: any) {
    if (typeof logseq !== 'undefined') {
        try {
            const block = await logseq.Editor.getBlock(uuid);
            if (block && block.properties && block.properties.liveCoderContent) {
                const content = block.properties.liveCoderContent;
                
                // 加载着色器内容
                if (content.shader) {
                    if (editors.fragment && content.shader.fragment) {
                        editors.fragment.setValue(content.shader.fragment);
                    }
                    if (editors.vertex && content.shader.vertex) {
                        editors.vertex.setValue(content.shader.vertex);
                    }
                }
                
                // 加载HTML内容
                if (content.html) {
                    if (editors.html && content.html.html) {
                        editors.html.setValue(content.html.html);
                    }
                    if (editors.css && content.html.css) {
                        editors.css.setValue(content.html.css);
                    }
                    if (editors.js && content.html.js) {
                        editors.js.setValue(content.html.js);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load editor content:', error);
        }
    }
}