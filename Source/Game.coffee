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
