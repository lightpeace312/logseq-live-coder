import { defaultHTML, defaultCSS, defaultJS } from './constants';

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
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(fullHTML);
        iframeDoc.close();
    }
}

