// GLSL语言定义
export const glslLanguageDef = {
  // GLSL关键字
  keywords: [
    'const', 'uniform', 'buffer', 'shared', 'attribute', 'varying',
    'coherent', 'volatile', 'restrict', 'readonly', 'writeonly',
    'layout', 'centroid', 'flat', 'smooth', 'noperspective', 'patch', 'sample',
    'break', 'continue', 'do', 'for', 'while', 'switch', 'case', 'default',
    'if', 'else', 'subroutine', 'in', 'out', 'inout',
    'float', 'double', 'int', 'void', 'bool', 'true', 'false',
    'invariant', 'precise', 'discard', 'return',
    'mat2', 'mat3', 'mat4', 'dmat2', 'dmat3', 'dmat4',
    'mat2x2', 'mat2x3', 'mat2x4', 'dmat2x2', 'dmat2x3', 'dmat2x4',
    'mat3x2', 'mat3x3', 'mat3x4', 'dmat3x2', 'dmat3x3', 'dmat3x4',
    'mat4x2', 'mat4x3', 'mat4x4', 'dmat4x2', 'dmat4x3', 'dmat4x4',
    'vec2', 'vec3', 'vec4', 'ivec2', 'ivec3', 'ivec4', 'bvec2', 'bvec3', 'bvec4', 'dvec2', 'dvec3', 'dvec4',
    'uint', 'uvec2', 'uvec3', 'uvec4',
    'lowp', 'mediump', 'highp', 'precision',
    'sampler1D', 'sampler2D', 'sampler3D', 'samplerCube', 'sampler1DShadow', 'sampler2DShadow', 'samplerCubeShadow',
    'sampler1DArray', 'sampler2DArray', 'sampler1DArrayShadow', 'sampler2DArrayShadow',
    'isampler1D', 'isampler2D', 'isampler3D', 'isamplerCube', 'isampler1DArray', 'isampler2DArray',
    'usampler1D', 'usampler2D', 'usampler3D', 'usamplerCube', 'usampler1DArray', 'usampler2DArray',
    'sampler2DRect', 'sampler2DRectShadow', 'isampler2DRect', 'usampler2DRect',
    'samplerBuffer', 'isamplerBuffer', 'usamplerBuffer',
    'sampler2DMS', 'isampler2DMS', 'usampler2DMS',
    'sampler2DMSArray', 'isampler2DMSArray', 'usampler2DMSArray',
    'samplerCubeArray', 'samplerCubeArrayShadow', 'isamplerCubeArray', 'usamplerCubeArray',
    'struct', 'typedef', 'namespace', 'using',
    'template', 'this', 'packed'
  ],
  
  // GLSL内置函数
  functions: [
    // 角度和三角函数
    'radians', 'degrees', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
    
    // 指数函数
    'pow', 'exp', 'log', 'exp2', 'log2', 'sqrt', 'inversesqrt',
    
    // 通用函数
    'abs', 'sign', 'floor', 'trunc', 'round', 'roundEven', 'ceil', 'fract', 'mod', 'modf', 'min', 'max', 'clamp', 'mix', 'step', 'smoothstep',
    'isnan', 'isinf', 'floatBitsToInt', 'floatBitsToUint', 'intBitsToFloat', 'uintBitsToFloat', 'fma', 'frexp', 'ldexp',
    
    // 浮点数压缩函数
    'packUnorm2x16', 'packUnorm4x8', 'packSnorm4x8', 'unpackUnorm2x16', 'unpackUnorm4x8', 'unpackSnorm4x8',
    'packDouble2x32', 'unpackDouble2x32', 'packHalf2x16', 'unpackHalf2x16',
    
    // 几何函数
    'length', 'distance', 'dot', 'cross', 'normalize', 'ftransform', 'faceforward', 'reflect', 'refract',
    
    // 矩阵函数
    'matrixCompMult', 'outerProduct', 'transpose', 'determinant', 'inverse',
    
    // 向量关系函数
    'lessThan', 'lessThanEqual', 'greaterThan', 'greaterThanEqual', 'equal', 'notEqual', 'any', 'all', 'not',
    
    // 纹理查询函数
    'textureSize', 'texture', 'textureProj', 'textureLod', 'textureOffset', 'texelFetch', 'texelFetchOffset',
    'textureProjOffset', 'textureLodOffset', 'textureProjLod', 'textureProjLodOffset', 'textureGrad', 'textureGradOffset',
    'textureProjGrad', 'textureProjGradOffset',
    
    // 纹理查询函数 (旧版)
    'texture1D', 'texture1DProj', 'texture1DLod', 'texture1DProjLod',
    'texture2D', 'texture2DProj', 'texture2DLod', 'texture2DProjLod',
    'texture3D', 'texture3DProj', 'texture3DLod', 'texture3DProjLod',
    'textureCube', 'textureCubeLod', 'shadow1D', 'shadow2D', 'shadow1DProj', 'shadow2DProj',
    'shadow1DLod', 'shadow2DLod', 'shadow1DProjLod', 'shadow2DProjLod',
    
    // 原子计数器函数
    'atomicCounterIncrement', 'atomicCounterDecrement', 'atomicCounter',
    'atomicAdd', 'atomicMin', 'atomicMax', 'atomicAnd', 'atomicOr', 'atomicXor', 'atomicExchange', 'atomicCompSwap',
    
    // 图像函数
    'imageSize', 'imageLoad', 'imageStore', 'imageAtomicAdd', 'imageAtomicMin', 'imageAtomicMax', 'imageAtomicAnd',
    'imageAtomicOr', 'imageAtomicXor', 'imageAtomicExchange', 'imageAtomicCompSwap',
    
    // 片段处理函数
    'dFdx', 'dFdy', 'dFdxFine', 'dFdyFine', 'dFdxCoarse', 'dFdyCoarse', 'fwidth', 'fwidthFine', 'fwidthCoarse',
    
    // 内插函数
    'interpolateAtCentroid', 'interpolateAtSample', 'interpolateAtOffset',
    
    // 噪声函数
    'noise1', 'noise2', 'noise3', 'noise4',
    
    // 几何着色器函数
    'EmitStreamVertex', 'EndStreamPrimitive', 'EmitVertex', 'EndPrimitive',
    
    // 控制屏障函数
    'barrier', 'memoryBarrier', 'memoryBarrierAtomicCounter', 'memoryBarrierBuffer', 'memoryBarrierShared',
    'memoryBarrierImage', 'groupMemoryBarrier'
  ],
  
  // GLSL内置变量
  variables: [
    'gl_VertexID', 'gl_InstanceID', 'gl_Position', 'gl_PointSize', 'gl_ClipDistance',
    'gl_PrimitiveIDIn', 'gl_InvocationID', 'gl_PrimitiveID', 'gl_Layer', 'gl_ViewportIndex',
    'gl_MaxVertexAttribs', 'gl_MaxVertexUniformComponents', 'gl_MaxVaryingFloats', 'gl_MaxVaryingComponents',
    'gl_MaxVertexOutputComponents', 'gl_MaxGeometryInputComponents', 'gl_MaxGeometryOutputComponents',
    'gl_MaxFragmentInputComponents', 'gl_MaxVertexTextureImageUnits', 'gl_MaxCombinedTextureImageUnits',
    'gl_MaxTextureImageUnits', 'gl_MaxFragmentUniformComponents', 'gl_MaxDrawBuffers', 'gl_MaxClipDistances',
    'gl_MaxGeometryTextureImageUnits', 'gl_MaxGeometryOutputVertices', 'gl_MaxGeometryTotalOutputComponents',
    'gl_MaxGeometryUniformComponents', 'gl_MaxGeometryVaryingComponents', 'gl_MaxTessControlInputComponents',
    'gl_MaxTessControlOutputComponents', 'gl_MaxTessControlTextureImageUnits', 'gl_MaxTessControlUniformComponents',
    'gl_MaxTessControlTotalOutputComponents', 'gl_MaxTessEvaluationInputComponents', 'gl_MaxTessEvaluationOutputComponents',
    'gl_MaxTessEvaluationTextureImageUnits', 'gl_MaxTessEvaluationUniformComponents', 'gl_MaxTessPatchComponents',
    'gl_MaxTessGenLevel', 'gl_MaxPatchVertices', 'gl_MaxComputeWorkGroupCount', 'gl_MaxComputeWorkGroupSize',
    'gl_MaxComputeUniformComponents', 'gl_MaxComputeTextureImageUnits', 'gl_MaxComputeImageUniforms',
    'gl_MaxComputeAtomicCounters', 'gl_MaxComputeAtomicCounterBuffers', 'gl_MaxImageUnits', 'gl_MaxCombinedImageUnitsAndFragmentOutputs',
    'gl_MaxImageSamples', 'gl_MaxVertexImageUniforms', 'gl_MaxTessControlImageUniforms', 'gl_MaxTessEvaluationImageUniforms',
    'gl_MaxGeometryImageUniforms', 'gl_MaxFragmentImageUniforms', 'gl_MaxCombinedImageUniforms', 'gl_MaxCombinedShaderOutputResources',
    'gl_MaxTextureBufferSize', 'gl_MaxUniformBufferBindings', 'gl_MaxUniformBlockSize', 'gl_UniformBufferOffsetAlignment',
    'gl_MaxCombinedUniformBlocks', 'gl_MaxVaryingComponents', 'gl_MaxVertexUniformBlocks', 'gl_MaxTessControlUniformBlocks',
    'gl_MaxTessEvaluationUniformBlocks', 'gl_MaxGeometryUniformBlocks', 'gl_MaxFragmentUniformBlocks', 'gl_MaxAtomicCounterBindings',
    'gl_MaxAtomicCounterBufferSize', 'gl_MinProgramTexelOffset', 'gl_MaxProgramTexelOffset', 'gl_MaxTransformFeedbackBuffers',
    'gl_MaxTransformFeedbackInterleavedComponents', 'gl_PointCoord', 'gl_FrontFacing', 'gl_FragCoord', 'gl_FragDepth',
    'gl_FragColor', 'gl_FragData', 'gl_SampleID', 'gl_SamplePosition', 'gl_SampleMaskIn', 'gl_SampleMask',
    'gl_ClipVertex', 'gl_FrontColor', 'gl_BackColor', 'gl_FrontSecondaryColor', 'gl_BackSecondaryColor',
    'gl_TexCoord', 'gl_FogFragCoord', 'gl_Color', 'gl_SecondaryColor', 'gl_Normal', 'gl_Vertex', 'gl_MultiTexCoord0',
    'gl_MultiTexCoord1', 'gl_MultiTexCoord2', 'gl_MultiTexCoord3', 'gl_MultiTexCoord4', 'gl_MultiTexCoord5',
    'gl_MultiTexCoord6', 'gl_MultiTexCoord7', 'gl_FogCoord', 'gl_MaxTextureCoords', 'gl_MaxTextureUnits',
    'gl_DepthRange', 'gl_ModelViewMatrix', 'gl_ProjectionMatrix', 'gl_ModelViewProjectionMatrix', 'gl_TextureMatrix',
    'gl_NormalMatrix', 'gl_ModelViewMatrixInverse', 'gl_ProjectionMatrixInverse', 'gl_ModelViewProjectionMatrixInverse',
    'gl_TextureMatrixInverse', 'gl_ModelViewMatrixTranspose', 'gl_ProjectionMatrixTranspose', 'gl_ModelViewProjectionMatrixTranspose',
    'gl_TextureMatrixTranspose', 'gl_ModelViewMatrixInverseTranspose', 'gl_ProjectionMatrixInverseTranspose',
    'gl_ModelViewProjectionMatrixInverseTranspose', 'gl_TextureMatrixInverseTranspose', 'gl_NormalScale', 'gl_ClipPlane',
    'gl_Point', 'gl_FrontMaterial', 'gl_BackMaterial', 'gl_LightSource', 'gl_LightModel', 'gl_FrontLightModelProduct',
    'gl_BackLightModelProduct', 'gl_FrontLightProduct', 'gl_BackLightProduct', 'gl_TextureEnvColor', 'gl_EyePlaneS',
    'gl_EyePlaneT', 'gl_EyePlaneR', 'gl_EyePlaneQ', 'gl_ObjectPlaneS', 'gl_ObjectPlaneT', 'gl_ObjectPlaneR', 'gl_ObjectPlaneQ',
    'gl_Fog', 'gl_Texture', 'gl_Texture1', 'gl_Texture2', 'gl_Texture3', 'gl_Texture4', 'gl_Texture5', 'gl_Texture6',
    'gl_Texture7', 'gl_Texture8', 'gl_Texture9', 'gl_Texture10', 'gl_Texture11', 'gl_Texture12', 'gl_Texture13',
    'gl_Texture14', 'gl_Texture15', 'gl_Texture16', 'gl_Texture17', 'gl_Texture18', 'gl_Texture19', 'gl_Texture20',
    'gl_Texture21', 'gl_Texture22', 'gl_Texture23', 'gl_Texture24', 'gl_Texture25', 'gl_Texture26', 'gl_Texture27',
    'gl_Texture28', 'gl_Texture29', 'gl_Texture30', 'gl_Texture31'
  ],
  
  operators: [
    '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
    '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
    '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
    '%=', '<<=', '>>=', '>>>='
  ]
};

