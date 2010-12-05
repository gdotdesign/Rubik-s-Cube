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
