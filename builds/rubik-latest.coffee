MATERIAL = new THREE.MeshFaceMaterial()
STROKE_MATERIAL = new THREE.MeshColorStrokeMaterial 0x000000, 0.2 ,2
STROKE_MATERIAL2 = new THREE.MeshColorStrokeMaterial 0x000000, 0.9 ,5
MATERIAL_BLACK = new THREE.MeshColorFillMaterial( 0x000000, 0.8 )
CUBE_SIZE = 300
CUBE_MATERIALS = []
CUBE_MATERIALS['white'] = new THREE.MeshColorFillMaterial( 0xffffff, 1 )
CUBE_MATERIALS['red'] = new THREE.MeshColorFillMaterial( 0xff0000, 1 )
CUBE_MATERIALS['orange'] = new THREE.MeshColorFillMaterial( 0xFF6A00, 1 )
CUBE_MATERIALS['yellow'] = new THREE.MeshColorFillMaterial( 0xffff00, 1 )
CUBE_MATERIALS['blue'] = new THREE.MeshColorFillMaterial( 0x0000ff, 1 )
CUBE_MATERIALS['green'] = new THREE.MeshColorFillMaterial( 0x00ff00, 1 )
TweenDuration = 250
Rubik = {}


Fx.Three = new Class {
  Extends: Fx
  options: {
    property: '' # position/rotation/scale
    axis1: 'x' # x/y/z
    axis2: 'y'
    object: null
    basePos: []
  }
  initialize: (object,options) ->
    @parent options
    @object = object
    @axes = ['x','y','z']
    @axes.erase @options.axis1
    @axes.erase @options.axis2
    @axis3 = @axes[0]
    @
    
  start: (from, to) ->
    @options.duration = Fx.Durations[TweenDuration] || TweenDuration.toInt()
    @fromss = from
    if not to?
      angle =  @getAngle()* (180/Math.PI)
      to = angle+from
      from = angle
    @parent from, to
  
  getRadius: ->
    offsetX = @object.position[@options.axis1]
    offsetY = @object.position[@options.axis2]

    r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2))
 
  getAngle: ->
    theta = Math.atan2(@object.position[@options.axis2],@object.position[@options.axis1])
    theta
  complete: ->
    @parent()
    @object.facePoint(@fromss)
    Transitioning = false
  computeOnce: (to) ->
    @fromss = to
    angle =  @getAngle()* (180/Math.PI)
    to = angle+to
    @compute angle,to,1
    @object.facePoint(@fromss)
  compute: (from, to, delta)->
    theta = @getAngle()
    r = @getRadius()
    
    rotationRadians = Fx.compute(from, to, delta) * (Math.PI/180)
    offsetTheta = rotationRadians
    rotateX = r * Math.cos(offsetTheta)
    rotateY =  r * Math.sin(offsetTheta)
    #console.log Fx.compute(from, to, delta)
    @object['position'][@options.axis1] = rotateX
    @object['position'][@options.axis2] = rotateY
    
    theta2 = @getAngle()
    
    switch @axis3 
      when 'z'
        rotation = -((theta * (180/Math.PI)) - (theta2 * (180/Math.PI)))*(Math.PI/180)
      when 'x'
        rotation = (((theta * (180/Math.PI)) - (theta2 * (180/Math.PI)))*(Math.PI/180))
      when 'y'
        rotation = (((theta * (180/Math.PI)) - (theta2 * (180/Math.PI)))*(Math.PI/180))
    @object['rotation'][@axis3] += rotation
  set: (step) -> 
    if @options.property == 'rotation'
      step = step * (Math.PI/180)
    @parent step

}


