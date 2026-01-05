# VERTEX | 3D Asset Optimization Guide 🦾

To achieve the "Ultra-Squeeze" (70%+ file size reduction), follow these steps to process your 3D models.

## 1. Prerequisites
Install the `gltf-transform` CLI globally:
```bash
npm install -g @gltf-transform/cli
```

## 2. The "Ultra-Squeeze" Commands
Run these commands in your terminal from the `public/models` directory.

### Geometry Compression (Meshopt)
This reduces the file size while keeping the decompression speed nearly instant.
```bash
gltf-transform meshopt input.glb output.glb
```

### Texture Compression (KTX2/Basis)
This is the most powerful optimization. It allows textures to stay compressed even in GPU memory.
```bash
gltf-transform etc1s input.glb output.glb
```

### Full Optimization Pack (Recommended)
This runs a suite of optimizations including deduplication, pruning unused data, and Meshopt compression.
```bash
gltf-transform optimize input.glb output_optimized.glb --compress meshopt
```

## 3. Comparison Table

| Technique | Download Size | GPU Memory | Decompression Speed |
|-----------|---------------|------------|---------------------|
| **Plain GLB** | 100% | 100% | Ultra Fast |
| **Draco** | 10-20% | 100% | Moderate |
| **Meshopt** | 15-25% | 100% | Very Fast |
| **KTX2 (etc1s)** | 20-30% | **10-15%** | Moderate |

> [!TIP]
> Use **Meshopt** for the fastest possible startup time. Use **KTX2** if you have many large high-resolution textures and are worried about mobile crashes.
