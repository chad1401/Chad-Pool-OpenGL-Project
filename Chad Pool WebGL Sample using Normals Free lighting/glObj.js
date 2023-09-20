

class glObj{
    constructor(coords, key) {
        this.key = key;

        this.indices = [];
        for (var i = 0; i <= (coords.length / key) - 1; i++) {
            this.indices.push(i);
        }


        this.vBuffer = this.SetVertBuffer(coords);
        this.iBuffer = this.SetIndexBuffer(this.indices);

        this.vShader = this.vertShader(coords);
        this.fShader = this.fragShader(this.indices);
        this.program = this.setShaderProgram(this.vShader, this.fShader);
        //this.applyShading(this.vBuffer, this.iBuffer, this.program);


        this.light = new Float32Array([0.01, 0.0, 0.1]);


        this.matrix = new Float32Array([
        // 
        /*x*/ 1.0, 0.0, 0.0, 0.0,
        /*y*/ 0.0, 1.0, 0.0, 0.0,
        /*z*/ 0.0, 0.0, 1.0, 0.0,
        /*w*/ 0.0, 0.0, 0.0, 1.0
        ]);

        this.rotmatrix = new Float32Array([
        // 
        /*x*/ 1.0, 0.0, 0.0, 0.0,
        /*y*/ 0.0, 1.0, 0.0, 0.0,
        /*z*/ 0.0, 0.0, 1.0, 0.0,
        /*w*/ 0.0, 0.0, 0.0, 1.0
        ]);



        this.projmatrix = new Float32Array([
        // 
        /*x*/ 1.0, 0.0, 0.0, 0.0,
        /*y*/ 0.0, 1.0, 0.0, 0.0,
        /*z*/ 0.0, 0.0,-0.5,-2.0,
        /*w*/ 0.0, 0.0,-0.5, 0.0
        ]);
    }

    SetVertBuffer(coords) {
        //vert buffer
        var vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);

