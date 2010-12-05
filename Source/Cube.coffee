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

