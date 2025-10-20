import '@logseq/libs'
import { defaultFragmentShader } from './src/constants';
import { getTemplate,getStyle } from './src/template';
import {initShaderEditor} from './main'
/**
 * 检查是否在Logseq环境中运行
 * @returns {boolean}
 */
function isLogseqEnvironment() {
  return import.meta.env.PROD
  
}

/**
 * 检查是否在浏览器环境中运行
 * @returns {boolean}
 */
function isBrowserEnvironment() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * 初始化插件功能
 */
async function initPlugin() {
  console.log('Live Coder loaded');

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
    logseq.provideStyle({key:'logseq-live-coder-style',style:getStyle()});
    
    // 确保样式正确应用
    const style = document.createElement('style');
    style.id = 'live-coder-styles';
    style.textContent = getStyle();
    document.head.appendChild(style);
    
    logseq.provideUI({
      key: `live-coder-block-${uuid}`,
      slot,
      reset: true,
      template: getTemplate(uuid, defaultFragmentShader),
    });

    // 等待 UI 更新后再初始化
    setTimeout(() => {
      try {
        const container = parent.document.querySelector(`[data-uuid="${uuid}"]`) ;
        if (container) {
          initShaderEditor(container);
        }
      } catch (e) {
        console.error('Failed to initialize editor:', e);
      }
    }, 100);
  });
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
  } else  {
    // 在浏览器环境中运行（开发预览）
    initStandaloneMode();
  } 
}

// 根据环境选择启动方式
if (isLogseqEnvironment()) {
  logseq.ready(main).catch(console.error);
} else {
  // 浏览器环境
  main().catch(console.error);
  document.addEventListener('DOMContentLoaded', ()=>{
    console.log('dom style')
    // 创建一个style标签插入 getStyle()的样式
    document.head.insertAdjacentHTML('beforeend', `<style>${getStyle()}</style>`);
  });
}