Rubik.Cube = new Class {
  Implements: [Events, Options]
  options:{
    size: CUBE_SIZE
    duration: TweenDuration
  }
  initialize: (options) ->
    @setOptions options
    size = @options.size
    geometry = new Cube size, size, size
    @base = new THREE.Mesh geometry, [MATERIAL, STROKE_MATERIAL]
    @base.facePoint = @facePoint.bind @
    @setUpTweens()
    @
  
  getPaintedFaces: ->
    ret = []
    for face in @base.geometry.faces
      if face.material[0] isnt MATERIAL_BLACK
        ret.push face
    ret
  
  rotateAround: (a,ax1,ax2,ax3) ->
    offsetX = @base.position[ax1]
    offsetY = @base.position[ax2]

    r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2))
    theta = Math.atan2(@base.position[ax2],@base.position[ax1])
    
    rotationRadians = a * (Math.PI/180)
    offsetTheta = theta + rotationRadians
    rotateX = r * Math.cos(offsetTheta)
    rotateY =  r * Math.sin(offsetTheta)
    rotation = (a*(Math.PI/180)) 
    #cube.rotation[ax3] += rev?-rotation:rotation
    @tweens['position'][ax1].start rotateX
    @tweens['position'][ax2].start rotateY
    
    #cube.position[ax1] = rotateX
    #cube.position[ax2] = rotateY
  rotateMaterialX: (counter) ->
    if counter > 0
      tmpmat1 = @base.geometry.faces[0].material[0]
      tmpmat2 = @base.geometry.faces[3].material[0]
      tmpmat3 = @base.geometry.faces[1].material[0]
      tmpmat4 = @base.geometry.faces[5].material[0]
      @base.geometry.faces[0].material[0] = tmpmat4
      @base.geometry.faces[3].material[0] = tmpmat1
      @base.geometry.faces[1].material[0] = tmpmat2
      @base.geometry.faces[5].material[0] = tmpmat3
    else
      tmpmat1 = @base.geometry.faces[0].material[0]
      tmpmat2 = @base.geometry.faces[3].material[0]
      tmpmat3 = @base.geometry.faces[1].material[0]
      tmpmat4 = @base.geometry.faces[5].material[0]
      @base.geometry.faces[0].material[0] = tmpmat2
      @base.geometry.faces[3].material[0] = tmpmat3
      @base.geometry.faces[1].material[0] = tmpmat4
      @base.geometry.faces[5].material[0] = tmpmat1
    
  rotateMaterialY: (counter) ->
    if counter > 0
      tmpmat1 = @base.geometry.faces[2].material[0]
      tmpmat2 = @base.geometry.faces[1].material[0]
      tmpmat3 = @base.geometry.faces[4].material[0]
      tmpmat4 = @base.geometry.faces[0].material[0]
      @base.geometry.faces[2].material[0] = tmpmat4
      @base.geometry.faces[1].material[0] = tmpmat1
      @base.geometry.faces[4].material[0] = tmpmat2
      @base.geometry.faces[0].material[0] = tmpmat3
    else
      tmpmat1 = @base.geometry.faces[2].material[0]
      tmpmat2 = @base.geometry.faces[1].material[0]
      tmpmat3 = @base.geometry.faces[4].material[0]
      tmpmat4 = @base.geometry.faces[0].material[0]
      @base.geometry.faces[2].material[0] = tmpmat2
      @base.geometry.faces[1].material[0] = tmpmat3
      @base.geometry.faces[4].material[0] = tmpmat4
      @base.geometry.faces[0].material[0] = tmpmat1
    
  rotateMaterialZ: (counter) ->
    if counter > 0
      tmpmat1 = @base.geometry.faces[3].material[0]
      tmpmat2 = @base.geometry.faces[2].material[0]
      tmpmat3 = @base.geometry.faces[5].material[0]
      tmpmat4 = @base.geometry.faces[4].material[0]
      @base.geometry.faces[3].material[0] = tmpmat4
      @base.geometry.faces[2].material[0] = tmpmat1
      @base.geometry.faces[5].material[0] = tmpmat2
      @base.geometry.faces[4].material[0] = tmpmat3
    else
      tmpmat1 = @base.geometry.faces[3].material[0]
      tmpmat2 = @base.geometry.faces[2].material[0]
      tmpmat3 = @base.geometry.faces[5].material[0]
      tmpmat4 = @base.geometry.faces[4].material[0]
      @base.geometry.faces[3].material[0] = tmpmat2
      @base.geometry.faces[2].material[0] = tmpmat3
      @base.geometry.faces[5].material[0] = tmpmat4
      @base.geometry.faces[4].material[0] = tmpmat1
      
  switchFaceMaterial: (face1, face2)->
    tempmat = face1.material[0]
    face1.material[0] = face2.material[0]
    face2.material[0] = tempmat
  facePoint: (to) ->
    rotx = @base.rotation.x * (180/Math.PI)
    roty = @base.rotation.y * (180/Math.PI)
    rotz = @base.rotation.z * (180/Math.PI)
    ret = []
    #console.log @base.rotation.x* (180/Math.PI), @base.rotation.y* (180/Math.PI), @base.rotation.z* (180/Math.PI)
    if rotx != 0 
      @base.rotation.x = 0
      @rotateMaterialX to
    if roty != 0
      @base.rotation.y = 0
      @rotateMaterialY to
    if rotz != 0
      @base.rotation.z = 0
      @rotateMaterialZ to  
 
      
  setUpTweens: ->
    @tweens = []
    @tweens['rotation'] = []
    @tweens['position'] = []
    
    @tweens['rotation']['x'] = new Fx.Three(@base,{property:'rotation',axis1:'z',axis2:'y',duration:@options.duration})
    @tweens['rotation']['y'] = new Fx.Three(@base,{property:'rotation',axis1:'x',axis2:'z',duration:@options.duration})
    @tweens['rotation']['z'] = new Fx.Three(@base,{property:'rotation',axis1:'x',axis2:'y',duration:@options.duration})
    
    @tweens['position']['x'] = new Fx.Three(@base,{property:'position',axis:'x',duration:@options.duration})
    @tweens['position']['y'] = new Fx.Three(@base,{property:'position',axis:'y',duration:@options.duration})
    @tweens['position']['z'] = new Fx.Three(@base,{property:'position',axis:'z',duration:@options.duration})
    
  rotateX: (to) ->
    @tweens['rotation']['x'].start to
  rotateY: (to) ->
    @tweens['rotation']['y'].start to
  rotateZ: (to) ->
    @tweens['rotation']['z'].start to 
  moveX: (to) ->
    @tweens['position']['x'].start to
  moveY: (to) ->
    @tweens['position']['y'].start to
  moveZ: (to) ->
    @tweens['position']['z'].start to 
  rotX: (to) ->
    @tweens['rotation']['x'].computeOnce to
  rotY: (to) ->
    @tweens['rotation']['y'].computeOnce to
  rotZ: (to) ->
    @tweens['rotation']['z'].computeOnce to
}



