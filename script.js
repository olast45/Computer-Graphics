
const mat4 = glMatrix.mat4; 

class Triangle {
    vertexShaderTxt = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main()
    {
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }

`

    fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0); // R,G,B, opacity
    }
`

    constructor(id){
        this.backgroundColor = [0.5, 0.5, 0.9];
        this.canvas = document.getElementById(id);
        this.gl = this.canvas.getContext('webgl');

        if (!this.gl) {
            alert('webgl not supported');
        }
        this.prepareBackground(this.backgroundColor);

    }

    prepareBackground(colors){
        this.gl.clearColor(...colors, 1.0);  // R,G,B, opacity
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
    }

    loadShader(type) {
        this.program = this.gl.createProgram();
        let shader_type = null;
        let shaderString = null;
        
        if (type == "VERTEX") {
            shader_type = this.gl.VERTEX_SHADER;
            shaderString = this.vertexShaderTxt;
        } else if (type == "FRAGMENT") {
            shader_type = this.gl.FRAGMENT_SHADER;
            shaderString = this.fragmentShaderTxt;
        }
        let shader = this.gl.createShader(shader_type);
        this.gl.shaderSource(shader, shaderString);
        this.gl.compileShader(shader);
    
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error('Shader compilation error: ' + this.gl.getShaderInfoLog(shader));
        }
        //console.log(shaderString);
        this.gl.attachShader(this.program, shader);
    }
    
    linkMyProgram() {
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error('Unable to link the program: ' + this.gl.getProgramInfoLog(this.program));
        }
    }
    
    prepareShaders() {
        const vertex = "VERTEX";
        const fragment = "FRAGMENT";
        this.loadShader(vertex);
        this.loadShader(fragment);
        this.linkMyProgram();
        this.gl.useProgram(this.program);
    }
    
    createVertexBuffer(){
    const boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	];

    const boxVerticesertexBufferObject = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, boxVerticesertexBufferObject);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(boxVertices), this.gl.STATIC_DRAW);

    return boxVerticesertexBufferObject;

}

    createIndexBuffer(){
	const boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];
    //console.log(boxIndices.length);
    const cubeIndexBufferObject = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, cubeIndexBufferObject);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), this.gl.STATIC_DRAW);

    return cubeIndexBufferObject;

}

    getLocation(type, offset, stride) {
    
    let name;
    if (type === "POSITION") {
        name = 'vertPosition';
        this.vertexBuffer = this.createVertexBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    } else if (type === "COLOR") {
        name = 'vertColor';
        this.indexBuffer = this.createIndexBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    //this.linkMyProgram();
    const location = this.gl.getAttribLocation(this.program, name);
    this.gl.vertexAttribPointer(
        location,
        3,
        this.gl.FLOAT,
        this.gl.FALSE,
        stride * Float32Array.BYTES_PER_ELEMENT,
        offset * Float32Array.BYTES_PER_ELEMENT,
    );
    this.gl.enableVertexAttribArray(location);
}

        
    createMatrices(){
        //this.linkMyProgram();
        this.matWorldUniformLocation = this.gl.getUniformLocation(this.program, "mWorld");
        this.matViewUniformLocation = this.gl.getUniformLocation(this.program, 'mView');
        this.matProjUniformLocation = this.gl.getUniformLocation(this.program, 'mProj');

        this.worldMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        mat4.lookAt(this.viewMatrix, [0,0,-10], [0,0,0], [0,1,0]); // vectors are: position of the camera, which way they are looking, which way is up
        this.projMatrix = mat4.create();
        mat4.perspective(this.projMatrix, glMatrix.glMatrix.toRadian(45), this.canvas.width / this.canvas.height, 0.1, 1000.0);


        this.gl.uniformMatrix4fv(this.matWorldUniformLocation, this.gl.FALSE, this.worldMatrix);
        this.gl.uniformMatrix4fv(this.matViewUniformLocation, this.gl.FALSE, this.viewMatrix);
        this.gl.uniformMatrix4fv(this.matProjUniformLocation, this.gl.FALSE, this.projMatrix);
        this.identityMatrix = mat4.create(); 
    }

    loop(){

        let angle = 0;
        const loop = function () {
        angle = performance.now() / 100 / 8 * 2* Math.PI;

        mat4.rotate(this.worldMatrix, this.identityMatrix, angle, [1,2,0]);
        this.gl.uniformMatrix4fv(this.matWorldUniformLocation, this.gl.FALSE, this.worldMatrix);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    }.bind(this);
    requestAnimationFrame(loop);
}

    

}

function main() {
    const triangle = new Triangle('main-canvas');
    triangle.prepareShaders();
    triangle.getLocation('POSITION', 6, 0);
    triangle.getLocation('COLOR', 6, 3);
    triangle.createMatrices();
    triangle.loop();
}

main();