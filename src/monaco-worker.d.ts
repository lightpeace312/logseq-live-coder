declare module 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
declare module 'monaco-editor/esm/vs/editor/editor.worker?worker';
declare module 'monaco-editor/esm/vs/language/json/json.worker?worker';
declare module 'monaco-editor/esm/vs/language/css/css.worker?worker';
declare module 'monaco-editor/esm/vs/language/html/html.worker?worker';


// 添加对 CSS raw 导入的支持
declare module '*.css?raw' {
  const content: string;
  export default content;
}
