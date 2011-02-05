Rubik.Game = new Class {
  Implements: [Events, Options]
  options: {
    speed: 1000
  }
  initialize: (options) ->
    @setOptions options
    @steps = 0
    @shuffled = false
    @time = 0
    Scene.addEvent 'check',( ->
      if Rk.checkSolve()
        @stop()
    ).bindWithEvent @
    @
  create: ->
  shuffle: ->
    for i in [0..18]
      Scene.shuffle()
  start: ->
    @history = new Rubik.History()
    Rk.addEvent 'step', ( ->
      @steps++
      $('steps').set 'text',"Steps: "+@steps
    ).bindWithEvent @
    @id = setInterval @timer.bind(@), @options.speed
    @shuffle()
  timer: ->
    @time += 1
    @elapsed = "Time: "+Math.floor(@time/60/60) + ":" + Math.floor(@time/60) + ":" + @time%60
    $('time').set 'text', @elapsed
    console.log @elapsed
  stop: ->
    console.log 'stopping'
    console.log 'game ended'
    console.log 'Time:'+ @elapsed
    console.log 'Steps:'+ @steps
    clearInterval @id
    @id = null
  pause: ->  
    if @id?
      clearInterval @id
    else
      @id = setInterval @timer.bind(@), @options.speed
    
}
