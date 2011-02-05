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
    @object.facePoint(@fromss)
    @parent()
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