        return vertex_buffer
    }
    
    SetIndexBuffer(index) {
        //make index buffer
        var Index_Buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
        return Index_Buffer;
    }
    
    
    vertShader() {
        //vert shader source
        var vertCode =
            "precision mediump float;" +
            "attribute vec3 coord;" +
            "attribute vec3 color;" +
            "varying vec3 Fcolor;" + //color for frag
            "varying vec3 Fcoord;" + //coord for frag
            "varying vec3 Flight;" + // Light for frag
            "varying vec3 Fchk;" + // Light for frag
            "varying float Distosity;" + //distocity
            "uniform mat4 ObjMatri;" +
            "uniform mat4 ObjrotMatri;" +
            "uniform mat4 CamMatri;" +
            "uniform mat4 CamrotMatri;" +
            "uniform mat4 ProtMatri;" +
            "uniform vec3 light;" +
            "uniform float distosity;"+
            "void main(void) {" +
            "    gl_Position = ProtMatri * CamrotMatri * CamMatri * ObjMatri * ObjrotMatri *  vec4(coord, 1.0);" +
            "    Fcolor = color;" +
            "    Fcoord = coord;" +
            "    Flight = (ObjMatri *ObjrotMatri *vec4(light, 1.0)).xyz;" +
            "    Fchk = (ObjMatri * vec4(coord, 1.0)).xyz;" +
            "    Distosity = distosity;"+
            "}";
    
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertCode);
    
        //test compile vert shader
        gl.compileShader(vertShader);    
        var success = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
        if (!success) {
            console.error(gl.getShaderInfoLog(vertShader));
        } else { return vertShader; }
    }
    
    fragShader() {
        //frag shader source
        var fragCode =
            "precision mediump float;" +
            "varying vec3 Fcolor;" +
            "varying vec3 Fcoord;" +
            "varying vec3 Flight;" +
            "varying vec3 Fchk;" +
            "varying float Distosity;" +
            "void main(void) {" +
            "    float ambiant = 0.1;" +
            "    float Temp = ( dot( -normalize(Flight) , normalize(Fcoord)) ) ;" + //totaly funcitonal partial fragments lighting
            "    float dist = distance(Fcoord,Flight);" +
            "    Temp = (Temp) - (dist / Distosity );"+
            "    if(1.0 < Temp){Temp = 1.0;}" +
            "    if (ambiant > Temp) { Temp = ambiant; } " +
            "    gl_FragColor = vec4( (Fcolor.x * Temp) + ambiant, (Fcolor.y * Temp) + ambiant, (Fcolor.z * Temp) + ambiant, 1.0);" +
            "}";
    
        //make frag shader obj
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragCode);
    
        //test compile fragg shader
        gl.compileShader(fragShader);
        var success = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
        if (!success) {
            console.error(gl.getShaderInfoLog(fragShader));
        } else { return fragShader; }
    }
    
    
    setShaderProgram(vertShader, fragShader) {
        var shaderProgram = gl.createProgram();
        //vert shader
        gl.attachShader(shaderProgram, vertShader);
    
        //frag shader
        gl.attachShader(shaderProgram, fragShader);
    
        //linker
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);
    
        return shaderProgram;
    }
    
    
    applyShading(vertex_buffer, Index_Buffer, shaderProgram) {
        
        // Bind my buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    
    
        // Get the attribute location
        var coord = gl.getAttribLocation(shaderProgram, "coord");
        var color = gl.getAttribLocation(shaderProgram, "color");

    
        //set stride and offset for buffers to read color  and coords
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 6 * 4, 0);
        gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
    
        gl.enableVertexAttribArray(coord);
        gl.enableVertexAttribArray(color);
    }
    
    drawTriangles(verts, offset) {

        this.applyShading(this.vBuffer, this.iBuffer, this.program);
        gl.drawElements(gl.TRIANGLES, verts, gl.UNSIGNED_SHORT, offset*2);
    }

    drawTriangleStrip(verts, offset) {
        this.applyShading(this.vBuffer, this.iBuffer, this.program);
        gl.drawElements(gl.TRIANGLE_STRIP, verts, gl.UNSIGNED_SHORT, offset * 2);
    }
    drawTriangleFan(verts, offset) {
        this.applyShading(this.vBuffer, this.iBuffer, this.program);
        gl.drawElements(gl.TRIANGLE_FAN, verts, gl.UNSIGNED_SHORT, offset * 2);
    }


    setTransform(matrix) {
        this.matrix = matrix;
    }

    transform() {

        gl.useProgram(this.program);

        this.Matr = gl.getUniformLocation(this.program, 'ObjMatri');
        gl.uniformMatrix4fv(this.Matr, false, this.matrix);

        this.rotMatr = gl.getUniformLocation(this.program, 'ObjrotMatri');
        gl.uniformMatrix4fv(this.rotMatr, false, this.rotmatrix);


        cam.Matr = gl.getUniformLocation(this.program, 'CamMatri');
        gl.uniformMatrix4fv(cam.Matr, false, cam.matrix);

        cam.rotMatr = gl.getUniformLocation(this.program, 'CamrotMatri');
        gl.uniformMatrix4fv(cam.rotMatr, false, cam.rotmatrix);


        var proj = gl.getUniformLocation(this.program, 'ProtMatri');
        gl.uniformMatrix4fv(proj, false, this.projmatrix);

        var inten = gl.getUniformLocation(this.program, 'light');
        gl.uniform3fv(inten, this.light);


        var distosity = gl.getUniformLocation(this.program, 'distosity');
        gl.uniform1f(distosity, this.dist);

    }
    clrTransform() {
        this.matrix = new Float32Array([
        /*x*/ 1.0, 0.0, 0.0, 0.0,
        /*y*/ 0.0, 1.0, 0.0, 0.0,
        /*z*/ 0.0, 0.0, 1.0, 0.0,
        /*w*/ 0.0, 0.0, 0.0, 1.0
        ]);
        this.rotmatrix = new Float32Array([
        // 
        /*x*/ 1.0, 0.0, 0.0, 0.0,
        /*y*/ 0.0, 1.0, 0.0, 0.0,
        /*z*/ 0.0, 0.0, 1.0, 0.0,
        /*w*/ 0.0, 0.0, 0.0, 1.0
        ]);

    }

    TS(xT,yT,zT,xS, yS, zS) {
        var matrix = new Float32Array([
        /*x*/ xS,  0.0, 0.0, 0.0,
        /*y*/ 0.0, yS,  0.0, 0.0,
        /*z*/ 0.0, 0.0, zS , 0.0,
        /*w*/ xT , yT , zT , 1.0
        ]);
        this.matrix = matrix;
    }


    rot(z, y, x) { // i accadentaly filiped my z and x in the mega matrix but its kina whatever cus i un flip in prims.
        this.rotmatrix = new Float32Array([
        /*x*/ cos(x) * cos(y), cos(x) * sin(y) * sin(z) - sin(x) * cos(z), cos(x) * sin(y) * cos(z) + sin(x) * sin(z), 0,
        /*y*/ sin(x) * cos(y), sin(x) * sin(y) * sin(z) + cos(x) * cos(z), sin(x) * sin(y) * cos(z) - cos(x) * sin(z), 0,
        /*z*/ -sin(y), cos(y) * sin(z), cos(y) * cos(z), 0,
        /*w*/ 0, 0, 0, 1
        ]);
    }

    Srot(Axs, qty) {
        if (Axs == "X") {
            this.rotmatrix = new Float32Array([
            /*x*/ 1, 0, 0, 0,
            /*y*/ 0,  cos(qty), sin(qty), 0,
            /*z*/ 0, -sin(qty), cos(qty), 0,
            /*w*/ 0, 0, 0, 1
            ]);
        }
        if (Axs == "Y") {
            this.rotmatrix = new Float32Array([
            /*x*/  cos(qty), 0.0, -sin(qty), 0.0,
            /*y*/ 0.0, 1.0, 0.0, 0.0,
            /*z*/ sin(qty), 0.0, cos(qty), 0.0,
            /*w*/ 0.0, 0.0, 0.0, 1.0
            ]);
        }
        if (Axs == "Z") {
            this.rotmatrix = new Float32Array([
            /*x*/  cos(qty), sin(qty), 0.0, 0.0,
            /*y*/ -sin(qty), cos(qty), 0.0, 0.0,
            /*z*/ 0.0, 0.0, 1.0, 0.0,
            /*w*/ 0.0, 0.0, 0.0, 1.0
            ]);
        }
    }
    Lit(x, y, z) {

        var light = new Float32Array([
        //  R    G    B
            -x, y, -z,
        ]);
        this.light = light;

    }


}


