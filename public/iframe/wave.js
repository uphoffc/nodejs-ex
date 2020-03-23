const THREE = require('three');

class Wave {
  constructor(scene, numCubes, type) {
    this.numCubes = numCubes;

    var geometry = new THREE.BoxGeometry();
    var edges = new THREE.EdgesGeometry(geometry);
    var material = new THREE.MeshPhongMaterial({ color: 0x999999 });
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1.2 });

    this.cubes = [];
    for (var i = 0; i < numCubes; ++i) {
      var cube = new THREE.Mesh(geometry, material);
      var wf = new THREE.LineSegments(edges, lineMaterial);
      scene.add(cube);
      scene.add(wf);
      this.cubes.push({cube: cube, wf: wf});
    }

    switch (type) {
      case 0:
        this.applier = this.PWave;
        break;
      case 1:
        this.applier = this.SWaveY;
        break;
      case 2:
        this.applier = this.SWaveZ;
        break;
    }
    this.type = type;
    this.cp = 4;
    this.cs = 2;

    this.scaleX = 0.9;
    this.scaleYZ = 1.4;
  }

  X(i) {
    return i*this.h-this.r;
  }

  u(X, c) {
    return this.amp*(Math.sin(-X) - Math.sin(c*t-X));
  }

  PWave(i) {
    let X = this.X(i);
    let X0 = X - this.scaleX*0.5*this.h;
    let X1 = X + this.scaleX*0.5*this.h;
    let x0 = X0 + this.u(X0, this.cp);
    let x1 = X1 + this.u(X1, this.cp);
    return (cube) => {
      cube.scale.x = x0-x1;
      cube.position.x = 0.5*(x0+x1);
    }
  }

  SWaveY(i) {
    let X = this.X(i);
    return (cube) => {
      cube.position.y = this.y + this.u(X, this.cs);
    };
  }

  SWaveZ(i) {
    let X = this.X(i);
    return (cube) => {
      cube.position.z = this.u(X, this.cs);
    };
  }

  setBounds(width, height) {
    this.r = width / 2.0 * 1.3;
    this.y = (1-this.type) * height / 3.0;
    this.amp = height / 12.0;
    this.h = 2*this.r / (this.numCubes-1);
    this.cubes.forEach(function(item, i, arr){
      var setPosAndScale = (cube) => {
        cube.position.set(i*this.h-this.r, this.y, 0);
        cube.scale.set(this.scaleX*this.h,this.scaleYZ*this.h,this.scaleYZ*this.h);
      };
      setPosAndScale(item.cube);
      setPosAndScale(item.wf);
    }, this);
  }

  animate(t) {
    this.cubes.forEach(function(item, i, arr){
      let apply = this.applier(i); 
      apply(item.cube);
      apply(item.wf);
    }, this);
  }
}

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); 

var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var numCubes = 41;

var light = new THREE.AmbientLight( 0xffffff, 0.8 ); // soft white light
scene.add(light);

light = new THREE.DirectionalLight( 0xffffff, 0.4 );
light.position.set(0, 0, 1);
scene.add(light);

camera.position.z = 5;

let pwave = new Wave(scene, numCubes, 0);
let swavey = new Wave(scene, numCubes, 1);
let swavez = new Wave(scene, numCubes, 2);

var waves = [];
waves.push(pwave);
waves.push(swavey);
waves.push(swavez);

initAllWaves = () => waves.forEach(function(wave,i,arr){
  let fov = THREE.Math.degToRad(camera.fov);
  let height = 2 * Math.tan(fov / 2) * Math.abs(camera.position.z);
  let width = camera.aspect * height;
  wave.setBounds(width, height);
});

initAllWaves();

function animate(t_ms) {
  t = t_ms / 1000.0;
  waves.forEach(function(wave,i,arr){
    wave.animate(t);
  });
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  initAllWaves();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize, false );

animate();
