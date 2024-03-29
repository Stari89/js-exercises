import $ from 'jquery';
import { CheckWebGPU } from './helper';
import { Shaders } from './shaders';

const CreateTriangle = async () => {
    const checkgpu = CheckWebGPU();
    if (checkgpu.includes('Your current browser does not support WebGPU!')) {
        console.log(checkgpu);
        throw 'Your current browser does not support WebGPU!';
    }

    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    const adapter = (await navigator.gpu?.requestAdapter()) as GPUAdapter;
    const device = (await adapter?.requestDevice()) as GPUDevice;
    const context = canvas.getContext('gpupresent') as unknown as GPUCanvasContext;
    const swapChainFormat = 'bgra8unorm';
    const swapChain = context.configureSwapChain({
        device: device,
        format: swapChainFormat,
    });

    const shader = Shaders();
    const pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code: shader.vertex,
            }),
            entryPoint: 'main',
        },
        fragment: {
            module: device.createShaderModule({
                code: shader.fragment,
            }),
            entryPoint: 'main',
            targets: [
                {
                    format: swapChainFormat as GPUTextureFormat,
                },
            ],
        },
        primitiveTopology: 'triangle-list',
    });

    const commandEncoder = device.createCommandEncoder();
    const textureView = swapChain.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [
            {
                view: textureView,
                loadValue: { r: 0.5, g: 0.5, b: 0.8, a: 1.0 }, //background color
                storeOp: 'store',
            },
        ],
    });
    renderPass.setPipeline(pipeline);
    renderPass.draw(3, 1, 0, 0);
    renderPass.endPass();

    device.queue.submit([commandEncoder.finish()]);
};

CreateTriangle();
