var CUBE_MATERIALS, CUBE_SIZE, Game, MATERIAL, MATERIAL_BLACK, MainMenu, Rubik, STROKE_MATERIAL, STROKE_MATERIAL2, ShuffleID, Solving, Transitioning, TweenDuration, resetTransition;
MATERIAL = new THREE.MeshFaceMaterial();
STROKE_MATERIAL = null;
STROKE_MATERIAL2 = new THREE.MeshColorStrokeMaterial(0x000000, 1, 5);
MATERIAL_BLACK = null;
CUBE_SIZE = 300;
CUBE_MATERIALS = [];
CUBE_MATERIALS['white'] = new THREE.MeshColorFillMaterial(0xffffff, 1);
CUBE_MATERIALS['red'] = new THREE.MeshColorFillMaterial(0xff0000, 1);
CUBE_MATERIALS['orange'] = new THREE.MeshColorFillMaterial(0xFF6A00, 1);
CUBE_MATERIALS['yellow'] = new THREE.MeshColorFillMaterial(0xffff00, 1);
CUBE_MATERIALS['blue'] = new THREE.MeshColorFillMaterial(0x0000ff, 1);
CUBE_MATERIALS['green'] = new THREE.MeshColorFillMaterial(0x00ff00, 1);
TweenDuration = 1250;
Rubik = {};
Fx.Three = new Class({
  Extends: Fx,
  options: {
    property: '',
    axis1: 'x',
    axis2: 'y',
    object: null,
    basePos: []
  },
  initialize: function(object, options) {
    this.parent(options);
    this.object = object;
    this.axes = ['x', 'y', 'z'];
    this.axes.erase(this.options.axis1);
    this.axes.erase(this.options.axis2);
    this.axis3 = this.axes[0];
    return this;
  },
  start: function(from, to) {
    var angle;
    this.options.duration = Fx.Durations[TweenDuration] || TweenDuration.toInt();
    this.fromss = from;
    if (!(typeof to !== "undefined" && to !== null)) {
      angle = this.getAngle() * (180 / Math.PI);
      to = angle + from;
      from = angle;
    }
    return this.parent(from, to);
  },
  getRadius: function() {
    var offsetX, offsetY, r;
    offsetX = this.object.position[this.options.axis1];
    offsetY = this.object.position[this.options.axis2];
    return (r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)));
  },
  getAngle: function() {
    var theta;
    theta = Math.atan2(this.object.position[this.options.axis2], this.object.position[this.options.axis1]);
    return theta;
  },
  complete: function() {
    var Transitioning;
    this.object.facePoint(this.fromss);
    this.parent();
    return (Transitioning = false);
  },
  computeOnce: function(to) {
    var angle;
    this.fromss = to;
    angle = this.getAngle() * (180 / Math.PI);
    to = angle + to;
    this.compute(angle, to, 1);
    return this.object.facePoint(this.fromss);
  },
  compute: function(from, to, delta) {
    var offsetTheta, r, rotateX, rotateY, rotation, rotationRadians, theta, theta2;
    theta = this.getAngle();
    r = this.getRadius();
    rotationRadians = Fx.compute(from, to, delta) * (Math.PI / 180);
    offsetTheta = rotationRadians;
    rotateX = r * Math.cos(offsetTheta);
    rotateY = r * Math.sin(offsetTheta);
    this.object['position'][this.options.axis1] = rotateX;
    this.object['position'][this.options.axis2] = rotateY;
    theta2 = this.getAngle();
    switch (this.axis3) {
    case 'z':
      rotation = -((theta * (180 / Math.PI)) - (theta2 * (180 / Math.PI))) * (Math.PI / 180);
      break;
    case 'x':
      rotation = (((theta * (180 / Math.PI)) - (theta2 * (180 / Math.PI))) * (Math.PI / 180));
      break;
    case 'y':
      rotation = (((theta * (180 / Math.PI)) - (theta2 * (180 / Math.PI))) * (Math.PI / 180));
      break;
    }
    return this.object['rotation'][this.axis3] += rotation;
  },
  set: function(step) {
    if (this.options.property === 'rotation') {
      step = step * (Math.PI / 180);
    }
    return this.parent(step);
  }
});
Rubik.Cube = new Class({
  Implements: [Events, Options],
  options: {
    size: CUBE_SIZE,
    duration: TweenDuration
  },
  initialize: function(options) {
    var geometry, size;
    this.setOptions(options);
    size = this.options.size;
    geometry = new Cube(size, size, size);
    this.base = new THREE.Mesh(geometry, [MATERIAL, STROKE_MATERIAL]);
    this.base.facePoint = this.facePoint.bind(this);
    this.setUpTweens();
    return this;
  },
  getPaintedFaces: function() {
    var _a, _b, _c, face, ret;
    ret = [];
    _b = this.base.geometry.faces;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      face = _b[_a];
      if (face.material[0] !== MATERIAL_BLACK) {
        ret.push(face);
      }
    }
    return ret;
  },
  rotateAround: function(a, ax1, ax2, ax3) {
    var offsetTheta, offsetX, offsetY, r, rotateX, rotateY, rotation, rotationRadians, theta;
    offsetX = this.base.position[ax1];
    offsetY = this.base.position[ax2];
    r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
    theta = Math.atan2(this.base.position[ax2], this.base.position[ax1]);
    rotationRadians = a * (Math.PI / 180);
    offsetTheta = theta + rotationRadians;
    rotateX = r * Math.cos(offsetTheta);
    rotateY = r * Math.sin(offsetTheta);
    rotation = (a * (Math.PI / 180));
    this.tweens['position'][ax1].start(rotateX);
    return this.tweens['position'][ax2].start(rotateY);
  },
  rotateMaterialX: function(counter) {
    var tmpmat1, tmpmat2, tmpmat3, tmpmat4;
    if (counter > 0) {
      tmpmat1 = this.base.geometry.faces[0].material[0];
      tmpmat2 = this.base.geometry.faces[3].material[0];
      tmpmat3 = this.base.geometry.faces[1].material[0];
      tmpmat4 = this.base.geometry.faces[5].material[0];
      this.base.geometry.faces[0].material[0] = tmpmat4;
      this.base.geometry.faces[3].material[0] = tmpmat1;
      this.base.geometry.faces[1].material[0] = tmpmat2;
      return (this.base.geometry.faces[5].material[0] = tmpmat3);
    } else {
      tmpmat1 = this.base.geometry.faces[0].material[0];
      tmpmat2 = this.base.geometry.faces[3].material[0];
      tmpmat3 = this.base.geometry.faces[1].material[0];
      tmpmat4 = this.base.geometry.faces[5].material[0];
      this.base.geometry.faces[0].material[0] = tmpmat2;
      this.base.geometry.faces[3].material[0] = tmpmat3;
      this.base.geometry.faces[1].material[0] = tmpmat4;
      return (this.base.geometry.faces[5].material[0] = tmpmat1);
    }
  },
  rotateMaterialY: function(counter) {
    var tmpmat1, tmpmat2, tmpmat3, tmpmat4;
    if (counter > 0) {
      tmpmat1 = this.base.geometry.faces[2].material[0];
      tmpmat2 = this.base.geometry.faces[1].material[0];
      tmpmat3 = this.base.geometry.faces[4].material[0];
      tmpmat4 = this.base.geometry.faces[0].material[0];
      this.base.geometry.faces[2].material[0] = tmpmat4;
      this.base.geometry.faces[1].material[0] = tmpmat1;
      this.base.geometry.faces[4].material[0] = tmpmat2;
      return (this.base.geometry.faces[0].material[0] = tmpmat3);
    } else {
      tmpmat1 = this.base.geometry.faces[2].material[0];
      tmpmat2 = this.base.geometry.faces[1].material[0];
      tmpmat3 = this.base.geometry.faces[4].material[0];
      tmpmat4 = this.base.geometry.faces[0].material[0];
      this.base.geometry.faces[2].material[0] = tmpmat2;
      this.base.geometry.faces[1].material[0] = tmpmat3;
      this.base.geometry.faces[4].material[0] = tmpmat4;
      return (this.base.geometry.faces[0].material[0] = tmpmat1);
    }
  },
  rotateMaterialZ: function(counter) {
    var tmpmat1, tmpmat2, tmpmat3, tmpmat4;
    if (counter > 0) {
      tmpmat1 = this.base.geometry.faces[3].material[0];
      tmpmat2 = this.base.geometry.faces[2].material[0];
      tmpmat3 = this.base.geometry.faces[5].material[0];
      tmpmat4 = this.base.geometry.faces[4].material[0];
      this.base.geometry.faces[3].material[0] = tmpmat4;
      this.base.geometry.faces[2].material[0] = tmpmat1;
      this.base.geometry.faces[5].material[0] = tmpmat2;
      return (this.base.geometry.faces[4].material[0] = tmpmat3);
    } else {
      tmpmat1 = this.base.geometry.faces[3].material[0];
      tmpmat2 = this.base.geometry.faces[2].material[0];
      tmpmat3 = this.base.geometry.faces[5].material[0];
      tmpmat4 = this.base.geometry.faces[4].material[0];
      this.base.geometry.faces[3].material[0] = tmpmat2;
      this.base.geometry.faces[2].material[0] = tmpmat3;
      this.base.geometry.faces[5].material[0] = tmpmat4;
      return (this.base.geometry.faces[4].material[0] = tmpmat1);
    }
  },
  switchFaceMaterial: function(face1, face2) {
    var tempmat;
    tempmat = face1.material[0];
    face1.material[0] = face2.material[0];
    return (face2.material[0] = tempmat);
  },
  facePoint: function(to) {
    var ret, rotx, roty, rotz;
    rotx = this.base.rotation.x * (180 / Math.PI);
    roty = this.base.rotation.y * (180 / Math.PI);
    rotz = this.base.rotation.z * (180 / Math.PI);
    ret = [];
    if (rotx !== 0) {
      this.base.rotation.x = 0;
      this.rotateMaterialX(to);
    }
    if (roty !== 0) {
      this.base.rotation.y = 0;
      this.rotateMaterialY(to);
    }
    if (rotz !== 0) {
      this.base.rotation.z = 0;
      return this.rotateMaterialZ(to);
    }
  },
  setUpTweens: function() {
    this.tweens = [];
    this.tweens['rotation'] = [];
    this.tweens['position'] = [];
    this.tweens['rotation']['x'] = new Fx.Three(this.base, {
      property: 'rotation',
      axis1: 'z',
      axis2: 'y',
      duration: this.options.duration
    });
    this.tweens['rotation']['y'] = new Fx.Three(this.base, {
      property: 'rotation',
      axis1: 'x',
      axis2: 'z',
      duration: this.options.duration
    });
    this.tweens['rotation']['z'] = new Fx.Three(this.base, {
      property: 'rotation',
      axis1: 'x',
      axis2: 'y',
      duration: this.options.duration
    });
    this.tweens['position']['x'] = new Fx.Three(this.base, {
      property: 'position',
      axis: 'x',
      duration: this.options.duration
    });
    this.tweens['position']['y'] = new Fx.Three(this.base, {
      property: 'position',
      axis: 'y',
      duration: this.options.duration
    });
    return (this.tweens['position']['z'] = new Fx.Three(this.base, {
      property: 'position',
      axis: 'z',
      duration: this.options.duration
    }));
  },
  rotateX: function(to) {
    return this.tweens['rotation']['x'].start(to);
  },
  rotateY: function(to) {
    return this.tweens['rotation']['y'].start(to);
  },
  rotateZ: function(to) {
    return this.tweens['rotation']['z'].start(to);
  },
  moveX: function(to) {
    return this.tweens['position']['x'].start(to);
  },
  moveY: function(to) {
    return this.tweens['position']['y'].start(to);
  },
  moveZ: function(to) {
    return this.tweens['position']['z'].start(to);
  },
  rotX: function(to) {
    return this.tweens['rotation']['x'].computeOnce(to);
  },
  rotY: function(to) {
    return this.tweens['rotation']['y'].computeOnce(to);
  },
  rotZ: function(to) {
    return this.tweens['rotation']['z'].computeOnce(to);
  }
});
ShuffleID = null;
Rubik.Scene = new Class({
  Implements: Events,
  loadTexture: function(url) {
    var material, texture;
    material = new THREE.MeshBitmapMaterial(this.texture_placeholder);
    texture = new Image();
    texture.onload = function() {
      return (material.bitmap = this);
    };
    texture.src = url;
    return material;
  },
  initialize: function() {
    var light1, light2, light4;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.theta = 45;
    this.radious = 4000;
    this.onMouseDownTheta = 45;
    this.phi = 60;
    this.onMouseDownPhi = 60;
    this.onMouseDownPosition = {};
    this.mouseX = 0;
    this.mouseY = 0;
    /*@keyboard = new UserKeyboardShortcuts({active:true});
    @keyboard.addShortcuts {
      plusduration: {
        keys:'+'
        description: 'Increment rotation duration'
        handler: (e)->
          e.stop()
          TweenDuration += 10
      }
      minusduration: {
        keys:'-'
        description: 'decrement rotation duration'
        handler: (e)->
          e.stop()
          TweenDuration -= 10
      }
      rotatey: {
        keys:'shift+q'
        description: 'Rotate Y'
        handler: (e)->
          e.stop()
          Rk.rotateY(90)
      }
      rotatex: {
        keys:'shift+w'
        description: 'Rotate X'
        handler: (e) ->
          e.stop()
          Rk.rotateX(90)
      }
      rotatez: {
        keys:'shift+e'
        description: 'Rotate z'
        handler: (e) ->
          e.stop()
          Rk.rotateZ(90)
      }
      reset: {
        keys:'r'
        description: 'Reset Cube'
        handler: (e) ->
          e.stop()
          Rk.removeCubes()
          Rk.buildCube()
      }
      rotatelevel: {
        keys:'q'
        description: 'Rotate Level'
        handler: ( (e)->
          e.stop()
          if @rollOveredCube?
            Rk.rotateLevel(90,Math.round(@rollOveredCube.position.y))
        ).bind @
      }
      rotaterow: {
        keys:'e'
        description: 'Rotate Row'
        handler: ( (e) ->
          e.stop()
          if @rollOveredCube?
            Rk.rotateRow(90,Math.round(@rollOveredCube.position.z))
        ).bind @
      }
      rotatecolumn: {
        keys:'w'
        description: 'Rotate Column'
        handler: ( (e)->
          e.stop()
          if @rollOveredCube?
            Rk.rotateColumn(90,Math.round(@rollOveredCube.position.x))
        ).bind @
      }

      rotatelevelb: {
        keys:'a'
        description: 'Rotate Level (-)'
        handler: ( (e)->
          e.stop()
          if @rollOveredCube?
            Rk.rotateLevel(-90,Math.round(@rollOveredCube.position.y))
        ).bind @
      }
      rotaterowb: {
        keys:'d'
        description: 'Rotate Row (-)'
        handler: ( (e) ->
          e.stop()
          if @rollOveredCube?
            Rk.rotateRow(-90,Math.round(@rollOveredCube.position.z))
        ).bind @
      }
      rotatecolumnb: {
        keys:'s'
        description: 'Rotate Column (-)'
        handler: ( (e)->
          e.stop()
          if @rollOveredCube?
            Rk.rotateColumn(-90,Math.round(@rollOveredCube.position.x))
        ).bind @
      }
      menu: {
        keys:'esc'
        description: 'Toggle Menu'
        handler: (e) ->
          e.stop()
          mm.Float.toggle()
          if not Scene.stepint?
            Scene.stepint = setInterval Scene.step.bind(Scene), 1000/60
          else
            clearInterval Scene.stepint
            Scene.stepint = null
      }
      shuffle: {
        keys:'x'
        description: 'Shuffle on / off'
        handler: (e) ->
          e.stop()
          if ShuffleID?
            clearInterval(ShuffleID)
            ShuffleID = null
          else
            ShuffleID = setInterval(Scene.randomRotation,TweenDuration*2)
      }
      ground: {
        keys:'g'
        description: 'Ground on / off'
        handler: (e) ->
          e.stop()
          if Scene.scene.objects.indexOf( Scene.ground ) >= 0
            Scene.scene.removeObject Scene.ground
          else
            Scene.scene.addObject Scene.ground

      }

    }
    @keyboard.showAndChange()
    */
    this.texture_placeholder = document.createElement('canvas');
    this.texture_placeholder.width = 128;
    this.texture_placeholder.height = 128;
    this.camera = new THREE.Camera(50, this.width / this.height, 1, 10000);
    this.camera.position.x = this.radious * Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
    this.camera.position.y = this.radious * Math.sin(this.phi * Math.PI / 360);
    this.camera.position.z = this.radious * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
    this.scene = new THREE.Scene();
    this.projector = new THREE.Projector();
    this.mouse2D = new THREE.Vector3(0, 10000, 0.5);
    this.ray = new THREE.Ray(this.camera.position, null);
    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setSize(this.width, this.height);
    this.ground = new THREE.Mesh(new Plane(2500, 2500, 10, 10), [this.loadTexture('textures/backdrop3.png')]);
    this.ground.rotation.x = -90 * (Math.PI / 180);
    this.ground.position.y = -900;
    this.ground.doublesided = true;
    light1 = new THREE.PointLight(0xdddddd);
    this.scene.addLight(light1);
    light1.position.y = 5000;
    light4 = new THREE.PointLight(0xdddddd);
    this.scene.addLight(light4);
    light4.position.y = -5000;
    light2 = new THREE.PointLight(0xffffff);
    this.scene.addLight(light2);
    light2.position.y = 0;
    light2.position.x = 2000;
    light2.position.z = 2000;
    light1 = new THREE.PointLight(0xffffff);
    this.scene.addLight(light1);
    light1.position.y = 0;
    light1.position.x = -2000;
    light1.position.z = -2000;
    document.body.grab(this.renderer.domElement);
    this.mouseisdown = false;
    document.addEvent('mousemove', this.MouseMove.bind(this));
    document.addEvent('mousewheel', this.MouseWheel.bind(this));
    document.addEvent('mousedown', this.MouseDown.bind(this));
    document.addEvent('mouseup', this.MouseUp.bind(this));
    document.addEventListener('touchstart', this.touchstart.bind(this));
    document.addEventListener('touchmove', this.touchmove.bind(this));
    this.stepint = setInterval(this.step.bind(this), 1000 / 60);
    return this;
  },
  shuffle: function() {
    var a, axis, level;
    level = Math.round(Math.random() * 5);
    axis = Math.round(Math.random() * 2);
    switch (axis) {
    case 0:
      a = -330;
      break;
    case 1:
      a = 0;
      break;
    case 2:
      a = 330;
      break;
    }
    switch (level) {
    case 0:
      return Rk.rotLevel(90, a);
    case 1:
      return Rk.rotColumn(90, a);
    case 2:
      return Rk.rotRow(90, a);
    case 3:
      return Rk.rotLevel(-90, a);
    case 4:
      return Rk.rotColumn(-90, a);
    case 5:
      return Rk.rotRow(-90, a);
    }
  },
  randomRotation: function() {
    var a, axis, level;
    level = Math.round(Math.random() * 5);
    axis = Math.round(Math.random() * 2);
    switch (axis) {
    case 0:
      a = -330;
      break;
    case 1:
      a = 0;
      break;
    case 2:
      a = 330;
      break;
    }
    switch (level) {
    case 0:
      return Rk.rotateLevel(90, a);
    case 1:
      return Rk.rotateColumn(90, a);
    case 2:
      return Rk.rotateRow(90, a);
    case 3:
      return Rk.rotateLevel(-90, a);
    case 4:
      return Rk.rotateColumn(-90, a);
    case 5:
      return Rk.rotateRow(-90, a);
    }
  },
  touchstart: function(e) {
    this.randomRotation();
    e.preventDefault();
    event.client = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY
    };
    this.mouseisdown = true;
    this.onMouseDownTheta = this.theta;
    this.onMouseDownPhi = this.phi;
    this.onMouseDownPosition.x = e.client.x;
    this.onMouseDownPosition.y = e.client.y;
    return console.log(e);
  },
  touchmove: function(event) {
    event.preventDefault();
    event.client = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY
    };
    if (this.mouseisdown) {
      this.theta = -((event.client.x - this.onMouseDownPosition.x) * 0.5) + this.onMouseDownTheta;
      this.phi = ((event.client.y - this.onMouseDownPosition.y) * 0.5) + this.onMouseDownPhi;
      this.positionCamera(event);
    }
    this.mouse2D.x = (event.client.x / this.width) * 2 - 1;
    return (this.mouse2D.y = -(event.client.y / this.height) * 2 + 1);
  },
  MouseDown: function(e) {
    this.mouseisdown = true;
    this.onMouseDownTheta = this.theta;
    this.onMouseDownPhi = this.phi;
    this.onMouseDownPosition.x = e.client.x;
    return (this.onMouseDownPosition.y = e.client.y);
  },
  MouseUp: function(e) {
    this.mouseisdown = false;
    this.onMouseDownPosition.x = e.client.x - this.onMouseDownPosition.x;
    return (this.onMouseDownPosition.y = e.client.y - this.onMouseDownPosition.y);
  },
  MouseWheel: function(e) {
    e.stop();
    this.radious += e.wheel * 400;
    return this.positionCamera(e);
  },
  positionCamera: function(event) {
    this.camera.position.x = this.radious * Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
    this.camera.position.y = this.radious * Math.sin(this.phi * Math.PI / 360);
    this.camera.position.z = this.radious * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
    return this.camera.updateMatrix();
  },
  MouseMove: function(event) {
    event.preventDefault();
    if (this.mouseisdown) {
      this.theta = -((event.client.x - this.onMouseDownPosition.x) * 0.5) + this.onMouseDownTheta;
      this.phi = ((event.client.y - this.onMouseDownPosition.y) * 0.5) + this.onMouseDownPhi;
      this.positionCamera(event);
    }
    this.mouse2D.x = (event.client.x / this.width) * 2 - 1;
    return (this.mouse2D.y = -(event.client.y / this.height) * 2 + 1);
  },
  step: function() {
    var _a, _b, intersects;
    this.mouse3D = this.projector.unprojectVector(this.mouse2D.clone(), this.camera);
    this.ray.direction = this.mouse3D.subSelf(this.camera.position).normalize();
    intersects = this.ray.intersectScene(this.scene);
    if (intersects.length > 0) {
      if (intersects[0].object !== this.ground) {
        if (typeof (_a = this.rollOveredCube) !== "undefined" && _a !== null) {
          if (this.rollOveredCube !== intersects[0].object) {
            this.rollOveredCube.material[1] = STROKE_MATERIAL;
          }
        }
        this.rollOveredCube = intersects[0].object;
        intersects[0].object.material[1] = STROKE_MATERIAL2;
      }
    } else if (typeof (_b = this.rollOveredCube) !== "undefined" && _b !== null) {
      this.rollOveredCube.material[1] = STROKE_MATERIAL;
      this.rollOveredCube = null;
    }
    return this.renderer.render(this.scene, this.camera);
  }
});
Transitioning = false;
Solving = false;
resetTransition = function() {
  Transitioning = false;
  this.removeEvent('complete', resetTransition);
  console.log(Rk.checkSolve());
  return Scene.fireEvent('check');
};
Rubik.Rubik = new Class({
  Implements: Events,
  initialize: function(scene) {
    this.scene = scene;
    this.cubes = [];
    this.history = [];
    return this;
  },
  solveHistory: function() {
    this.hid = setInterval(this.historyStepBack.bind(this), TweenDuration * 2);
    return (Solving = true);
  },
  historyStepBack: function() {
    var laststep;
    if (this.history.length > 0) {
      laststep = this.history.pop();
      switch (laststep.type) {
      case "rotateX":
        return this.rotateX(laststep.value);
      case "rotateY":
        return this.rotateY(laststep.value);
      case "rotateZ":
        return this.rotateZ(laststep.value);
      case "rotateLevel":
        return this.rotateLevel(laststep.value, laststep.level);
      case "rotateColumn":
        return this.rotateColumn(laststep.value, laststep.level);
      case "rotateRow":
        return this.rotateRow(laststep.value, laststep.level);
      }
    } else {
      Solving = false;
      return clearInterval(this.hid);
    }
  },
  rotateX: function(x) {
    var _a, _b, _c, cube, tween;
    if (!Transitioning) {
      Transitioning = true;
      _b = this.cubes;
      for (_a = 0, _c = _b.length; _a < _c; _a++) {
        cube = _b[_a];
        tween = cube.rotateX(x);
      }
      tween.addEvent('complete', resetTransition);
      return !Solving ? this.history.push({
        type: 'rotateX',
        value: -x
      }) : null;
    }
  },
  rotateY: function(x) {
    var _a, _b, _c, cube, tween;
    if (!Transitioning) {
      Transitioning = true;
      _b = this.cubes;
      for (_a = 0, _c = _b.length; _a < _c; _a++) {
        cube = _b[_a];
        tween = cube.rotateY(x);
      }
      tween.addEvent('complete', resetTransition);
      return !Solving ? this.history.push({
        type: 'rotateY',
        value: -x
      }) : null;
    }
  },
  rotateZ: function(x) {
    var _a, _b, _c, cube, tween;
    if (!Transitioning) {
      Transitioning = true;
      _b = this.cubes;
      for (_a = 0, _c = _b.length; _a < _c; _a++) {
        cube = _b[_a];
        tween = cube.rotateZ(x);
      }
      tween.addEvent('complete', resetTransition);
      return !Solving ? this.history.push({
        type: 'rotateZ',
        value: -x
      }) : null;
    }
  },
  rotLevel: function(x, level) {
    var _a, _b, _c, cube, tween;
    _b = this.cubes;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      cube = _b[_a];
      if (Math.round(cube.base.position.y) === level) {
        tween = cube.rotY(x);
      }
    }
    return this.history.push({
      type: 'rotateLevel',
      value: -x,
      level: level
    });
  },
  rotRow: function(x, level) {
    var _a, _b, _c, cube, tween;
    _b = this.cubes;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      cube = _b[_a];
      if (Math.round(cube.base.position.z) === level) {
        tween = cube.rotZ(x);
      }
    }
    return this.history.push({
      type: 'rotateRow',
      value: -x,
      level: level
    });
  },
  rotColumn: function(x, level) {
    var _a, _b, _c, cube, tween;
    _b = this.cubes;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      cube = _b[_a];
      if (Math.round(cube.base.position.x) === level) {
        tween = cube.rotX(x);
      }
    }
    return this.history.push({
      type: 'rotateColumn',
      value: -x,
      level: level
    });
  },
  rotateLevel: function(x, level) {
    var _a, _b, _c, cube, tween;
    if (!Transitioning) {
      Transitioning = true;
      _b = this.cubes;
      for (_a = 0, _c = _b.length; _a < _c; _a++) {
        cube = _b[_a];
        if (Math.round(cube.base.position.y) === level) {
          tween = cube.rotateY(x);
        }
      }
      tween.addEvent('complete', resetTransition);
      if (!Solving) {
        this.history.push({
          type: 'rotateLevel',
          value: -x,
          level: level
        });
      }
      return this.fireEvent('step', new Rubik.Step('rotateLevel', -x, level));
    }
  },
  rotateColumn: function(x, level) {
    var _a, _b, _c, cube, tween;
    if (!Transitioning) {
      Transitioning = true;
      _b = this.cubes;
      for (_a = 0, _c = _b.length; _a < _c; _a++) {
        cube = _b[_a];
        if (Math.round(cube.base.position.x) === level) {
          tween = cube.rotateX(x);
        }
      }
      tween.addEvent('complete', resetTransition);
      if (!Solving) {
        this.history.push({
          type: 'rotateColumn',
          value: -x,
          level: level
        });
      }
      return this.fireEvent('step', new Rubik.Step('rotateColumn', -x, level));
    }
  },
  rotateRow: function(x, level) {
    var _a, _b, _c, cube, tween;
    if (!Transitioning) {
      Transitioning = true;
      _b = this.cubes;
      for (_a = 0, _c = _b.length; _a < _c; _a++) {
        cube = _b[_a];
        if (Math.round(cube.base.position.z) === level) {
          tween = cube.rotateZ(x);
        }
      }
      tween.addEvent('complete', resetTransition);
      if (!Solving) {
        this.history.push({
          type: 'rotateRow',
          value: -x,
          level: level
        });
      }
      return this.fireEvent('step', new Rubik.Step('rotateRow', -x, level));
    }
  },
  removeCubes: function() {
    var _a, _b, _c, cube;
    _b = this.cubes;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      cube = _b[_a];
      this.scene.scene.removeObject(cube.base);
    }
    return this.cubes.empty();
  },
  checkSolve: function() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, cube, tmpmat, x330, xm330, y330, ym330, z330, zm330;
    z330 = this.cubes.filter(function(cube) {
      return Math.round(cube.base.position.z) === 330 ? true : false;
    });
    zm330 = this.cubes.filter(function(cube) {
      return Math.round(cube.base.position.z) === -330 ? true : false;
    });
    y330 = this.cubes.filter(function(cube) {
      return Math.round(cube.base.position.y) === 330 ? true : false;
    });
    ym330 = this.cubes.filter(function(cube) {
      return Math.round(cube.base.position.y) === -330 ? true : false;
    });
    x330 = this.cubes.filter(function(cube) {
      return Math.round(cube.base.position.x) === 330 ? true : false;
    });
    xm330 = this.cubes.filter(function(cube) {
      return Math.round(cube.base.position.x) === -330 ? true : false;
    });
    tmpmat = z330[0].base.geometry.faces[1].material[0];
    _b = z330;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      cube = _b[_a];
      if (cube.base.geometry.faces[1].material[0] !== tmpmat) {
        return false;
      }
    }
    tmpmat = zm330[0].base.geometry.faces[0].material[0];
    _e = zm330;
    for (_d = 0, _f = _e.length; _d < _f; _d++) {
      cube = _e[_d];
      if (cube.base.geometry.faces[0].material[0] !== tmpmat) {
        return false;
      }
    }
    tmpmat = y330[0].base.geometry.faces[5].material[0];
    _h = y330;
    for (_g = 0, _i = _h.length; _g < _i; _g++) {
      cube = _h[_g];
      if (cube.base.geometry.faces[5].material[0] !== tmpmat) {
        return false;
      }
    }
    tmpmat = ym330[0].base.geometry.faces[3].material[0];
    _k = ym330;
    for (_j = 0, _l = _k.length; _j < _l; _j++) {
      cube = _k[_j];
      if (cube.base.geometry.faces[3].material[0] !== tmpmat) {
        return false;
      }
    }
    tmpmat = x330[0].base.geometry.faces[2].material[0];
    _n = x330;
    for (_m = 0, _o = _n.length; _m < _o; _m++) {
      cube = _n[_m];
      if (cube.base.geometry.faces[2].material[0] !== tmpmat) {
        return false;
      }
    }
    tmpmat = xm330[0].base.geometry.faces[4].material[0];
    _q = xm330;
    for (_p = 0, _r = _q.length; _p < _r; _p++) {
      cube = _q[_p];
      if (cube.base.geometry.faces[4].material[0] !== tmpmat) {
        return false;
      }
    }
    return true;
  },
  buildCube: function() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, cube, face, i, j, k;
    for (i = 0; i <= 2; i++) {
      for (j = 0; j <= 2; j++) {
        for (k = 0; k <= 2; k++) {
          cube = new Rubik.Cube();
          cube.base.position.x = 330 * (i - 1);
          cube.base.position.y = 330 * (j - 1);
          cube.base.position.z = 330 * (k - 1);
          cube.base.doublesided = true;
          this.cubes.push(cube);
          this.scene.scene.addObject(cube.base);
        }
      }
    }
    _b = this.cubes;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      cube = _b[_a];
      if (Math.round(cube.base.position.z) === 330) {
        cube.base.geometry.faces[1].material = [CUBE_MATERIALS['white']];
      }
      if (Math.round(cube.base.position.y) === 330) {
        cube.base.geometry.faces[5].material = [CUBE_MATERIALS['green']];
      }
      if (Math.round(cube.base.position.x) === 330) {
        cube.base.geometry.faces[2].material = [CUBE_MATERIALS['blue']];
      }
      if (Math.round(cube.base.position.x) === -330) {
        cube.base.geometry.faces[4].material = [CUBE_MATERIALS['red']];
      }
      if (Math.round(cube.base.position.y) === -330) {
        cube.base.geometry.faces[3].material = [CUBE_MATERIALS['yellow']];
      }
      if (Math.round(cube.base.position.z) === -330) {
        cube.base.geometry.faces[0].material = [CUBE_MATERIALS['orange']];
      }
    }
    _d = []; _f = this.cubes;
    for (_e = 0, _g = _f.length; _e < _g; _e++) {
      cube = _f[_e];
      _d.push((function() {
        _h = []; _j = cube.base.geometry.faces;
        for (_i = 0, _k = _j.length; _i < _k; _i++) {
          face = _j[_i];
          _h.push(face.material[0] === undefined ? (face.material = [MATERIAL_BLACK]) : null);
        }
        return _h;
      })());
    }
    return _d;
  }
});
Rubik.History = new Class({
  initialize: function() {
    return this;
  }
});
Rubik.Step = new Class({
  initialize: function(type, value, level) {
    this.type = type;
    this.value = value;
    return (this.level = level);
  }
});
Game = null;
MainMenu = new Class({
  initialize: function() {
    var _a;
    $("menu").addEvent('click:relay(li)', this.mmhandler.bindWithEvent(this));
    this.el = new Element('div', {
      "class": 'wrapper'
    });
    this.el.set('tween', {
      duration: "250ms"
    });
    $$('.menu_wrapper').set('tween', {
      duration: "250ms"
    });
    $$('.time_wrapper, .steps_wrapper').position();
    $$('.time_wrapper').setStyle('top', 10);
    $$('.steps_wrapper').setStyle('top', 65);
    this.controlsHeight = 0;
    this.menuHeight = 0;
    if (typeof (_a = $("shower-and-changer")) !== "undefined" && _a !== null) {
      this.el.wraps($("shower-and-changer"));
      $$(".controls_toggle")[0].addEvent('click', (function() {
        if (this.controlsHeight === 0) {
          this.controlsHeight = this.el.getSize().y;
        }
        return this.el.getSize().y === 0 ? this.el.tween('height', this.controlsHeight) : this.el.tween('height', 0);
      }).bind(this));
    }
    $$(".menu_toggle")[0].addEvent('click', (function() {
      if (this.menuHeight === 0) {
        this.menuHeight = $$('.menu_wrapper')[0].getSize().y;
      }
      return $$('.menu_wrapper')[0].getSize().y === 0 ? $$('.menu_wrapper')[0].tween('height', this.menuHeight) : $$('.menu_wrapper')[0].tween('height', 0);
    }).bind(this));
    return this;
  },
  mmhandler: function(e) {
    console.log(e.target.get('rel'));
    switch (e.target.get('rel')) {
    case 'new':
      if (typeof Game !== "undefined" && Game !== null) {
        Game.stop();
      }
      Game = new Rubik.Game();
      return Game.start();
    }
  }
});
Rubik.Game = new Class({
  Implements: [Events, Options],
  options: {
    speed: 1000
  },
  initialize: function(options) {
    this.setOptions(options);
    this.steps = 0;
    this.shuffled = false;
    this.time = 0;
    Scene.addEvent('check', (function() {
      return Rk.checkSolve() ? this.stop() : null;
    }).bindWithEvent(this));
    return this;
  },
  create: function() {},
  shuffle: function() {
    var _a, i;
    _a = [];
    for (i = 0; i <= 18; i++) {
      _a.push(Scene.shuffle());
    }
    return _a;
  },
  start: function() {
    this.history = new Rubik.History();
    Rk.addEvent('step', (function() {
      this.steps++;
      return $('steps').set('text', "Steps: " + this.steps);
    }).bindWithEvent(this));
    this.id = setInterval(this.timer.bind(this), this.options.speed);
    return this.shuffle();
  },
  timer: function() {
    this.time += 1;
    this.elapsed = "Time: " + Math.floor(this.time / 60 / 60) + ":" + Math.floor(this.time / 60) + ":" + this.time % 60;
    $('time').set('text', this.elapsed);
    return console.log(this.elapsed);
  },
  stop: function() {
    console.log('stopping');
    console.log('game ended');
    console.log('Time:' + this.elapsed);
    console.log('Steps:' + this.steps);
    clearInterval(this.id);
    return (this.id = null);
  },
  pause: function() {
    var _a;
    return (typeof (_a = this.id) !== "undefined" && _a !== null) ? clearInterval(this.id) : (this.id = setInterval(this.timer.bind(this), this.options.speed));
  }
});