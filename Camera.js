class Camera {
    constructor() {
        this.fov = 60.0;
        this.eye = new Vector3([0, 0, 0]);
        this.at =  new Vector3([0, 0,-1]);
        this.up =  new Vector3([0, 1, 0]);  
        this.viewMatrix = new Matrix4(); 
        this.projectionMatrix = new Matrix4();

        this.moveSpeed = 1.0;
        this.panSpeed = 5.0;
        
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0],  this.at.elements[1],  this.at.elements[2],
            this.up.elements[0],  this.up.elements[1],  this.up.elements[2]
        );
        this.projectionMatrix.setPerspective(this.fov, canvas.width / canvas.height, 0.1, 1000);
    }

    // it made sense to have a function to update the camera view
    update() {
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0],  this.at.elements[1],  this.at.elements[2],
            this.up.elements[0],  this.up.elements[1],  this.up.elements[2]
        );
        this.projectionMatrix.setPerspective(this.fov, canvas.width / canvas.height, 0.1, 1000);
    }

    moveForward() {
        let f = new Vector3([
            this.at.elements[0] - this.eye.elements[0],
            this.at.elements[1] - this.eye.elements[1],
            this.at.elements[2] - this.eye.elements[2],
        ]);
        // f.set(this.at);
        // f.sub(this.eye);
        f.normalize();
        // f.mul(this.moveSpeed);

        // this.eye.add(f);
        // this.at.add(f);
        this.eye.elements[0] += (f.elements[0] * this.moveSpeed);
        this.eye.elements[1] += (f.elements[1] * this.moveSpeed);
        this.eye.elements[2] += (f.elements[2] * this.moveSpeed);

        this.at.elements[0] += (f.elements[0] * this.moveSpeed);
        this.at.elements[1] += (f.elements[1] * this.moveSpeed);
        this.at.elements[2] += (f.elements[2] * this.moveSpeed);
    }

    moveBackward() {
        let b = new Vector3([
            this.eye.elements[0] - this.at.elements[0],
            this.eye.elements[1] - this.at.elements[1],
            this.eye.elements[2] - this.at.elements[2],
        ]);
        // b.set(this.at);
        // b.sub(this.eye);
        b.normalize();
        // b.mul(this.moveSpeed);

        // this.eye.add(b);
        // this.at.add(b);
        this.eye.elements[0] += (b.elements[0] * this.moveSpeed);
        this.eye.elements[1] += (b.elements[1] * this.moveSpeed);
        this.eye.elements[2] += (b.elements[2] * this.moveSpeed);

        this.at.elements[0] += (b.elements[0] * this.moveSpeed);
        this.at.elements[1] += (b.elements[1] * this.moveSpeed);
        this.at.elements[2] += (b.elements[2] * this.moveSpeed);
    }

    moveLeft() {
        let f = new Vector3([
            this.at.elements[0] - this.eye.elements[0],
            this.at.elements[1] - this.eye.elements[1],
            this.at.elements[2] - this.eye.elements[2],
        ]);

        let s = this.cross(this.up, f);
        s.normalize();
        // s.mul(this.moveSpeed);

        this.eye.elements[0] += (s.elements[0] * this.moveSpeed);
        this.eye.elements[1] += (s.elements[1] * this.moveSpeed);
        this.eye.elements[2] += (s.elements[2] * this.moveSpeed);

        this.at.elements[0] += (s.elements[0] * this.moveSpeed);
        this.at.elements[1] += (s.elements[1] * this.moveSpeed);
        this.at.elements[2] += (s.elements[2] * this.moveSpeed);
    }

    moveRight() {
        let f = new Vector3([
            this.at.elements[0] - this.eye.elements[0],
            this.at.elements[1] - this.eye.elements[1],
            this.at.elements[2] - this.eye.elements[2],
        ]);

        let s = this.cross(f, this.up);
        s.normalize();
        // s.mul(this.moveSpeed);

        this.eye.elements[0] += (s.elements[0] * this.moveSpeed);
        this.eye.elements[1] += (s.elements[1] * this.moveSpeed);
        this.eye.elements[2] += (s.elements[2] * this.moveSpeed);

        this.at.elements[0] += (s.elements[0] * this.moveSpeed);
        this.at.elements[1] += (s.elements[1] * this.moveSpeed);
        this.at.elements[2] += (s.elements[2] * this.moveSpeed);
    }

    panLeft() {
        let f = new Vector3([
            this.at.elements[0] - this.eye.elements[0],
            this.at.elements[1] - this.eye.elements[1],
            this.at.elements[2] - this.eye.elements[2],
        ]);

        let rM = new Matrix4();
        rM.setRotate(this.panSpeed, this.up.elements[0], this.up.elements[1], this.up.elements[2],);

        let f_prime = rM.multiplyVector3(f);
        
        this.at.elements[0] = this.eye.elements[0] + f_prime.elements[0];
        this.at.elements[1] = this.eye.elements[1] + f_prime.elements[1];
        this.at.elements[2] = this.eye.elements[2] + f_prime.elements[2];
    }

    panRight() {
        let f = new Vector3([
            this.at.elements[0] - this.eye.elements[0],
            this.at.elements[1] - this.eye.elements[1],
            this.at.elements[2] - this.eye.elements[2],
        ]);

        let rM = new Matrix4();
        rM.setRotate(-this.panSpeed, this.up.elements[0], this.up.elements[1], this.up.elements[2],);

        let f_prime = rM.multiplyVector3(f);
        
        this.at.elements[0] = this.eye.elements[0] + f_prime.elements[0];
        this.at.elements[1] = this.eye.elements[1] + f_prime.elements[1];
        this.at.elements[2] = this.eye.elements[2] + f_prime.elements[2];
    }

    // Cross product isn't a part of the library, so I had to write it myself.
    // Takes in two Vector3's and outputs a Vector3.
    cross(a, b) {
        let c = new Vector3([
            (a.elements[1] * b.elements[2] - a.elements[2] * b.elements[1]),
            -1 * (a.elements[0] * b.elements[2] - a.elements[2] * b.elements[0]),
            (a.elements[0] * b.elements[1] - a.elements[1] * b.elements[0]),
        ]);
        return c;
    }
}