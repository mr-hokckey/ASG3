// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`;

// Fragment shader program
var FSHADER_SOURCE =`
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
        gl_FragColor = vec4(v_UV,1.0,1.0);
    }`;

// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;

// get the canvas and gl context
function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // enable depth test
    gl.enable(gl.DEPTH_TEST);
}

// compile the shader programs, attach the javascript variables to the GLSL variables
function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    // // Get the storage location of u_ViewMatrix
    // u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    // if (!u_ViewMatrix) {
    //     console.log('Failed to get the storage location of u_ViewMatrix');
    //     return;
    // }
    
    // // Get the storage location of u_ProjectionMatrix
    // u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    // if (!u_ProjectionMatrix) {
    //     console.log('Failed to get the storage location of u_ProjectionMatrix');
    //     return;
    // }
}

let g_animalGlobalRotation = new Matrix4();

let g_wingAngle = 45;
let g_headAngle = 0;
let g_beakSize = 0.6;

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;
var g_wingAnimation = true;

function tick() {
    g_seconds = performance.now() / 1000.0 - g_startTime;

    renderAllShapes();

    requestAnimationFrame(tick);
}


function addActionsForHtmlUI() {
    document.getElementById("slider_rotation").addEventListener('mousemove', function () { 
        g_animalGlobalRotation.setRotate(this.value, 0, 1, 0);
        gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, g_animalGlobalRotation.elements);
        renderAllShapes();
    });
    document.getElementById("slider_wingAngle").addEventListener('mousemove', function () { g_wingAngle = this.value; renderAllShapes(); });
    document.getElementById("slider_headAngle").addEventListener('mousemove', function () { g_headAngle = this.value; renderAllShapes(); });
    document.getElementById("slider_beakSize").addEventListener('mousemove', function () { g_beakSize = this.value / 10; renderAllShapes(); });

    document.getElementById("checkbox_animation").addEventListener('change', function () { g_wingAnimation = !g_wingAnimation; renderAllShapes(); });
}

function main() {

    setupWebGL();

    connectVariablesToGLSL();

    addActionsForHtmlUI();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Render all shapes
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, g_animalGlobalRotation.elements);

    // renderAllShapes();
    requestAnimationFrame(tick);
}

function renderAllShapes() {
    // Clear <canvas>  AND clear the DEPTH_BUFFER
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw cubes
    var body = new Cube();
    body.color = [0,0.5,0.5,1];
    body.matrix = new Matrix4();
    body.matrix.rotate(-45, 0, 0, 1);
    body.matrix.scale(0.4, 0.6, 0.4);
    body.render();

    var head = new Cube();
    head.color = [0,0.2,0.8,1];
    head.matrix = new Matrix4();
    head.matrix.rotate(60, 0, 0, 1);
    head.matrix.translate(0.4, -0.1, 0);
    head.matrix.rotate(g_headAngle, 1, 0, 0);
    var headCoordinatesMat = new Matrix4(head.matrix);
    head.matrix.scale(0.39, 0.39, 0.39);
    head.render();

    var beak = new Cube();
    beak.color = [1,0.5,0,1];
    beak.matrix = headCoordinatesMat;
    beak.matrix.rotate(-45, 0, 0, 1);
    beak.matrix.translate(g_beakSize / 2, 0, 0);
    beak.matrix.scale(g_beakSize, 0.1, 0.1);
    var beakCoordinatesMat = new Matrix4(beak.matrix);
    beak.render();

    // A hummingbird by itself doesn't really have enough parts to make a chain of
    // 3 parts. So I took some creative liberties.
    var flower = new Cube();
    flower.color = [1,0,0,1];
    flower.matrix = beakCoordinatesMat;
    flower.matrix.translate(0.7,0,0);
    flower.matrix.scale(0.2,2,2);
    flower.render();

    var wingLeft = new Cube();
    wingLeft.color = [0,0.5,0.25,1];
    wingLeft.matrix = new Matrix4();
    wingLeft.matrix.rotate(45, 0, 0, 1);
    wingLeft.matrix.translate(0.1, 0.19, 0.19);
    if (g_wingAnimation) {
        wingLeft.matrix.rotate(90 * Math.sin(g_seconds * g_wingAngle) + 90, 1, 0, 0);
    } else {
        wingLeft.matrix.rotate(g_wingAngle, 1, 0, 0);
    }
    wingLeft.matrix.translate(0, 0.3, 0);
    wingLeft.matrix.scale(0.4, 0.6, 0.1);
    wingLeft.render();

    var wingRight = new Cube();
    wingRight.color = [0,0.5,0.25,1];
    wingRight.matrix = new Matrix4();
    wingRight.matrix.rotate(45, 0, 0, 1);
    wingRight.matrix.translate(0.1, 0.19, -0.19);
    if (g_wingAnimation) {
        wingRight.matrix.rotate(-(90 * Math.sin(g_seconds * g_wingAngle) + 90), 1, 0, 0);
    } else {
        wingRight.matrix.rotate(-g_wingAngle, 1, 0, 0);
    }
    wingRight.matrix.translate(0, 0.3, 0);
    wingRight.matrix.scale(0.4, 0.6, 0.1);
    wingRight.render();

    var footLeft = new Cube();
    footLeft.color = [0.2,0.2,0.2,1];
    footLeft.matrix = new Matrix4();
    footLeft.matrix.translate(0, -0.3, 0.1);
    footLeft.matrix.rotate(-45, 0, 0, 1);
    footLeft.matrix.scale(0.1, 0.1, 0.1);
    footLeft.render();

    var footRight = new Cube();
    footRight.color = [0.2,0.2,0.2,1];
    footRight.matrix = new Matrix4();
    footRight.matrix.translate(0, -0.3, -0.1);
    footRight.matrix.rotate(-45, 0, 0, 1);
    footRight.matrix.scale(0.1, 0.1, 0.1);
    footRight.render();

    var tail = new Cube();
    tail.color = [0.9,0.9,0.9,1];
    tail.matrix = new Matrix4();
    tail.matrix.rotate(-45, 0, 0, 1);
    tail.matrix.translate(0, -0.5, 0);
    tail.matrix.scale(0.2, 0.4, 0.4);
    tail.render();
}
