import { Injectable } from '../ioc/injector';
import { OnRender, OnRun } from '../util/lifecycle';
import { CanvasProvider } from './canvas.provider';

import triangleVertWGSL from '../shaders/triangle.vert.wgsl';
import redFragWGSL from '../shaders/red.frag.wgsl';

@Injectable()
export class RenderProvider implements OnRun, OnRender {
    private adapter: GPUAdapter;
    private device: GPUDevice;
    private readonly swapChainFormat = 'bgra8unorm';

    private pipeline: GPURenderPipeline;
    private texture: GPUTexture;
    private view: GPUTextureView;

    private inited: boolean = false;

    constructor(private canvasProvider: CanvasProvider) {
        // Put this check in a requirements provider or something
        if (!navigator.gpu) {
            throw 'No WebGPU support!';
        }
    }

    public async onRun() {
        this.adapter = await navigator.gpu.requestAdapter();
        this.device = await this.adapter.requestDevice();
        this.canvasProvider.Context.configure({ device: this.device, format: this.swapChainFormat });

        this.pipeline = this.device.createRenderPipeline({
            vertex: {
                module: this.device.createShaderModule({
                    code: triangleVertWGSL,
                }),
                entryPoint: 'main',
            },
            fragment: {
                module: this.device.createShaderModule({
                    code: redFragWGSL,
                }),
                entryPoint: 'main',
                targets: [{ format: this.swapChainFormat }],
            },
            primitive: { topology: 'triangle-list' },
            multisample: { count: 4 },
        });

        this.texture = this.device.createTexture({
            size: {
                width: this.canvasProvider.Canvas.width,
                height: this.canvasProvider.Canvas.height,
            },
            sampleCount: 4,
            format: this.swapChainFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });

        this.view = this.texture.createView();
        this.inited = true;
    }

    public onRender(): void {
        if (!this.inited) {
            return;
        }
        const commandEncoder = this.device.createCommandEncoder();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.view,
                    resolveTarget: this.canvasProvider.Context.getCurrentTexture().createView(),
                    loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    storeOp: 'store',
                },
            ],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.endPass();

        this.device.queue.submit([commandEncoder.finish()]);
    }
}