ShuffleID = null
Rubik.Scene = new Class {
  Impelments: Events
  loadTexture: (url) ->
    material = new THREE.MeshBitmapMaterial( @texture_placeholder );
    texture = new Image();
    texture.onload = ->
      material.bitmap = this
    texture.src = url
    material
    
  initialize: ->
    @width = window.innerWidth
    @height = window.innerHeight
    
    @theta = 45
    @radious = 4000
    @onMouseDownTheta = 45
    @phi = 60
    @onMouseDownPhi = 60
    @onMouseDownPosition = {}
    @mouseX = 0
    @mouseY = 0
    
    @keyboard = new UserKeyboardShortcuts({active:true});
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
    
    @texture_placeholder = document.createElement( 'canvas' )
    @texture_placeholder.width = 128
    @texture_placeholder.height = 128
    
    @camera = new THREE.Camera( 50, @width / @height, 1, 10000 )
    @camera.position.x = @radious * Math.sin( @theta * Math.PI / 360 ) * Math.cos( @phi * Math.PI / 360 )
    @camera.position.y = @radious * Math.sin( @phi * Math.PI / 360 )
    @camera.position.z = @radious * Math.cos( @theta * Math.PI / 360 ) * Math.cos( @phi * Math.PI / 360 )
    
    @camera.target.position.y = -200
    
    @scene = new THREE.Scene()
    
    @projector = new THREE.Projector()
    @mouse2D = new THREE.Vector3 0, 10000, 0.5 
    @ray = new THREE.Ray @camera.position, null
    
    @renderer = new THREE.CanvasRenderer()
    @renderer.setSize @width, @height
   
    @ground = new THREE.Mesh( new Plane( 2500, 2500, 10, 10), [@loadTexture( 'textures/backdrop3.png' )] )
    @scene.addObject @ground
    @ground.rotation.x = -90*(Math.PI/180)
    @ground.position.y = -900
    @ground.doublesided = true
    light1 = new THREE.PointLight( 0xdddddd )
    @scene.addLight( light1 )
    light1.position.y = 5000
    
    light4 = new THREE.PointLight( 0xdddddd )
    @scene.addLight( light4 )
    light4.position.y = -5000
    
    light2 = new THREE.PointLight( 0xffffff )
    @scene.addLight( light2 )
    light2.position.y = 0
    light2.position.x = 2000
    light2.position.z = 2000
    
    light1 = new THREE.PointLight( 0xffffff )
    @scene.addLight( light1 )
    light1.position.y = 0
    light1.position.x = -2000
    light1.position.z = -2000
        
    document.body.grab @renderer.domElement
    @mouseisdown = false
    document.addEvent 'mousemove', @MouseMove.bind @
    document.addEvent 'mousewheel', @MouseWheel.bind @
    document.addEvent 'mousedown', @MouseDown.bind @
    document.addEvent 'mouseup', @MouseUp.bind @
    @stepint = setInterval  @step.bind(@), 1000/60 
    @
  shuffle: ->
    level = Math.round(Math.random()*5)
    axis = Math.round(Math.random()*2)
    switch axis
      when 0
        a = -330
      when 1
        a = 0
      when 2
        a = 330
    switch level
      when 0
        Rk.rotLevel(90,a)
      when 1
        Rk.rotColumn(90,a)
      when 2
        Rk.rotRow(90,a)
      when 3
        Rk.rotLevel(-90,a)
      when 4
        Rk.rotColumn(-90,a)
      when 5
        Rk.rotRow(-90,a)
  randomRotation: ->
    level = Math.round(Math.random()*5)
    axis = Math.round(Math.random()*2)
    switch axis
      when 0
        a = -330
      when 1
        a = 0
      when 2
        a = 330
    switch level
      when 0
        Rk.rotateLevel(90,a)
      when 1
        Rk.rotateColumn(90,a)
      when 2
        Rk.rotateRow(90,a)
      when 3
        Rk.rotateLevel(-90,a)
      when 4
        Rk.rotateColumn(-90,a)
      when 5 
        Rk.rotateRow(-90,a)
  MouseDown: (e) ->    
    @mouseisdown = true
    @onMouseDownTheta = @theta
    @onMouseDownPhi = @phi
    @onMouseDownPosition.x = e.client.x
    @onMouseDownPosition.y = e.client.y
  MouseUp: (e) ->    
    @mouseisdown = false
    @onMouseDownPosition.x = e.client.x - @onMouseDownPosition.x
    @onMouseDownPosition.y = e.client.y - @onMouseDownPosition.y
  MouseWheel: (e) ->
    e.stop()
    if @rollOveredCube
      if not e.shift and not e.alt
        Rk.rotateLevel(90,Math.round(@rollOveredCube.position.y))
      if e.shift and not e.alt
        Rk.rotateRow(90,Math.round(@rollOveredCube.position.z))
      if e.alt and e.shift
        Rk.rotateColumn(90,Math.round(@rollOveredCube.position.x))
  MouseMove: ( event ) ->

    event.preventDefault()
    
    if @mouseisdown
      @theta = - ( ( event.client.x - @onMouseDownPosition.x ) * 0.5 ) + @onMouseDownTheta
      @phi = ( ( event.client.y - @onMouseDownPosition.y ) * 0.5 ) + @onMouseDownPhi
      
      #@phi = Math.min( 180, Math.max( 0, @phi ) );

      @camera.position.x = @radious * Math.sin( @theta * Math.PI / 360 ) * Math.cos( @phi * Math.PI / 360 )
      @camera.position.y = @radious * Math.sin( @phi * Math.PI / 360 )
      @camera.position.z = @radious * Math.cos( @theta * Math.PI / 360 ) * Math.cos( @phi * Math.PI / 360 )
      @camera.updateMatrix()
    
    @mouse2D.x = ( event.client.x / @width ) * 2 - 1
    @mouse2D.y = - ( event.client.y / @height ) * 2 + 1 
    
  step: -> 
    @mouse3D = @projector.unprojectVector( @mouse2D.clone(), @camera )
    @ray.direction = @mouse3D.subSelf( @camera.position ).normalize()
    intersects = @ray.intersectScene( @scene )
    if intersects.length > 0 
      if intersects[0].object isnt @ground
        if @rollOveredCube?
          if @rollOveredCube isnt intersects[0].object
            @rollOveredCube.material[1] = STROKE_MATERIAL
        @rollOveredCube = intersects[0].object
        intersects[0].object.material[1] = STROKE_MATERIAL2
    else if @rollOveredCube?
      @rollOveredCube.material[1] = STROKE_MATERIAL
      @rollOveredCube = null
    
    @renderer.render @scene, @camera 
}


