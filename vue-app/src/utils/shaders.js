export const wipeVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const wipeFragmentShader = `
uniform sampler2D texA;
uniform sampler2D texB;
uniform float progress;
varying vec2 vUv;

void main() {
  vec2 uvA = vUv;
  uvA.y -= progress;
  vec4 colorA = texture2D(texA, uvA);

  vec2 uvB = vUv;
  uvB.y += (1.0 - progress);
  vec4 colorB = texture2D(texB, uvB);

  float mask = step(vUv.y, progress);
  gl_FragColor = mix(colorA, colorB, mask);
}
`;
