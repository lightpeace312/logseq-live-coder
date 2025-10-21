
export type CodeType = 'shader'
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
        ]
    }
] as const satisfies CoderConfig[]

type FindConfig<T extends CodeType> = Extract<typeof coderConfigList[number], { type: T }>;

export type CodeData<T extends CodeType> = {
    [K in FindConfig<T>['fragments'][number]['name']]: string;
};


