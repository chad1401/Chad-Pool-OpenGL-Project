var key = 6;


class d8 {

    constructor(r = 0, g = 0, b = 0) {

        this.Px = 0;
        this.Py = 0;
        this.Pz = 0;

        this.Sx = 0;
        this.Sy = 0;
        this.Sz = 0;

        

        let salt = 2;

        this.d8Coords = [
            //x  y  z  r  g  b 
            1, 0, 0,  r + Math.random() / salt ,g,b,
            0, 1, 0,  r + Math.random() / salt ,g,b,
            0, 0, 1,  r + Math.random() / salt ,g,b,
            1, 0, 0,  r + Math.random() / salt ,g,b,
            0, 1, 0,  r + Math.random() / salt ,g,b,
            0, 0, -1, r + Math.random() / salt ,g,b,
            1, 0, 0,  r + Math.random() / salt ,g,b,
            0, 0, -1, r + Math.random() / salt ,g,b,
            0, -1, 0, r + Math.random() / salt ,g,b,
            1, 0, 0,  r + Math.random() / salt ,g,b,
            0, 0, 1,  r + Math.random() / salt ,g,b,
            0, -1, 0, r + Math.random() / salt ,g,b,
            -1, 0, 0, r + Math.random() / salt ,g,b,
            0, 1, 0,  r + Math.random() / salt ,g,b,
            0, 0, 1,  r + Math.random() / salt ,g,b,
            -1, 0, 0, r + Math.random() / salt ,g,b,
            0, 1, 0,  r + Math.random() / salt ,g,b,
            0, 0, -1, r + Math.random() / salt ,g,b,
            -1, 0, 0, r + Math.random() / salt ,g,b,
            0, 0, -1, r + Math.random() / salt ,g,b,
            0, -1, 0, r + Math.random() / salt ,g,b,
            -1, 0, 0, r + Math.random() / salt ,g,b,
            0, 0, 1,  r + Math.random() / salt ,g,b,
            0, -1, 0, r + Math.random() / salt ,g,b,
        ];
        this.glob = new glObj(this.d8Coords, key);
        this.glob.dist = 15;
    }


    Rot(x, y, z) {
        this.glob.rot(x, y, z);
        this.glob.transform();
        this.glob.drawTriangles((this.d8Coords.length / key), 0);
    }
    Pos(x, y, z) {
        this.Px = x;
        this.Py = y;
        this.Pz = z;
        this.glob.TS(this.Px, this.Py, this.Pz, this.Sx, this.Sy, this.Sz); //unflip
        this.glob.transform();
        this.glob.drawTriangles((this.d8Coords.length / key), 0);
    }
    Scale(x, y, z) {
        this.Sx = x;
        this.Sy = y;
        this.Sz = z;
        this.glob.TS(this.Px, this.Py, this.Pz, this.Sx, this.Sy, this.Sz);
        this.glob.transform();
        this.glob.drawTriangles((this.d8Coords.length / key), 0);
    }

}//prims


class plane {
    
    constructor(r = 0 , g = 0, b = 0) {

        this.Px = 0;
        this.Py = 0;
        this.Pz = 0;

        this.Sx = 0;
        this.Sy = 0;
        this.Sz = 0;

        var key = 6;
        this.PlaneCoords = [
            //x  y  z  r  g  b 
            1, 0, 1, r, g, b,
            1, 0,-1, r, g, b,
           -1, 0,-1, r, g, b,
               
            1, 0, 1, r, g, b,
           -1, 0, 1, r, g, b,
           -1, 0,-1, r, g, b,

        ];
        this.glob = new glObj(this.PlaneCoords, key);
        this.glob.dist = 15;
    }


    Rot(x, y, z) {
        this.glob.rot(x, y, z);
        this.glob.transform();
        this.glob.drawTriangles((this.PlaneCoords.length / key) , 0);
    }
    Pos(x, y, z) {
        this.Px = x;
        this.Py = y;
        this.Pz = z;
        this.glob.TS(this.Px, this.Py, this.Pz, this.Sx, this.Sy, this.Sz); //unflip
        this.glob.transform();
        this.glob.drawTriangles((this.PlaneCoords.length/key), 0);
    }
    Scale(x, y, z) {
        this.Sx = x;
        this.Sy = y;
        this.Sz = z;
        this.glob.TS(this.Px, this.Py, this.Pz, this.Sx, this.Sy, this.Sz);
        this.glob.transform();
        this.glob.drawTriangles((this.PlaneCoords.length/key), 0);
    }

}//prims


class ground {

