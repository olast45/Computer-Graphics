const vertexShaderTxt = `
    precision mediump float;
    attribute vec2 vertPosition;
    varying vec3 fragColor; 
    void main(){
        fragColor = vec3(0.3, 0.1, 0.5);
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`


const fragmentShaderTxt = `
    precision mediump float;
    uniform vec3 uColor;
    void main(){
        gl_FragColor = vec4(uColor, 1.0); // R, G, B, opacity
    }
`


let Square = function(){
    let canvas = document.getElementById('main-canvas');
    let gl = canvas.getContext('webgl');

    if(!gl){
        alert('webgl not supported');
    }

    gl.clearColor(0, 0, 0, 0); // R, G, B, opacity
    gl.clear(gl.COLOR_BUFFER_BIT);

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    
    gl.validateProgram(program)

    const squareVert = [
        -0.5, -0.5, 
        0.5, -0.5, 
        -0.5,  0.5, 
        -0.5,  0.5, 
        0.5, -0.5, 
        0.5,  0.5,
    ];

    const squareVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVert), gl.STATIC_DRAW);

    const posAttrLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttrLocation, 
        2,
        gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0,
    );
    gl.enableVertexAttribArray(posAttrLocation);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const colorButton = document.getElementById('color-button');
    colorButton.addEventListener('click', () => {
    console.log('Button clicked');
    let newColor = [Math.random(), Math.random(), Math.random()];
    const colorUniformLocation = gl.getUniformLocation(program, 'uColor');
    console.log(colorUniformLocation); // check if colorUniformLocation is not null
    gl.uniform3fv(colorUniformLocation, newColor);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
});

    
}