class camera{
    constructor() {


        this.Rx = 0;
        this.Ry = 0;
        this.Rz = 0;

        this.Tx = 0;
        this.Ty = 0;
        this.Tz = 0;

        this.Sx = 1;
        this.Sy = 1;
        this.Sz = 1;


        this.matrix = new Float32Array([
        // 
        /*x*/ 1.0, 0.0, 0.0, 0.0,
        /*y*/ 0.0, 1.0, 0.0, 0.0,
        /*z*/ 0.0, 0.0, 1.0, 0.0,
        /*w*/ 0.0, 0.0, 0.0, 1.0
        ]);

        this.rotmatrix = new Float32Array([
        // 
        /*x*/ 1.0, 0.0, 0.0, 0.0,
        /*y*/ 0.0, 1.0, 0.0, 0.0,
        /*z*/ 0.0, 0.0, 1.0, 0.0,
        /*w*/ 0.0, 0.0, 0.0, 1.0
        ]);

    }

    TS(xT, yT, zT, xS, yS, zS) {
        var matrix = new Float32Array([
            /*x*/ xS, 0.0, 0.0, 0.0,
            /*y*/ 0.0, yS, 0.0, 0.0,
            /*z*/ 0.0, 0.0, zS, 0.0,
            /*w*/ xT, yT, zT, 1.0
        ]);
        this.matrix = matrix;
    }

    rot(z, y, x) { //xyz rong in mega matr so i flip z n x to get back on track
        this.rotmatrix = new Float32Array([
        /*x*/ cos(x) * cos(y), cos(x) * sin(y) * sin(z) - sin(x) * cos(z), cos(x) * sin(y) * cos(z) + sin(x) * sin(z), 0,
        /*y*/ sin(x) * cos(y), sin(x) * sin(y) * sin(z) + cos(x) * cos(z), sin(x) * sin(y) * cos(z) - cos(x) * sin(z), 0,
        /*z*/ -sin(y),         cos(y) * sin(z),                            cos(y)*cos(z),                              0,
        /*w*/ 0,               0,                                          0,                                          1
        ]);
    }

    cls() {
        // Clear the canvas
        gl.clearColor(0.2, 0.2, 0.2, 1);//RGBA
        gl.clear(gl.COLOR_BUFFER_BIT);

        //canvas go brrr
        gl.viewport(0, 0, canvas.width, canvas.height);
    }


}









