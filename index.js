import '@logseq/libs'
import { getTemplate } from './src/template';
import { initShaderEditor } from './main';

/**
 * 检查是否在Logseq环境中运行
 * @returns {boolean}
 */
function isLogseqEnvironment() {
  return typeof logseq !== 'undefined';
}

/**
 * 检查是否在浏览器环境中运行
 * @returns {boolean}
 */
function isBrowserEnvironment() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * 初始化插件功能 - iframe模式
 */
async function initPlugin() {
  console.log('Live Coder loaded in iframe mode');

  if (!logseq) {
    console.error('Logseq instance is not available');
    return;
  }

  // 注册插件块类型 - 右键菜单
  logseq.Editor.registerBlockContextMenuItem('Create Live Code Block', async (e) => {
    await logseq.Editor.insertAtEditingCursor('{{renderer live_coder}}');
  });

  // 注册斜杠命令
  logseq.Editor.registerSlashCommand('Live Code', async (e) => {
    await logseq.Editor.insertAtEditingCursor('{{renderer live_coder}}');
  });

  // 处理 block renderer
  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    const [type] = payload.arguments;
    if (type !== 'live_coder') return;

    // 创建唯一标识符
    const uuid = payload.uuid;
    
    // 在iframe模式下，我们需要创建一个iframe来容纳我们的应用
    logseq.provideUI({
      key: `live-coder-block-${uuid}`,
      slot,
      reset: true,
      template: `
          <iframe src="${window.location.origin}${window.location.pathname}" 
          style="min-width: 768px; min-height: 400px; border: none;margin:0 !important;resize:both;" 
          data-uuid="${uuid}"
          id="live-coder-iframe-${uuid}">
          </iframe>
          `,
        });
        // src="${logseq.base.getAssetsRoot()}/timestamp-plugin-iframe/index.html"

    // 向iframe发送初始化消息
    setTimeout(() => {
      const iframe = parent.document.querySelector(`#live-coder-iframe-${uuid}`);
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'INIT_LIVE_CODER',
          uuid: uuid,
        }, '*');
      }
    }, 500);
  });
}

/**
 * 初始化iframe内的应用
 */
function initIframeApp() {
  console.log('Initializing iframe app');
  
  // 监听来自父窗口的消息
  window.addEventListener('message', async (event) => {
    if (event.data && event.data.type === 'INIT_LIVE_CODER') {
      const { uuid, data } = event.data;
      
      // 初始化应用
      const app = document.getElementById('app');
      if (app) {
        // 注入样式
        
        // 设置内容
        app.innerHTML = getTemplate(uuid, data || defaultFragmentShader);
        
        // 初始化编辑器
        const container = document.querySelector('.live-shader-container');
        if (container) {
          setTimeout(() => {
            try {
              initShaderEditor(container);
            } catch (e) {
              console.error('Failed to initialize editor:', e);
            }
          }, 100);
        }
      }
    }
  });

  // 如果是直接访问（独立模式）
  if (window.location === window.parent.location) {
    initStandaloneMode();
  }
}

/**
 * 初始化独立运行模式（用于开发预览）
 */
function initStandaloneMode() {
  console.log('Running in standalone mode');
  
  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }
  
  function initUI() {
    const app = document.getElementById('app');
    if (app) {
      // 模拟 uuid
      const uuid = 'standalone';
      // 注入样式
      
      app.innerHTML = getTemplate(uuid, defaultFragmentShader);
      
      const container = document.querySelector('.live-shader-container');
      if (container) {
        // 延迟初始化以确保DOM完全加载
        setTimeout(() => {
          try {
            initShaderEditor(container);
          } catch (e) {
            console.error('Failed to initialize standalone editor:', e);
          }
        }, 100);
      }
    }
  }
}

/**
 * 主函数
 */
async function main() {
  if (isLogseqEnvironment()) {
    // 在Logseq环境中运行
    await initPlugin();
  } else {
    // 在iframe或浏览器环境中运行
    initIframeApp();
  }
}

// 根据环境选择启动方式
if (isLogseqEnvironment()) {
  logseq.ready(main).catch(console.error);
} else {
  main().catch(console.error);
}