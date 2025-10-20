import * as monaco from 'monaco-editor';

import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';

// 配置Monaco Environment以支持Web Workers
if (typeof window !== 'undefined') {
  self.MonacoEnvironment = {
    getWorker: function (workerId, label) {
      debugger
      // 根据语言标签返回相应的worker
      switch (label) {
        case 'typescript':
        case 'javascript':
          return new tsWorker();
        case 'css':
          return new cssWorker();
        case 'html':
          return new htmlWorker();
        case 'json':
          return new jsonWorker();
        default:
          return new editorWorker();
      }
    }
  };
}

// import { defaultFragmentShader, defaultVertexShader } from './constants';

// 注册GLSL语言
monaco.languages.register({ id: 'glsl' });

// GLSL语言的语法定义
monaco.languages.setMonarchTokensProvider('glsl', {
  keywords: [
    'attribute', 'const', 'uniform', 'varying', 'layout',
    'centroid', 'flat', 'smooth', 'noperspective',
    'break', 'continue', 'do', 'for', 'while',
    'switch', 'case', 'default',
    'if', 'else',
    'in', 'out', 'inout',
    'float', 'int', 'void', 'bool', 'true', 'false',
    'invariant', 'discard', 'return',
    'mat2', 'mat3', 'mat4',
    'vec2', 'vec3', 'vec4', 'ivec2', 'ivec3', 'ivec4', 'bvec2', 'bvec3', 'bvec4',
    'uint', 'uvec2', 'uvec3', 'uvec4',
    'lowp', 'mediump', 'highp', 'precision',
    'sampler1D', 'sampler2D', 'sampler3D', 'samplerCube',
    'sampler1DShadow', 'sampler2DShadow', 'samplerCubeShadow',
    'sampler1DArray', 'sampler2DArray',
    'sampler1DArrayShadow', 'sampler2DArrayShadow',
    'isampler1D', 'isampler2D', 'isampler3D', 'isamplerCube',
    'isampler1DArray', 'isampler2DArray',
    'usampler1D', 'usampler2D', 'usampler3D', 'usamplerCube',
    'usampler1DArray', 'usampler2DArray',
    'sampler2DRect', 'sampler2DRectShadow', 'isampler2DRect', 'usampler2DRect',
    'samplerBuffer', 'isamplerBuffer', 'usamplerBuffer',
    'sampler2DMS', 'isampler2DMS', 'usampler2DMS',
    'sampler2DMSArray', 'isampler2DMSArray', 'usampler2DMSArray',
    'struct'
  ],
  operators: [
    '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
    '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
    '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
    '%=', '<<=', '>>=', '>>>='
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  integersuffix: /(ll|LL|u|U|l|L)?(ll|LL|u|U|l|L)?/,
  floatsuffix: /[fFlL]?/,
  encoding: /u|u8|U|L/,

  tokenizer: {
    root: [
      [/[a-zA-Z_]\w*/, {
        cases: {
          '@keywords': 'keyword',
          '@default': 'identifier'
        }
      }],
      { include: '@whitespace' },
      [/[{}()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': ''
        }
      }],
      [/\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, 'number.float'],
      [/\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, 'number.float'],
      [/0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, 'number.hex'],
      [/0[0-7']*[0-7](@integersuffix)/, 'number.octal'],
      [/0[bB][0-1']*[0-1](@integersuffix)/, 'number.binary'],
      [/\d[\d']*\d(@integersuffix)/, 'number'],
      [/\d(@integersuffix)/, 'number'],
      [/[;,.]/, 'delimiter'],
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string'],
      [/'[^\\']'/, 'string'],
      [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
      [/'/, 'string.invalid']
    ],
    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],
    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],
    jsdoc: [
      [/[^\/*]+/, 'comment.doc'],
      [/\*\//, 'comment.doc', '@pop'],
      [/[\/*]/, 'comment.doc']
    ],
    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ],
  },
});

// 定义GLSL语言的补全建议
monaco.languages.registerCompletionItemProvider('glsl', {
  provideCompletionItems: () => {
    const suggestions = [
      // 常用函数
      {
        label: 'sin',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'sin(${1:x})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the sine of x'
      },
      {
        label: 'cos',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'cos(${1:x})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the cosine of x'
      },
      {
        label: 'tan',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'tan(${1:x})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the tangent of x'
      },
      {
        label: 'mix',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'mix(${1:x}, ${2:y}, ${3:a})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Linearly interpolate between x and y using a to weight between them'
      },
      {
        label: 'clamp',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'clamp(${1:x}, ${2:minVal}, ${3:maxVal})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns x clamped to the range [minVal, maxVal]'
      },
      {
        label: 'length',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'length(${1:x})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the length of vector x'
      },
      {
        label: 'distance',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'distance(${1:p0}, ${2:p1})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the distance between p0 and p1'
      },
      {
        label: 'dot',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'dot(${1:x}, ${2:y})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the dot product of x and y'
      },
      {
        label: 'cross',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'cross(${1:x}, ${2:y})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns the cross product of x and y'
      },
      {
        label: 'normalize',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'normalize(${1:x})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Returns a vector in the same direction as x but with a length of 1'
      },
      {
        label: 'texture2D',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: 'texture2D(${1:sampler}, ${2:coord})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Use the texture coordinate coord to do a lookup in the 2D texture currently bound to sampler'
      },
      {
        label: 'gl_Position',
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: 'gl_Position',
        documentation: 'Output position of the current vertex'
      },
      {
        label: 'gl_FragColor',
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: 'gl_FragColor',
        documentation: 'Output color of the current fragment'
      },
      {
        label: 'gl_FragCoord',
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: 'gl_FragCoord',
        documentation: 'Fragment position within the frame buffer'
      },
      {
        label: 'gl_PointCoord',
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: 'gl_PointCoord',
        documentation: 'Fragment position within the point'
      }
    ];

    return { suggestions: suggestions as any };
  }
});

// 配置默认主题
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

// 初始化Monaco编辑器
export function initMonaco() {
  // 设置默认主题
  monaco.editor.setTheme('logseq-dark');
  
  return monaco;
}

export default monaco;