    constructor(r = 0, g = 0, b = 0) {

        this.Px = 0;
        this.Py = 0;
        this.Pz = 0;

        this.Sx = 0;
        this.Sy = 0;
        this.Sz = 0;

        var key = 6;
        this.GroundCoords = [
            //x  y  z  r  g  b 
            1, 10, 1, r, g, b,
            1, 10, -1, r, g, b,
           -1, 10, -1, r, g, b,

            1, 10, 1, r, g, b,
           -1, 10, 1, r, g, b,
           -1, 10, -1, r, g, b,

        ];
        this.glob = new glObj(this.GroundCoords, key);
        this.glob.dist = 30;
    }


    Rot(x, y, z) {
        this.glob.rot(x, y, z);
        this.glob.transform();
        this.glob.drawTriangles((this.GroundCoords.length / key), 0);
    }
    Pos(x, y, z) {
        this.Px = x;
        this.Py = y;
        this.Pz = z;
        this.glob.TS(this.Px, this.Py, this.Pz, this.Sx, this.Sy, this.Sz); //unflip
        this.glob.transform();
        this.glob.drawTriangles((this.GroundCoords.length / key), 0);
    }
    Scale(x, y, z) {
        this.Sx = x;
        this.Sy = y;
        this.Sz = z;
        this.glob.TS(this.Px, this.Py, this.Pz, this.Sx, this.Sy, this.Sz);
        this.glob.transform();
        this.glob.drawTriangles((this.GroundCoords.length / key), 0);
    }

}//prims



class disc {

    constructor(r = 0, g = 0, b = 0) {

        this.Px = 0;
        this.Py = 0;
        this.Pz = 0;

        this.Sx = 0;
        this.Sy = 0;
        this.Sz = 0;

        var key = 6;


        this.DiscCoords = [
            //x  y  z  r  g  b 
            0,        0, 0,        r, g, b,//center

            cos(0  ), 0, sin(0  ), r, g, b,
            cos(10 ), 0, sin(10 ), r, g, b,
            cos(20 ), 0, sin(20 ), r, g, b,
            cos(30 ), 0, sin(30 ), r, g, b,
            cos(40 ), 0, sin(40 ), r, g, b,
            cos(50 ), 0, sin(50 ), r, g, b,
            cos(60 ), 0, sin(60 ), r, g, b,
            cos(70 ), 0, sin(70 ), r, g, b,
            cos(80 ), 0, sin(80 ), r, g, b,
            cos(90 ), 0, sin(90 ), r, g, b,
            cos(100), 0, sin(100), r, g, b,
            cos(110), 0, sin(110), r, g, b,
            cos(120), 0, sin(120), r, g, b,
            cos(130), 0, sin(130), r, g, b,
            cos(140), 0, sin(140), r, g, b,
            cos(150), 0, sin(150), r, g, b,
            cos(160), 0, sin(160), r, g, b,
            cos(170), 0, sin(170), r, g, b,
            cos(180), 0, sin(180), r, g, b,
            cos(190), 0, sin(190), r, g, b,
            cos(200), 0, sin(200), r, g, b,
            cos(210), 0, sin(210), r, g, b,
            cos(220), 0, sin(220), r, g, b,
            cos(230), 0, sin(230), r, g, b,
            cos(240), 0, sin(240), r, g, b,
            cos(250), 0, sin(250), r, g, b,
            cos(260), 0, sin(260), r, g, b,
            cos(270), 0, sin(270), r, g, b,
            cos(280), 0, sin(280), r, g, b,
            cos(290), 0, sin(290), r, g, b,
            cos(300), 0, sin(300), r, g, b,
            cos(310), 0, sin(310), r, g, b,
            cos(320), 0, sin(320), r, g, b,
            cos(330), 0, sin(330), r, g, b,
            cos(340), 0, sin(340), r, g, b,
            cos(350), 0, sin(350), r, g, b,
            cos(0  ), 0, sin(0  ), r, g, b
        ];
        this.glob = new glObj(this.DiscCoords, key);
        this.glob.dist = 15;
    }


    Rot(x, y, z) {
        this.glob.rot(x, y, z);
        this.glob.transform();
        this.glob.drawTriangleFan((this.DiscCoords.length / key), 0);
    }
    Pos(x, y, z) {
        this.Px = x;
        this.Py = y;
        this.Pz = z;
        this.glob.TS(this.Px, this.Py, this.Pz, this.Sx, this.Sy, this.Sz); //unflip
        this.glob.transform();
        this.glob.drawTriangleFan((this.DiscCoords.length / key), 0);
    }
    Scale(x, y, z) {
        this.Sx = x;
        this.Sy = y;
        this.Sz = z;
        this.glob.TS(this.Px, this.Py, this.Pz, this.Sx, this.Sy, this.Sz);
        this.glob.transform();
        this.glob.drawTriangleFan((this.DiscCoords.length / key), 0);
    }

}//prims








