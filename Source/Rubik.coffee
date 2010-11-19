Transitioning = false
resetTransition = ->
  Transitioning = false
  @removeEvent 'complete', resetTransition
Rubik.Rubik = new Class {
  initialize: (scene) ->
    @scene = scene
    @cubes = []
    @
  
  rotateX: (x) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        tween = cube.rotateX x
      tween.addEvent 'complete', resetTransition
  rotateY: (x) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        tween = cube.rotateY x
      tween.addEvent 'complete', resetTransition
  rotateZ: (x) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        tween = cube.rotateZ x
      tween.addEvent 'complete', resetTransition
  rotateLevel: (x,level) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        if Math.round(cube.base.position.y) is level
          tween = cube.rotateY x
      tween.addEvent 'complete', resetTransition
  rotateColumn: (x,level) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        if Math.round(cube.base.position.x) is level
          tween = cube.rotateX x
      tween.addEvent 'complete', resetTransition
  rotateRow: (x,level) ->
    if not Transitioning
      Transitioning = true
      for cube in @cubes
        if Math.round(cube.base.position.z) is level
          tween = cube.rotateZ x
      tween.addEvent 'complete', resetTransition
  
  removeCubes: ->
    for cube in @cubes
      @scene.scene.removeObject cube.base
    @cubes.empty()
        
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
        cube.base.geometry.faces[1].material = [new THREE.MeshColorFillMaterial( 0xffffff, 1 )]
      if Math.round(cube.base.position.y) is 330
        cube.base.geometry.faces[5].material = [new THREE.MeshColorFillMaterial( 0x00ff00, 1 )]
      if Math.round(cube.base.position.x) is 330
        cube.base.geometry.faces[2].material = [new THREE.MeshColorFillMaterial( 0x0000ff, 1 )]
      if Math.round(cube.base.position.x) is -330
        cube.base.geometry.faces[4].material = [new THREE.MeshColorFillMaterial( 0xff0000, 1 )]
      if Math.round(cube.base.position.y) is -330
        cube.base.geometry.faces[3].material = [new THREE.MeshColorFillMaterial( 0xffff00, 1 )]
      if Math.round(cube.base.position.z) is -330
        cube.base.geometry.faces[0].material = [new THREE.MeshColorFillMaterial( 0xFF6A00, 1 )]
        
    for cube in @cubes
      for face in cube.base.geometry.faces
        if face.material[0] is undefined
          face.material =  [MATERIAL_BLACK]
}