Transitioning = false
Solving = false
resetTransition = ->
  Transitioning = false
  @removeEvent 'complete', resetTransition
  #check complete
Rubik.Rubik = new Class {
  initialize: (scene) ->
    @scene = scene
    @cubes = []
    @history = []
    @
  
  solveHistory: ->
    @hid = setInterval(@historyStepBack.bind(@) ,TweenDuration*2)
    Solving = true
  historyStepBack: ->
    console.log @history.length
    if @history.length > 0
      laststep = @history.pop()
      switch laststep.type
        when "rotateX"
          @rotateX laststep.value
        when "rotateY"
          @rotateY laststep.value
        when "rotateZ"
          @rotateZ laststep.value
        when "rotateLevel"
          @rotateLevel laststep.value, laststep.level
        when "rotateColumn"
          @rotateColumn laststep.value, laststep.level
        when "rotateRow"
          @rotateRow laststep.value, laststep.level
    else
      Solving = false
      clearInterval @hid
  
  rotateX: (x) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        tween = cube.rotateX x
      tween.addEvent 'complete', resetTransition
      if not Solving
        @history.push {type:'rotateX',value:-x}    
  rotateY: (x) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        tween = cube.rotateY x
      tween.addEvent 'complete', resetTransition
      if not Solving
        @history.push {type:'rotateY',value:-x}
  rotateZ: (x) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        tween = cube.rotateZ x
      tween.addEvent 'complete', resetTransition
      if not Solving
        @history.push {type:'rotateZ',value:-x}
  rotLevel: (x,level)->
    for cube in @cubes
      if Math.round(cube.base.position.y) is level
        tween = cube.rotY x
    @history.push {type:'rotateLevel',value:-x,level:level}
  rotRow: (x,level) ->
    for cube in @cubes
      if Math.round(cube.base.position.z) is level
        tween = cube.rotZ x
    @history.push {type:'rotateRow',value:-x,level:level}
  rotColumn: (x,level) ->
    for cube in @cubes
      if Math.round(cube.base.position.x) is level
        tween = cube.rotX x
    @history.push {type:'rotateColumn',value:-x,level:level}
  rotateLevel: (x,level) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        if Math.round(cube.base.position.y) is level
          tween = cube.rotateY x
      tween.addEvent 'complete', resetTransition
      if not Solving
        @history.push {type:'rotateLevel',value:-x,level:level}
  rotateColumn: (x,level) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        if Math.round(cube.base.position.x) is level
          tween = cube.rotateX x
      tween.addEvent 'complete', resetTransition
      if not Solving
        @history.push {type:'rotateColumn',value:-x,level:level}
  rotateRow: (x,level) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        if Math.round(cube.base.position.z) is level
          tween = cube.rotateZ x
      tween.addEvent 'complete', resetTransition
      if not Solving
        @history.push {type:'rotateRow',value:-x,level:level}
  
  removeCubes: ->
    for cube in @cubes
      @scene.scene.removeObject cube.base
    @cubes.empty()
  
  checkSolve: ->
    z330 = @cubes.filter (cube) ->
      if Math.round(cube.base.position.z) is 330 then true else false
      
    zm330 = @cubes.filter (cube) ->
      if Math.round(cube.base.position.z) is -330 then true else false
      
    y330 = @cubes.filter (cube) ->
      if Math.round(cube.base.position.y) is 330 then true else false
      
    ym330 = @cubes.filter (cube) ->
      if Math.round(cube.base.position.y) is -330 then true else false
      
    x330 = @cubes.filter (cube) ->
      if Math.round(cube.base.position.x) is 330 then true else false
      
    xm330 = @cubes.filter (cube) ->
      if Math.round(cube.base.position.x) is -330 then true else false
      
    tmpmat = z330[0].base.geometry.faces[1].material[0]
    for cube in z330
      console.log cube.base.geometry.faces[1].material[0] is tmpmat
      if cube.base.geometry.faces[1].material[0] isnt tmpmat
          return false
          
    tmpmat = zm330[0].base.geometry.faces[0].material[0]
    for cube in zm330
      console.log cube.base.geometry.faces[0].material[0] is tmpmat
      if cube.base.geometry.faces[0].material[0] isnt tmpmat
          return false
          
    tmpmat = y330[0].base.geometry.faces[5].material[0]
    for cube in y330
      console.log cube.base.geometry.faces[5].material[0] is tmpmat
      if cube.base.geometry.faces[5].material[0] isnt tmpmat
          return false
          
    tmpmat = ym330[0].base.geometry.faces[3].material[0]
    for cube in ym330
      console.log cube.base.geometry.faces[3].material[0] is tmpmat
      if cube.base.geometry.faces[3].material[0] isnt tmpmat
          return false
    tmpmat = x330[0].base.geometry.faces[2].material[0]
    for cube in x330
      console.log cube.base.geometry.faces[2].material[0] is tmpmat
      if cube.base.geometry.faces[2].material[0] isnt tmpmat
          return false
    tmpmat = xm330[0].base.geometry.faces[4].material[0]
    for cube in xm330
      console.log cube.base.geometry.faces[4].material[0] is tmpmat
      if cube.base.geometry.faces[4].material[0] isnt tmpmat
          return false
    true
        
  buildCube: ->
    for i in [0..2]
      for j in [0..2]
       for k in [0..2]
          cube = new Rubik.Cube()
          cube.base.position.x = 330*(i-1)
          cube.base.position.y = 330*(j-1)
          cube.base.position.z = 330*(k-1)
          cube.base.doublesided = true
          @cubes.push cube
          @scene.scene.addObject cube.base
          
    for cube in @cubes
      if Math.round(cube.base.position.z) is 330
        cube.base.geometry.faces[1].material = [CUBE_MATERIALS['white']]
      if Math.round(cube.base.position.y) is 330
        cube.base.geometry.faces[5].material = [CUBE_MATERIALS['green']]
      if Math.round(cube.base.position.x) is 330
        cube.base.geometry.faces[2].material = [CUBE_MATERIALS['blue']]
      if Math.round(cube.base.position.x) is -330
        cube.base.geometry.faces[4].material = [CUBE_MATERIALS['red']]
      if Math.round(cube.base.position.y) is -330
        cube.base.geometry.faces[3].material = [CUBE_MATERIALS['yellow']]
      if Math.round(cube.base.position.z) is -330
        cube.base.geometry.faces[0].material = [CUBE_MATERIALS['orange']]
        
    for cube in @cubes
      for face in cube.base.geometry.faces
        if face.material[0] is undefined
          face.material =  [MATERIAL_BLACK]
}


