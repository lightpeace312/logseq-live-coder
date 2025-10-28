import '@logseq/libs'

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
          <iframe src="${window.location.origin}${window.location.pathname}?uuid=${uuid}" 
          style="min-width: 768px; min-height: 400px; border: none;margin:0 !important;resize:both;" 
          data-uuid="${uuid}"
          id="live-coder-iframe-${uuid}">
          </iframe>
          `,
    });

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
  
  // 监听来自iframe的消息
  window.addEventListener('message', async (event) => {
    const data = event.data;
    if (!data || !data.type) return;
    
    console.log('Received message from iframe:', data);
    
    switch (data.type) {
      case 'SAVE_CONTENT':
        // 保存内容到logseq
        if (typeof logseq !== 'undefined' && data.uuid && 'content' in data) {
          try {
            console.log('Saving content to Logseq block:', data.uuid, data.content);
            await logseq.Editor.upsertBlockProperty(data.uuid, 'liveCoderFragmentContent', data.content);
            console.log('Content saved successfully');
          } catch (error) {
            console.error('Failed to save content:', error);
          }
        }
        break;
        
      case 'SAVE_PREVIEW_POSITION':
        // 保存预览位置到logseq
        if (typeof logseq !== 'undefined' && data.uuid && data.position) {
          try {
            console.log('Saving preview position to Logseq block:', data.uuid, data.position);
            await logseq.Editor.upsertBlockProperty(data.uuid, 'liveCoderPreviewPosition', data.position);
            console.log('Preview position saved successfully');
          } catch (error) {
            console.error('Failed to save preview position:', error);
          }
        }
        break;
        
      case 'LOAD_CONTENT_AND_STATE':
        // 加载内容和状态并发送回iframe
        if (typeof logseq !== 'undefined' && data.uuid) {
          try {
            console.log('Loading content and state for block:', data.uuid);
            const block = await logseq.Editor.getBlock(data.uuid);
            console.log('Block data:', block);
            
            const content = {
              code: block && block.properties && block.properties.liveCoderFragmentContent 
                ? block.properties.liveCoderFragmentContent 
                : '',
              position: block && block.properties && block.properties.liveCoderPreviewPosition 
                ? block.properties.liveCoderPreviewPosition 
                : { x: 20, y: 20 }
            };
              
            console.log('Sending content and state back to iframe:', content);
              
            // 发送回iframe
            event.source.postMessage({
              type: 'CONTENT_AND_STATE_LOADED',
              content: content,
              uuid: data.uuid
            }, event.origin);
          } catch (error) {
            console.error('Failed to load content and state:', error);
          }
        }
        break;
    }
  });
}


/**
 * 主函数
 */
async function main() {
  if (isLogseqEnvironment()) {
    // 在Logseq环境中运行
    await initPlugin();
  }
}

// 根据环境选择启动方式
if (isLogseqEnvironment()) {
  logseq.ready(main).catch(console.error);
} else {
  main().catch(console.error);
}