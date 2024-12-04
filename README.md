# Shaders exercise - Animated Galaxy

```
pnpm add lil-gui three
```

```
pnpm add -D @types/three vite vite-plugin-glslify
```

# We already did similar project

**But were using particles in this project**

<https://github.com/Rade58/galaxy-generator-threejs>

# About `gl_PointSize` of vertex shader

In real life, for example stars have different sizes

To have a different `gl_PointSize` for each vertex, we can send a random value in the attributes

**Mentioned isn't possible with `PointsMaterial`**
