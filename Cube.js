class Cube {
    constructor() {
        this.type = 'cube';
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 4.0;
        // this.segments = 10;
        this.matrix = new Matrix4();
    }

    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Fake lighting
        // gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

        // Draw

        // Top
        // drawTriangle3D( [0,1,0, 1,1,1, 1,1,0] );
        drawTriangle3DUV( [0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0] );
        drawTriangle3D( [0,1,0, 1,1,1, 0,1,1], [0,0, 0,1, 1,1] );

        // Front
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
        drawTriangle3D( [0,0,0, 1,1,0, 1,0,0] );
        drawTriangle3D( [0,0,0, 1,1,0, 0,1,0] );

        // Right
        gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
        drawTriangle3D( [1,0,0, 1,1,1, 1,0,1] );
        drawTriangle3D( [1,0,0, 1,1,1, 1,1,0] );

        // Left
        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        drawTriangle3D( [0,0,0, 0,1,1, 0,0,1] );
        drawTriangle3D( [0,0,0, 0,1,1, 0,1,0] );

        // Back
        gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
        drawTriangle3D( [0,0,1, 1,1,1, 1,0,1] );
        drawTriangle3D( [0,0,1, 1,1,1, 0,1,1] );

        // Bottom
        gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
        drawTriangle3D( [0,0,0, 1,0,1, 1,0,0] );
        drawTriangle3D( [0,0,0, 1,0,1, 0,0,1] );

        // CENTERED VARIATION

        // // Top
        // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // drawTriangle3D( [0-0.5,1-0.5,0-0.5, 1-0.5,1-0.5,1-0.5, 1-0.5,1-0.5,0-0.5] );
        // drawTriangle3D( [0-0.5,1-0.5,0-0.5, 1-0.5,1-0.5,1-0.5, 0-0.5,1-0.5,1-0.5] );

        // // Front
        // gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
        // drawTriangle3D( [0-0.5,0-0.5,0-0.5, 1-0.5,1-0.5,0-0.5, 1-0.5,0-0.5,0-0.5] );
        // drawTriangle3D( [0-0.5,0-0.5,0-0.5, 1-0.5,1-0.5,0-0.5, 0-0.5,1-0.5,0-0.5] );

        // // Right
        // gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
        // drawTriangle3D( [1-0.5,0-0.5,0-0.5, 1-0.5,1-0.5,1-0.5, 1-0.5,0-0.5,1-0.5] );
        // drawTriangle3D( [1-0.5,0-0.5,0-0.5, 1-0.5,1-0.5,1-0.5, 1-0.5,1-0.5,0-0.5] );

        // // Left
        // gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        // drawTriangle3D( [0-0.5,0-0.5,0-0.5, 0-0.5,1-0.5,1-0.5, 0-0.5,0-0.5,1-0.5] );
        // drawTriangle3D( [0-0.5,0-0.5,0-0.5, 0-0.5,1-0.5,1-0.5, 0-0.5,1-0.5,0-0.5] );

        // // Back
        // gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
        // drawTriangle3D( [0-0.5,0-0.5,1-0.5, 1-0.5,1-0.5,1-0.5, 1-0.5,0-0.5,1-0.5] );
        // drawTriangle3D( [0-0.5,0-0.5,1-0.5, 1-0.5,1-0.5,1-0.5, 0-0.5,1-0.5,1-0.5] );

        // // Bottom
        // gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
        // drawTriangle3D( [0-0.5,0-0.5,0-0.5, 1-0.5,0-0.5,1-0.5, 1-0.5,0-0.5,0-0.5] );
        // drawTriangle3D( [0-0.5,0-0.5,0-0.5, 1-0.5,0-0.5,1-0.5, 0-0.5,0-0.5,1-0.5] );
    }
}
