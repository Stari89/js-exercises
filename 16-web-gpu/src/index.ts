import triangleVertWGSL from './shaders/triangle.vert.wgsl';
import redFragWGSL from './shaders/red.frag.wgsl';

const CreateTriangle = async () => {
    if (!navigator.gpu) {
        throw 'No WebGPU support!';
    }
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    const root = document.body;
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    canvas.style.width = '1280px';
    canvas.style.height = '720px';
    canvas.style.backgroundColor = '#6495ed';
    root.appendChild(canvas);

    const context: GPUPresentationContext = canvas.getContext('gpupresent');

    const swapChainFormat = 'bgra8unorm';
    context.configure({ device, format: swapChainFormat });

    const pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code: triangleVertWGSL,
            }),
            entryPoint: 'main',
        },
        fragment: {
            module: device.createShaderModule({
                code: redFragWGSL,
            }),
            entryPoint: 'main',
            targets: [{ format: swapChainFormat }],
        },
        primitive: { topology: 'triangle-list' },
        multisample: { count: 4 },
    });

    const texture = device.createTexture({
        size: {
            width: canvas.width,
            height: canvas.height,
        },
        sampleCount: 4,
        format: swapChainFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const view = texture.createView();

    const frame = () => {
        if (!canvas) return;

        const commandEncoder = device.createCommandEncoder();
        // const textureView = context.getCurrentTexture().createView();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view,
                    resolveTarget: context.getCurrentTexture().createView(),
                    loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    storeOp: 'store',
                },
            ],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.endPass();

        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
};

CreateTriangle();
