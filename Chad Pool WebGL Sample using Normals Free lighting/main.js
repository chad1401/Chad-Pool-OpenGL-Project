
/*============== Creating a canvas ====================*/
var canvas = document.getElementById('my_Canvas');
gl = canvas.getContext('webgl');
gl.enable(gl.DEPTH_TEST);

//gl.enable(gl.CULL_FACE);
var cam = new camera();

var pi = 3.14;
function cos(num) { return Math.cos(num * Math.PI / 180); }
function sin(num) { return Math.sin(num * Math.PI / 180); }


var playerSpeed = 20;
var playerFacing = 0;

var camx = 0;
var camy = 0;
var camz = 0;

var camAngle = 90;
var camSpeed = 20;


var bullet = null;
var bulletX = 0;
var bulletY = 0;
var bulletZ = 0;
var bulletAngle = 0;



class astroid { // i belive the technical term is 'rock'
    constructor() {
        this.x = Math.random() * 40 - 20 ;
        this.y = Math.random() * 1 - 1;
        this.z = Math.random() * 40 - 20 ;
        this.rx = Math.random() * 360;
        this.ry = Math.random() * 360;
        this.rz = Math.random() * 360;

        this.helth = 1;

        this.prim = new d8(0, 0.3, 0.3);
        this.prim.Pos(this.x, this.y, this.z);
    }

}


var astCount = 40
var astroids = []
for (var i = 0; i < astCount; i++) {
    astroids[i] = new astroid();
}


class grass {
    constructor(x,z) {
        this.x = x*2 - grndCount / (10 *4);
        this.y = -1;
        this.z = z*2 - grndCount / (10 *4);
        this.rx = 0;
        this.ry = 0;
        this.rz = 0;

        this.prim = new ground(0, 0.9, 0.3);

        this.prim.Pos(this.x, this.y - 10, this.z);
    }
}

var grndCount = 1024;
var grnd = []
for (var i = 0; i < grndCount; i++) {
    grnd[i] = new grass(Math.floor(i / 32) - 1, (i % 32) - 1);
    grnd[i].prim.Scale(1.0, 1.0, 1.0);

}

class tree {
    constructor() {
        this.x = Math.random() * 40 - 20;
        this.y = Math.random() * 1 - 0.5;
        this.z = Math.random() * 40 - 20;
        this.rx = 0;
        this.ry = 0;
        this.rz = 0;

        this.log1 = new plane(0.5, 0.4, 0.3);
        this.log1.Rot(90, 0, 0);
        this.log1.Pos(this.x, this.y, this.z);

        this.log2 = new plane(0.5, 0.4, 0.3);
        this.log2.Rot(0, 0, 90);
        this.log2.Pos(this.x, this.y, this.z);

        this.leafCount = 10;
        this.leafs = [];
        for (var i = 0; i < this.leafCount; i++) {
            
            this.leafs[i] = new d8(0.1, 0.7, 0.1);
            this.leafs[i].Rot(0, Math.random() * 30 + 180, 0);
            this.leafs[i].Pos(this.x, this.y + 0.15 * i + 0.1, this.z);
        }
    }
}
var treCount = 40
var trees = []
for (var i = 0; i < astCount; i++) {
    trees[i] = new tree();
}

var lampCount = 7;
var lamps = [];
for (var i = 0; i < lampCount; i++) {
    lamps[i] = new d8(1.0, 1.0, 0.0);
    lamps[i].Scale(1.0, 1.0, 1.0);
}

function findLamp(x, y, z) {

    var lamp = 0;
    for (var i = 0; i < lampCount; i++) {

        if (
            Math.sqrt(Math.pow(x - (lamps[i].Px), 2)     + Math.pow(z - (lamps[i].Pz), 2)    )    < // dist between i and obj
            Math.sqrt(Math.pow(x - (lamps[lamp].Px), 2)  + Math.pow(z - (lamps[lamp].Pz), 2) )    // dist between lamp and obj
        )
        {  
            lamp = i;
        }
    }

    return lamp;
}



var MovingLamps = 2;