// GLSL语言的Monarch tokenizer定义
export const glslTokenizer = {
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  integersuffix: /(ll|LL|u|U|l|L)?(ll|LL|u|U|l|L)?/,
  floatsuffix: /[fFlL]?/,
  encoding: /u|u8|U|L/,

  tokenizer: {
    root: [
      // 标识符和关键字
      [/[a-zA-Z_]\w*/, {
        cases: {
          '@keywords': 'keyword',
          '@functions': 'function',
          '@variables': 'variable',
          '@default': 'identifier'
        }
      }],
      
      // 空白符
      { include: '@whitespace' },
      
      // 括号
      [/[{}()\[\]]/, '@brackets'],
      
      // 比较操作符
      [/[<>](?!@symbols)/, '@brackets'],
      
      // 操作符
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': ''
        }
      }],
      
      // 数字
      [/\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, 'number.float'],
      [/\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, 'number.float'],
      [/0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, 'number.hex'],
      [/0[0-7']*[0-7](@integersuffix)/, 'number.octal'],
      [/0[bB][0-1']*[0-1](@integersuffix)/, 'number.binary'],
      [/\d[\d']*\d(@integersuffix)/, 'number'],
      [/\d(@integersuffix)/, 'number'],
      
      // 分隔符
      [/[;,.]/, 'delimiter'],
      
      // 字符串
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string'],
      [/'[^\\']'/, 'string'],
      [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
      [/'/, 'string.invalid']
    ],

    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*\*(?!\/)/, 'comment.doc', '@doccomment'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],

    doccomment: [
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
  }
};

// GLSL语言主题定义
export const glslTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '569cd6' },        // 关键字 - 蓝色
    { token: 'function', foreground: 'dcdcaa' },       // 函数 - 黄色
    { token: 'variable', foreground: '9cdcfe' },       // 变量 - 蓝绿色
    { token: 'identifier', foreground: '9cdcfe' },     // 标识符 - 蓝绿色
    { token: 'operator', foreground: 'd4d4d4' },       // 操作符 - 灰色
    { token: 'number', foreground: 'b5cea8' },         // 数字 - 绿色
    { token: 'string', foreground: 'ce9178' },         // 字符串 - 橙色
    { token: 'comment', foreground: '6a9955' },        // 注释 - 绿色
    { token: 'delimiter', foreground: 'd4d4d4' },      // 分隔符 - 灰色
  ],
  colors: {}
};