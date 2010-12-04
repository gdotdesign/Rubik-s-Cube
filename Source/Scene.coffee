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
    @radious = 5000
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
  randomRotation: ->
    level = Math.round(Math.random()*11)
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
        Rk.rotateX(90)
      when 4
        Rk.rotateY(90)
      when 5
        Rk.rotateZ(90)
      when 6
        Rk.rotateLevel(-90,a)
      when 7
        Rk.rotateColumn(-90,a)
      when 8
        Rk.rotateRow(-90,a)
      when 9
        Rk.rotateX(-90)
      when 10
        Rk.rotateY(-90)
      when 11
        Rk.rotateZ(-90)
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
