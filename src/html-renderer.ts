
// 更新HTML预览
export function updateHTMLPreview(editors: any, container: HTMLElement) {
    const iframe = container.querySelector('.live-html-preview') as HTMLIFrameElement;
    if (!iframe) return;
    
    const htmlCode = editors.html ? editors.html.getValue() : '';
    const cssCode = editors.css ? editors.css.getValue() : '';
    const jsCode = editors.js ? editors.js.getValue() : '';
    
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>${cssCode}</style>
</head>
<body>
  ${htmlCode}
  <script>${jsCode}<\/script>
</body>
</html>
    `;
    
    // 在iframe模式下，我们需要确保iframe内容正确更新
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(fullHTML);
            iframeDoc.close();
        }
    } catch (e) {
        // 如果由于跨域问题无法直接写入iframe，使用srcdoc属性
        console.warn('无法直接写入iframe内容，尝试使用srcdoc属性', e);
        iframe.srcdoc = fullHTML;
    }
}