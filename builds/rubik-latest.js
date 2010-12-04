var CUBE_SIZE, MATERIAL, MATERIAL_BLACK, MainMenu, MenuItems, Rubik, STROKE_MATERIAL, STROKE_MATERIAL2, ShuffleID, Transitioning, TweenDuration, resetTransition;
MATERIAL = new THREE.MeshFaceMaterial();
STROKE_MATERIAL = new THREE.MeshColorStrokeMaterial(0x000000, 0.2, 2);
STROKE_MATERIAL2 = new THREE.MeshColorStrokeMaterial(0x000000, 0.9, 5);
MATERIAL_BLACK = new THREE.MeshColorFillMaterial(0x000000, 0.8);
CUBE_SIZE = 300;
TweenDuration = 250;
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
    this.parent();
    this.object.facePoint(this.fromss);
    return (Transitioning = false);
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
  }
});
ShuffleID = null;
Rubik.Scene = new Class({
  Impelments: Events,
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
    this.radious = 5000;
    this.onMouseDownTheta = 45;
    this.phi = 60;
    this.onMouseDownPhi = 60;
    this.onMouseDownPosition = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.keyboard = new UserKeyboardShortcuts({
      active: true
    });
    this.keyboard.addShortcuts({
      rotatey: {
        keys: 'shift+q',
        description: 'Rotate Y',
        handler: function(e) {
          e.stop();
          return Rk.rotateY(90);
        }
      },
      rotatex: {
        keys: 'shift+w',
        description: 'Rotate X',
        handler: function(e) {
          e.stop();
          return Rk.rotateX(90);
        }
      },
      rotatez: {
        keys: 'shift+e',
        description: 'Rotate z',
        handler: function(e) {
          e.stop();
          return Rk.rotateZ(90);
        }
      },
      reset: {
        keys: 'r',
        description: 'Reset Cube',
        handler: function(e) {
          e.stop();
          Rk.removeCubes();
          return Rk.buildCube();
        }
      },
      rotatelevel: {
        keys: 'q',
        description: 'Rotate Level',
        handler: (function(e) {
          var _a;
          e.stop();
          return (typeof (_a = this.rollOveredCube) !== "undefined" && _a !== null) ? Rk.rotateLevel(90, Math.round(this.rollOveredCube.position.y)) : null;
        }).bind(this)
      },
      rotaterow: {
        keys: 'e',
        description: 'Rotate Row',
        handler: (function(e) {
          var _a;
          e.stop();
          return (typeof (_a = this.rollOveredCube) !== "undefined" && _a !== null) ? Rk.rotateRow(90, Math.round(this.rollOveredCube.position.z)) : null;
        }).bind(this)
      },
      rotatecolumn: {
        keys: 'w',
        description: 'Rotate Column',
        handler: (function(e) {
          var _a;
          e.stop();
          return (typeof (_a = this.rollOveredCube) !== "undefined" && _a !== null) ? Rk.rotateColumn(90, Math.round(this.rollOveredCube.position.x)) : null;
        }).bind(this)
      },
      rotatelevelb: {
        keys: 'a',
        description: 'Rotate Level (-)',
        handler: (function(e) {
          var _a;
          e.stop();
          return (typeof (_a = this.rollOveredCube) !== "undefined" && _a !== null) ? Rk.rotateLevel(-90, Math.round(this.rollOveredCube.position.y)) : null;
        }).bind(this)
      },
      rotaterowb: {
        keys: 'd',
        description: 'Rotate Row (-)',
        handler: (function(e) {
          var _a;
          e.stop();
          return (typeof (_a = this.rollOveredCube) !== "undefined" && _a !== null) ? Rk.rotateRow(-90, Math.round(this.rollOveredCube.position.z)) : null;
        }).bind(this)
      },
      rotatecolumnb: {
        keys: 's',
        description: 'Rotate Column (-)',
        handler: (function(e) {
          var _a;
          e.stop();
          return (typeof (_a = this.rollOveredCube) !== "undefined" && _a !== null) ? Rk.rotateColumn(-90, Math.round(this.rollOveredCube.position.x)) : null;
        }).bind(this)
      },
      menu: {
        keys: 'esc',
        description: 'Toggle Menu',
        handler: function(e) {
          var _a;
          e.stop();
          mm.Float.toggle();
          if (!(typeof (_a = Scene.stepint) !== "undefined" && _a !== null)) {
            return (Scene.stepint = setInterval(Scene.step.bind(Scene), 1000 / 60));
          } else {
            clearInterval(Scene.stepint);
            return (Scene.stepint = null);
          }
        }
      },
      shuffle: {
        keys: 'x',
        description: 'Shuffle on / off',
        handler: function(e) {
          e.stop();
          if (typeof ShuffleID !== "undefined" && ShuffleID !== null) {
            clearInterval(ShuffleID);
            return (ShuffleID = null);
          } else {
            return (ShuffleID = setInterval(Scene.randomRotation, TweenDuration * 2));
          }
        }
      }
    });
    this.keyboard.showAndChange();
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
    this.scene.addObject(this.ground);
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
    this.stepint = setInterval(this.step.bind(this), 1000 / 60);
    return this;
  },
  randomRotation: function() {
    var a, axis, level;
    level = Math.round(Math.random() * 11);
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
      return Rk.rotateX(90);
    case 4:
      return Rk.rotateY(90);
    case 5:
      return Rk.rotateZ(90);
    case 6:
      return Rk.rotateLevel(-90, a);
    case 7:
      return Rk.rotateColumn(-90, a);
    case 8:
      return Rk.rotateRow(-90, a);
    case 9:
      return Rk.rotateX(-90);
    case 10:
      return Rk.rotateY(-90);
    case 11:
      return Rk.rotateZ(-90);
    }
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
    if (this.rollOveredCube) {
      if (!e.shift && !e.alt) {
        Rk.rotateLevel(90, Math.round(this.rollOveredCube.position.y));
      }
      if (e.shift && !e.alt) {
        Rk.rotateRow(90, Math.round(this.rollOveredCube.position.z));
      }
      return e.alt && e.shift ? Rk.rotateColumn(90, Math.round(this.rollOveredCube.position.x)) : null;
    }
  },
  MouseMove: function(event) {
    event.preventDefault();
    if (this.mouseisdown) {
      this.theta = -((event.client.x - this.onMouseDownPosition.x) * 0.5) + this.onMouseDownTheta;
      this.phi = ((event.client.y - this.onMouseDownPosition.y) * 0.5) + this.onMouseDownPhi;
      this.camera.position.x = this.radious * Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
      this.camera.position.y = this.radious * Math.sin(this.phi * Math.PI / 360);
      this.camera.position.z = this.radious * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
      this.camera.updateMatrix();
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
resetTransition = function() {
  Transitioning = false;
  return this.removeEvent('complete', resetTransition);
};
Rubik.Rubik = new Class({
  initialize: function(scene) {
    this.scene = scene;
    this.cubes = [];
    return this;
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
      return tween.addEvent('complete', resetTransition);
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
      return tween.addEvent('complete', resetTransition);
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
      return tween.addEvent('complete', resetTransition);
    }
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
      return tween.addEvent('complete', resetTransition);
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
      return tween.addEvent('complete', resetTransition);
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
      return tween.addEvent('complete', resetTransition);
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
        cube.base.geometry.faces[1].material = [new THREE.MeshColorFillMaterial(0xffffff, 1)];
      }
      if (Math.round(cube.base.position.y) === 330) {
        cube.base.geometry.faces[5].material = [new THREE.MeshColorFillMaterial(0x00ff00, 1)];
      }
      if (Math.round(cube.base.position.x) === 330) {
        cube.base.geometry.faces[2].material = [new THREE.MeshColorFillMaterial(0x0000ff, 1)];
      }
      if (Math.round(cube.base.position.x) === -330) {
        cube.base.geometry.faces[4].material = [new THREE.MeshColorFillMaterial(0xff0000, 1)];
      }
      if (Math.round(cube.base.position.y) === -330) {
        cube.base.geometry.faces[3].material = [new THREE.MeshColorFillMaterial(0xffff00, 1)];
      }
      if (Math.round(cube.base.position.z) === -330) {
        cube.base.geometry.faces[0].material = [new THREE.MeshColorFillMaterial(0xFF6A00, 1)];
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
MainMenu = new Class({
  initialize: function() {
    this.Float = new Core.Float();
    this.buildMenu();
    $("shower-and-changer").grab(new Element('h2', {
      text: 'Shortcuts'
    }), 'top');
    this.Float.base.addEvent('click:relay(div)', this.mmhandler.bind(this));
    return this;
  },
  mmhandler: function(e) {
    var _a;
    switch (e.target.get('text')) {
    case MenuItems[4]:
      mm.Float.toggle();
      if (!(typeof (_a = Scene.stepint) !== "undefined" && _a !== null)) {
        return (Scene.stepint = setInterval(Scene.step.bind(Scene), 1000 / 60));
      } else {
        clearInterval(Scene.stepint);
        return (Scene.stepint = null);
      }
      break;
    case MenuItems[1]:
      return $("shower-and-changer").getStyle('display') === 'none' ? $("shower-and-changer").setStyle('display', 'block') : $("shower-and-changer").setStyle('display', 'none');
    }
  },
  buildMenu: function() {
    var _a, _b, _c, _d, item;
    _a = []; _c = MenuItems;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      item = _c[_b];
      _a.push(this.Float.base.grab(new Element('div', {
        "class": 'menuitem',
        text: item
      })));
    }
    return _a;
  }
});
MenuItems = ['High Scores', 'Shortcuts', 'Help', 'About', 'Close'];