setInterval(main, 20);
var time = 0;
cam.rot(0, camAngle, 0); //run cam once before scene start
cam.TS(camx, camy, camz, 1, 1, 1);
function main() {
    time++;
    cam.cls();


    //spotlights
    lamps[0].Pos(sin(time / 3) * 10, 1.0, cos(time / 3) * 10);
    lamps[1].Pos(-sin(time / 3) * 10, 1.0, -cos(time / 3) * 10);



    // static 5 point lights

    lamps[2].Pos(-20,-1.9, 20);
    lamps[3].Pos( 0, -1.9, 20);
    lamps[4].Pos(20, -1.9, 20);
    lamps[5].Pos(20, -1.9,  0);
    lamps[6].Pos(20, -1.9, -20);


    

    //lamp Lights

    for (var i = 0; i < MovingLamps; i++) {
        lamps[i].glob.Lit(lamps[i].Px, lamps[i].Py, lamps[i].Pz);
        
		var lampsResetPlayerPos = false;
		if ((Math.sqrt(Math.pow(-camx - (lamps[i].Px), 2) + Math.pow(-camz - (lamps[i].Pz), 2)) < 5.0)&&lampsResetPlayerPos) {
            camz = 0;
            camx = 0;
            cam.TS(camx, camy, camz, 1, 1, 1);
            
        }
    }


    for (var i = 0; i < treCount; i++) {
        trees[i].log1.Scale(0.25, 1, 0.25);

        var closeLamp = findLamp(trees[i].x, trees[i].y, trees[i].z);
        
        trees[i].log1.glob.Lit(lamps[closeLamp].Px, lamps[closeLamp].Py, lamps[closeLamp].Pz);

        trees[i].log2.Scale(0.25, 1, 0.25);
        trees[i].log2.glob.Lit(lamps[closeLamp].Px, lamps[closeLamp].Py, lamps[closeLamp].Pz);


        for (var j = 0; j < trees[i].leafCount; j++) {

            trees[i].leafs[j].Scale(0.5, 1, 0.5);
            trees[i].leafs[j].glob.Lit(lamps[closeLamp].Px, lamps[closeLamp].Py, lamps[closeLamp].Pz);
 
        }

    }


    for (var i = 0; i < grndCount; i++) {
        grnd[i].prim.Rot(0, 0, 0);//show ground becasue i forgor 

        var closeLamp = findLamp(grnd[i].x, grnd[i].y, grnd[i].z);
        grnd[i].prim.glob.Lit(lamps[closeLamp].Px, lamps[closeLamp].Py, lamps[closeLamp].Pz);
    }



    for (var i = 0; i < astCount; i++) {
        if (astroids[i] != null) {
            
            var closeLamp = findLamp(astroids[i].x, astroids[i].y, astroids[i].z);
            astroids[i].prim.Scale(1.0, 1.0, 1.0);
            astroids[i].prim.Pos(astroids[i].x, astroids[i].y, astroids[i].z);
            astroids[i].prim.glob.Lit(lamps[closeLamp].Px, lamps[closeLamp].Py, lamps[closeLamp].Pz);
        }
    }


    


    if (bullet != null) {
        bullet.Pos(bulletX, bulletY, bulletZ);
        bullet.Scale(0.05, 0.05, 0.05);
        bullet.Rot(90, time, 0);

        bulletZ -= cos(bulletAngle) / (camSpeed / 2);
        bulletX -= sin(bulletAngle) / (camSpeed / 2); 
        


        for (var i = 0; i < astCount; i++) {
            if (astroids[i] != null) {
                if (Math.sqrt(Math.pow(bulletX - astroids[i].x, 2) + Math.pow(bulletY - astroids[i].y, 2) + Math.pow(bulletZ - astroids[i].z, 2)) < 0.5) {
                    bullet = null;
                    astroids[i].helth--;
                    if (astroids[i].helth <= 0) {
                        astroids[i] = null;
                        astroids.x = -999;
                    }
                }
            }
        }

    }




}


//Handle Input
window.addEventListener(
    "keypress",
    function (event) { Press(event.key) }
);


var canstep = true;
function Press(Key) {
    
    if (Key == "e") {
        bulletAngle = camAngle;
        bulletX = -camx;
        bulletY = -camy;
        bulletZ = -camz;
        bullet = new d8(0.5,0.2,0.2);

    }


    if (Key == "w") {

        camz += cos(camAngle) / (camSpeed / 2);
        camx += sin(camAngle) / (camSpeed / 2);
        cam.TS(camx, camy, camz, 1, 1, 1);


        canstep = true;
        for (var i = 0; i < astCount; i++) {
            if (astroids[i] != null) {
                if (Math.sqrt(Math.pow(-camx - astroids[i].x, 2) + Math.pow(-camy - astroids[i].y, 2) + Math.pow(-camz - astroids[i].z, 2)) < 1.4) {
                    canstep = false;
                }
            }
        }

        for (var i = 0; i < treCount; i++) {
            if (trees[i] != null) {
                if (Math.sqrt(Math.pow(-camx - trees[i].x, 2) + Math.pow(-camy - trees[i].y, 2) + Math.pow(-camz - trees[i].z, 2)) < 1.0) {
                    canstep = false;
                }
            }
        }





        if (!canstep) {
            camz -= cos(camAngle) / (camSpeed / 2);
            camx -= sin(camAngle) / (camSpeed / 2);
            cam.TS(camx, camy, camz, 1, 1, 1);
        }
    }
    if (Key == "s") {

        camz -= cos(camAngle) / (camSpeed / 2);
        camx -= sin(camAngle) / (camSpeed / 2);
        cam.TS(camx, camy, camz, 1, 1, 1);


        canstep = true;
        for (var i = 0; i < astCount; i++) {
            if (astroids[i] != null) {
                if (Math.sqrt(Math.pow(-camx - astroids[i].x, 2) + Math.pow(-camy - astroids[i].y, 2) + Math.pow(-camz - astroids[i].z, 2)) < 1.4) {
                    canstep = false;
                }
            }
        }


        for (var i = 0; i < treCount; i++) {
            if (trees[i] != null) {
                if (Math.sqrt(Math.pow(-camx - trees[i].x, 2) + Math.pow(-camy - trees[i].y, 2) + Math.pow(-camz - trees[i].z, 2)) < 1.0) {
                    canstep = false;
                }
            }
        }


        if (!canstep) {
            camz += cos(camAngle) / (camSpeed / 2);
            camx += sin(camAngle) / (camSpeed / 2);
            cam.TS(camx, camy, camz, 1, 1, 1);
        }
    }

    if (Key == "a") {
        camAngle += 10;
        cam.rot(0, camAngle, 0);

    }
    if (Key == "d") {
        camAngle -= 10;
        cam.rot(0, camAngle, 0);
    }
    if (Key == "z") {
        camy += 1 /camSpeed;
        cam.TS(camx, camy, camz, 1, 1, 1);
    }
    if (Key == "x") {
        camy -= 1 /camSpeed;
        cam.TS(camx, camy, camz, 1, 1, 1);
    }


}

function onClick() {
    
}

