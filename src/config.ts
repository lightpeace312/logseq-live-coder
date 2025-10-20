
export type CodeType = 'shader' | 'html'
export type CodeFragment = {
    language: string,
    name:string,
    example: string
}
export type CoderConfig = {
    name:string,
    type:CodeType,
    fragments:CodeFragment[]
}

export const coderConfigList = [
    {
        name: 'Shader',
        type:'shader',
        fragments: [
            {
                name: 'fragment',
                language:'glsl',
                example: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float r = sin(uv.x * 3.14159 * 2.0 + u_time) * 0.5 + 0.5;
    float g = sin(uv.y * 3.14159 * 4.0 + u_time) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 3.14159 + u_time) * 0.5 + 0.5;
    gl_FragColor = vec4(r, g, b, 1.0);
}`
            }
            ,
            {
                name: "vertex",
                language: "glsl",
                example: `attribute vec2 a_position;
varying vec2 v_uv;

void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`
            }
        ]
    },
    {
        name: 'HTML',
        type:'html',
        fragments: [
            {
                name: 'html',
                language: 'html',
                 example: `<h1>Hello, World!</h1>
                <p>This is a live HTML preview.</p>`},
            {
                name: 'css', 
                language: 'css', 
                example: `body {
background:white;
font-family: Arial, sans-serif;
margin: 20px;
}`},
            {
                name: 'javascript',
                language: 'javascript',
                example: `console.log('Hello from live JavaScript!');
document.addEventListener('DOMContentLoaded', () => {
console.log('DOM is ready');
});`
            }
        ]
    }
] as const satisfies CoderConfig[]

type FindConfig<T extends CodeType> = Extract<typeof coderConfigList[number], { type: T }>;

export type CodeData<T extends CodeType> = {
    [K in FindConfig<T>['fragments'][number]['name']]: string;
};


