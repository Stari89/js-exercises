import { Injectable } from '../ioc/injector';
import { OnRender, OnRun } from '../util/lifecycle';
import { CanvasProvider } from './canvas.provider';

import basicVertWGSL from '../shaders/basic.vert.wgsl';
import vertexPositionColorWGSL from '../shaders/vertexPositionColor.frag.wgsl';

import { cubePositionOffset, cubeUVOffset, cubeVertexArray, cubeVertexCount, cubeVertexSize } from '../meshes/cube';
import { mat4, vec3 } from 'gl-matrix';

@Injectable()
export class RenderProvider implements OnRun, OnRender {
    private adapter: GPUAdapter;
    private device: GPUDevice;
    private readonly swapChainFormat = 'bgra8unorm';

    private verticesBuffer: GPUBuffer;
    private pipeline: GPURenderPipeline;

    private uniformBuffer: GPUBuffer;
    private uniformBindGroup: GPUBindGroup;
    private renderPassDescriptor: GPURenderPassDescriptor;

    private projectionMatrix: mat4;

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

        this.verticesBuffer = this.device.createBuffer({
            size: cubeVertexArray.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });

        new Float32Array(this.verticesBuffer.getMappedRange()).set(cubeVertexArray);
        this.verticesBuffer.unmap();

        this.pipeline = this.device.createRenderPipeline({
            vertex: {
                module: this.device.createShaderModule({
                    code: basicVertWGSL,
                }),
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: cubeVertexSize,
                        attributes: [
                            {
                                // position
                                shaderLocation: 0,
                                offset: cubePositionOffset,
                                format: 'float32x4',
                            },
                            {
                                // uv
                                shaderLocation: 1,
                                offset: cubeUVOffset,
                                format: 'float32x2',
                            },
                        ],
                    },
                ],
            },
            fragment: {
                module: this.device.createShaderModule({
                    code: vertexPositionColorWGSL,
                }),
                entryPoint: 'main',
                targets: [
                    {
                        format: this.swapChainFormat,
                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',

                // Backface culling since the cube is solid piece of geometry.
                // Faces pointing away from the camera will be occluded by faces
                // pointing toward the camera.
                cullMode: 'back',
            },

            // Enable depth testing so that the fragment closest to the camera
            // is rendered in front.
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus',
            },
        });

        const depthTexture = this.device.createTexture({
            size: { width: this.canvasProvider.Canvas.width, height: this.canvasProvider.Canvas.width },
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });

        const uniformBufferSize = 4 * 16; // 4x4 matrix
        this.uniformBuffer = this.device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.uniformBindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.uniformBuffer,
                    },
                },
            ],
        });

        this.renderPassDescriptor = {
            colorAttachments: [
                {
                    view: undefined, // Assigned later

                    loadValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: depthTexture.createView(),

                depthLoadValue: 1.0,
                depthStoreOp: 'store',
                stencilLoadValue: 0,
                stencilStoreOp: 'store',
            },
        };

        const aspect = Math.abs(this.canvasProvider.Canvas.width / this.canvasProvider.Canvas.height);
        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);

        this.inited = true;
    }

    private getTransformationMatrix() {
        const viewMatrix = mat4.create();
        mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, -4));
        const now = Date.now() / 1000;
        mat4.rotate(viewMatrix, viewMatrix, 1, vec3.fromValues(Math.sin(now), Math.cos(now), 0));

        const modelViewProjectionMatrix = mat4.create();
        mat4.multiply(modelViewProjectionMatrix, this.projectionMatrix, viewMatrix);

        return modelViewProjectionMatrix as Float32Array;
    }

    public onRender(): void {
        if (!this.inited) {
            return;
        }
        const transformationMatrix = this.getTransformationMatrix();
        this.device.queue.writeBuffer(
            this.uniformBuffer,
            0,
            transformationMatrix.buffer,
            transformationMatrix.byteOffset,
            transformationMatrix.byteLength
        );

        // WTF je to no koji kurac
        (this.renderPassDescriptor.colorAttachments as Array<GPURenderPassColorAttachment>)[0].view =
            this.canvasProvider.Context.getCurrentTexture().createView();

        const commandEncoder = this.device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass(this.renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, this.uniformBindGroup);
        passEncoder.setVertexBuffer(0, this.verticesBuffer);
        passEncoder.draw(cubeVertexCount, 1, 0, 0);
        passEncoder.endPass();

        this.device.queue.submit([commandEncoder.finish()]);
    }
}
