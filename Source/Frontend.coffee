Game = null
MainMenu = new Class {
  initialize: () ->
    $("menu").addEvent 'click:relay(li)', @mmhandler.bindWithEvent(@)
    @el = new Element 'div', {class:'wrapper'}
    @el.set 'tween', {duration: "250ms"}
    $$('.menu_wrapper').set 'tween', {duration: "250ms"}
    $$('.time_wrapper, .steps_wrapper').position()
    $$('.time_wrapper').setStyle 'top',10
    $$('.steps_wrapper').setStyle 'top',65
    @controlsHeight = 0
    @menuHeight = 0
    if $("shower-and-changer")?
      @el.wraps $("shower-and-changer")
      $$(".controls_toggle")[0].addEvent 'click',( ->
        if @controlsHeight == 0
          @controlsHeight = @el.getSize().y
        if @el.getSize().y == 0
          @el.tween 'height', @controlsHeight
        else
          @el.tween 'height', 0 
      ).bind @
    $$(".menu_toggle")[0].addEvent 'click',( ->
      if @menuHeight == 0
        @menuHeight = $$('.menu_wrapper')[0].getSize().y
      if $$('.menu_wrapper')[0].getSize().y == 0
        $$('.menu_wrapper')[0].tween 'height', @menuHeight
      else
       $$('.menu_wrapper')[0].tween 'height', 0 
    ).bind @
    @
  mmhandler: (e) ->
    console.log e.target.get('rel')
    switch e.target.get('rel')
      when 'new'
        if Game?
          Game.stop()
        Game = new Rubik.Game()
        Game.start()
        
}
