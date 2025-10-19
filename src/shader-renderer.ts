import { defaultFragmentShader, defaultVertexShader } from './constants';

// WebGL 上下文
let gl: WebGLRenderingContext | null = null;
let program: WebGLProgram | null = null;

// 初始化 WebGL
export function initWebGL(canvas: HTMLCanvasElement) {
    // 检查canvas是否存在
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    } catch (e) {
        showShaderError(canvas, 'WebGL not supported');
        return;
    }

    if (!gl) {
        showShaderError(canvas, 'WebGL not supported');
        return;
    }

    // 设置 WebGL 视口
    gl.viewport(0, 0, canvas.width, canvas.height);
}

// 创建着色器
export function createShader(type: number, source: string) {
    if (!gl) throw new Error('WebGL not initialized');
    
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(log || 'Failed to compile shader');
    }

    return shader;
}

// 创建渲染程序
export function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    if (!gl) throw new Error('WebGL not initialized');
    
    const program = gl.createProgram();
    if (!program) throw new Error('Failed to create program');
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        const log = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(log || 'Failed to link program');
    }

    return program;
}

// 显示错误信息
export function showShaderError(canvas: HTMLCanvasElement, message: string) {
    // 检查canvas是否存在
    if (!canvas) {
        console.error('Canvas element not found:', message);
        return;
    }
    
    const container = canvas.closest('.live-shader-container');
    if (!container) {
        console.error('Container element not found');
        return;
    }
    
    const errorContainer = container.querySelector('.live-shader-error') as HTMLElement;
    const canvasContainer = container.querySelector('.live-shader-preview-wrapper .panel-content') as HTMLElement;
    
    if (errorContainer) {
        errorContainer.style.display = 'block';
        errorContainer.textContent = message;
    }
    
    if (canvasContainer) {
        canvasContainer.style.display = 'none';
    }
}

// 隐藏错误信息并显示画布
export function hideShaderError(canvas: HTMLCanvasElement) {
    // 检查canvas是否存在
    if (!canvas) {
        return;
    }
    
    const container = canvas.closest('.live-shader-container');
    if (!container) {
        return;
    }
    
    const errorContainer = container.querySelector('.live-shader-error') as HTMLElement;
    const canvasContainer = container.querySelector('.live-shader-preview-wrapper .panel-content') as HTMLElement;
    
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
    
    if (canvasContainer) {
        canvasContainer.style.display = 'flex';
    }
}

// 渲染场景
export function render(canvas: HTMLCanvasElement, shaders: { vertex: string, fragment: string }) {
    if (!gl) return;
    
    // 检查canvas是否存在
    if (!canvas) {
        return;
    }

    try {
        // 如果还没有着色器程序，则创建它
        if (!program) {
            const fragmentShader = createShader(gl.FRAGMENT_SHADER, shaders.fragment);
            const vertexShader = createShader(gl.VERTEX_SHADER, shaders.vertex);
            program = createProgram(vertexShader, fragmentShader);
            
            // 删除着色器对象（它们已链接到程序中）
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
        }
        
        // 使用程序
        gl.useProgram(program);
        
        // 设置顶点数据
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        
        const positions = [
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        
        // 启用属性
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        
        // 设置 uniform 变量
        const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        const timeUniformLocation = gl.getUniformLocation(program, "u_time");
        
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        gl.uniform1f(timeUniformLocation, performance.now() / 1000);
        
        // 绘制
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        // 成功渲染后隐藏错误
        hideShaderError(canvas);
    } catch (e) {
        showShaderError(canvas, (e as Error).message);
        if (program) {
            gl.deleteProgram(program);
            program = null;
        }
    }
}

// 编译并显示结果
export function compileAndDisplay(canvas: HTMLCanvasElement, shaders: { vertex: string, fragment: string }) {
    if (program) {
        gl?.deleteProgram(program);
        program = null;
    }
    render(canvas, shaders);
}

// 导出默认代码
export { defaultFragmentShader, defaultVertexShader };