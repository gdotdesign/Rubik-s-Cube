Transitioning = false
Solving = false
resetTransition = ->
  Transitioning = false
  @removeEvent 'complete', resetTransition
  console.log Rk.checkSolve()
  Scene.fireEvent 'check'
  #check complete
Rubik.Rubik = new Class {
  Implements: Events
  initialize: (scene) ->
    @scene = scene
    @cubes = []
    @history = []
    @
  
  solveHistory: ->
    @hid = setInterval(@historyStepBack.bind(@) ,TweenDuration*2)
    Solving = true
  historyStepBack: ->
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
      @fireEvent 'step', new Rubik.Step('rotateLevel',-x, level)
        
  rotateColumn: (x,level) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        if Math.round(cube.base.position.x) is level
          tween = cube.rotateX x
      tween.addEvent 'complete', resetTransition
      if not Solving
        @history.push {type:'rotateColumn',value:-x,level:level}
      @fireEvent 'step', new Rubik.Step('rotateColumn',-x, level)
  rotateRow: (x,level) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        if Math.round(cube.base.position.z) is level
          tween = cube.rotateZ x
      tween.addEvent 'complete', resetTransition
      if not Solving
        @history.push {type:'rotateRow',value:-x,level:level}
      @fireEvent 'step', new Rubik.Step('rotateRow',-x, level)
  
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
      if cube.base.geometry.faces[1].material[0] isnt tmpmat
          return false
          
    tmpmat = zm330[0].base.geometry.faces[0].material[0]
    for cube in zm330
      if cube.base.geometry.faces[0].material[0] isnt tmpmat
          return false
          
    tmpmat = y330[0].base.geometry.faces[5].material[0]
    for cube in y330
      if cube.base.geometry.faces[5].material[0] isnt tmpmat
          return false
          
    tmpmat = ym330[0].base.geometry.faces[3].material[0]
    for cube in ym330
      if cube.base.geometry.faces[3].material[0] isnt tmpmat
          return false
    tmpmat = x330[0].base.geometry.faces[2].material[0]
    for cube in x330
      if cube.base.geometry.faces[2].material[0] isnt tmpmat
          return false
    tmpmat = xm330[0].base.geometry.faces[4].material[0]
    for cube in xm330
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