MainMenu = new Class {
  initialize: () ->
    @Float = new Core.Float()
    @Float.base.addClass 'mainmenu'
    @buildMenu()
    $("shower-and-changer").grab new Element('h2',{text:'Shortcuts'}), 'top'
    @Float.base.addEvent 'click:relay(div)', @mmhandler.bind @
    @
  mmhandler: (e) ->
    switch e.target.get('text')
      when MenuItems[4]
        mm.Float.toggle()
        if not Scene.stepint?
          Scene.stepint = setInterval Scene.step.bind(Scene), 1000/60 
        else
          clearInterval Scene.stepint
          Scene.stepint = null
      when MenuItems[1]
        if $("shower-and-changer").getStyle('display') is 'none'
          $("shower-and-changer").setStyle 'display', 'block'
        else
          $("shower-and-changer").setStyle 'display', 'none'
        
  buildMenu: () ->  
    for item in MenuItems
      @Float.base.grab new Element 'div', {class:'menuitem',text:item}
}
MenuItems = [
  'High Scores'
  'Shortcuts'
  'Help'
  'About'
  'Close'
]


Rubik.Game = new Class {
  Implements: [Events, Options]
  options: {
    speed: 1000
  }
  initialize: (options) ->
    @setOptions options
    @shuffled = false
    @time = 0
  create: ->
  shuffle: ->
    for i in [0..100]
      Scene.shuffle()
  start: ->
    @id = setInterval @timer.bind(@), @options.speed
  timer: ->
    @time += 1
    @elapsed = Math.floor(@time/60/60) + ":" + Math.floor(@time/60) + ":" + @time%60
    console.log @elapsed
  stop: ->
    clearInterval @id
    @id = null
  pause: ->  
    if @id?
      clearInterval @id
    else
      @id = setInterval @timer.bind(@), @options.speed
    
}

