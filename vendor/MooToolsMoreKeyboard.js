// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/c4445af6bb5973b0e851fa1bb795ba21 
// Or build this file again with packager using: packager build More/Keyboard More/Keyboard.Extras
/*
---
copyrights:
  - [MooTools](http://mootools.net)

licenses:
  - [MIT License](http://mootools.net/license.txt)
...
*/
MooTools.More={version:"1.3.0.1",build:"6dce99bed2792dffcbbbb4ddc15a1fb9a41994b5"};Events.Pseudos=function(f,c,d){var b="monitorEvents:";var a=function(g){return{store:g.store?function(h,i){g.store(b+h,i);
}:function(h,i){(g.$monitorEvents||(g.$monitorEvents={}))[h]=i;},retrieve:g.retrieve?function(h,i){return g.retrieve(b+h,i);}:function(h,i){if(!g.$monitorEvents){return i;
}return g.$monitorEvents[h]||i;}};};var e=function(h){if(h.indexOf(":")==-1){return null;}var g=Slick.parse(h).expressions[0][0],i=g.pseudos;return(f&&f[i[0].key])?{event:g.tag,value:i[0].value,pseudo:i[0].key,original:h}:null;
};return{addEvent:function(l,n,i){var m=e(l);if(!m){return c.call(this,l,n,i);}var j=a(this),q=j.retrieve(l,[]),g=Array.from(f[m.pseudo]),k=g[1];var p=this;
var o=function(){g[0].call(p,m,n,arguments,k);};q.include({event:n,monitor:o});j.store(l,q);var h=m.event;if(k&&k[h]){h=k[h].base;}c.call(this,l,n,i);return c.call(this,h,o,i);
},removeEvent:function(m,l){var k=e(m);if(!k){return d.call(this,m,l);}var n=a(this),j=n.retrieve(m),i=Array.from(f[k.pseudo]),h=i[1];if(!j){return this;
}var g=k.event;if(h&&h[g]){g=h[g].base;}d.call(this,m,l);j.each(function(o,p){if(!l||o.event==l){d.call(this,g,o.monitor);}delete j[p];},this);n.store(m,j);
return this;}};};(function(){var b={once:function(d,e,c){e.apply(this,c);this.removeEvent(d.original,e);}};Events.definePseudo=function(c,d){b[c]=d;};var a=Events.prototype;
Events.implement(Events.Pseudos(b,a.addEvent,a.removeEvent));})();(function(){var b={once:function(d,e,c){e.apply(this,c);this.removeEvent(d.original,e);
}};Event.definePseudo=function(d,e,c){b[d]=[e,c];};var a=Element.prototype;[Element,Window,Document].invoke("implement",Events.Pseudos(b,a.addEvent,a.removeEvent));
})();(function(){var a="$moo:keys-pressed",b="$moo:keys-keyup";Event.definePseudo("keys",function(d,e,c){var g=c[0],f=[],h=this.retrieve(a,[]);f.append(d.value.replace("++",function(){f.push("+");
return"";}).split("+"));h.include(g.key);if(f.every(function(j){return h.contains(j);})){e.apply(this,c);}this.store(a,h);if(!this.retrieve(b)){var i=function(j){(function(){h=this.retrieve(a,[]).erase(j.key);
this.store(a,h);}).delay(0,this);};this.store(b,i).addEvent("keyup",i);}});Object.append(Event.Keys,{shift:16,control:17,alt:18,capslock:20,pageup:33,pagedown:34,end:35,home:36,numlock:144,scrolllock:145,";":186,"=":187,",":188,"-":Browser.firefox?109:189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222,"+":107});
})();(function(){var a=this.Keyboard=new Class({Extends:Events,Implements:[Options],options:{defaultEventType:"keydown",active:false,manager:null,events:{},nonParsedEvents:["activate","deactivate","onactivate","ondeactivate","changed","onchanged"]},initialize:function(f){if(f&&f.manager){this.manager=f.manager;
delete f.manager;}this.setOptions(f);this.setup();},setup:function(){this.addEvents(this.options.events);if(a.manager&&!this.manager){a.manager.manage(this);
}if(this.options.active){this.activate();}},handle:function(h,g){if(h.preventKeyboardPropagation){return;}var f=!!this.manager;if(f&&this.activeKB){this.activeKB.handle(h,g);
if(h.preventKeyboardPropagation){return;}}this.fireEvent(g,h);if(!f&&this.activeKB){this.activeKB.handle(h,g);}},addEvent:function(h,g,f){return this.parent(a.parse(h,this.options.defaultEventType,this.options.nonParsedEvents),g,f);
},removeEvent:function(g,f){return this.parent(a.parse(g,this.options.defaultEventType,this.options.nonParsedEvents),f);},toggleActive:function(){return this[this.isActive()?"deactivate":"activate"]();
},activate:function(f){if(f){if(f.isActive()){return this;}if(this.activeKB&&f!=this.activeKB){this.previous=this.activeKB;this.previous.fireEvent("deactivate");
}this.activeKB=f.fireEvent("activate");a.manager.fireEvent("changed");}else{if(this.manager){this.manager.activate(this);}}return this;},isActive:function(){return this.manager?(this.manager.activeKB==this):(a.manager==this);
},deactivate:function(f){if(f){if(f===this.activeKB){this.activeKB=null;f.fireEvent("deactivate");a.manager.fireEvent("changed");}}else{if(this.manager){this.manager.deactivate(this);
}}return this;},relinquish:function(){if(this.isActive()&&this.manager&&this.manager.previous){this.manager.activate(this.manager.previous);}},manage:function(f){if(f.manager&&f.manager!=a.manager&&this!=a.manager){f.manager.drop(f);
}this.instances.push(f);f.manager=this;if(!this.activeKB){this.activate(f);}},_disable:function(f){if(this.activeKB==f){this.activeKB=null;}},drop:function(f){this._disable(f);
this.instances.erase(f);a.manager.manage(f);if(this.activeKB==f&&this.previous&&this.instances.contains(this.previous)){this.activate(this.previous);}},instances:[],trace:function(){a.trace(this);
},each:function(f){a.each(this,f);}});var b={};var c=["shift","control","alt","meta"];var e=/^(?:shift|control|ctrl|alt|meta)$/;a.parse=function(h,g,k){if(k&&k.contains(h.toLowerCase())){return h;
}h=h.toLowerCase().replace(/^(keyup|keydown):/,function(m,l){g=l;return"";});if(!b[h]){var f,j={};h.split("+").each(function(l){if(e.test(l)){j[l]=true;
}else{f=l;}});j.control=j.control||j.ctrl;var i=[];c.each(function(l){if(j[l]){i.push(l);}});if(f){i.push(f);}b[h]=i.join("+");}return g+":keys("+b[h]+")";
};a.each=function(f,g){var h=f||a.manager;while(h){g.run(h);h=h.activeKB;}};a.stop=function(f){f.preventKeyboardPropagation=true;};a.manager=new a({active:true});
a.trace=function(f){f=f||a.manager;var g=window.console&&console.log;if(g){console.log("the following items have focus: ");}a.each(f,function(h){if(g){console.log(document.id(h.widget)||h.wiget||h);
}});};var d=function(g){var f=[];c.each(function(h){if(g[h]){f.push(h);}});if(!e.test(g.key)){f.push(g.key);}a.manager.handle(g,g.type+":keys("+f.join("+")+")");
};document.addEvents({keyup:d,keydown:d});})();Keyboard.prototype.options.nonParsedEvents.combine(["rebound","onrebound"]);Keyboard.implement({addShortcut:function(b,a){this.shortcuts=this.shortcuts||[];
this.shortcutIndex=this.shortcutIndex||{};a.getKeyboard=Function.from(this);a.name=b;this.shortcutIndex[b]=a;this.shortcuts.push(a);if(a.keys){this.addEvent(a.keys,a.handler);
}return this;},addShortcuts:function(b){for(var a in b){this.addShortcut(a,b[a]);}return this;},removeShortcut:function(b){var a=this.getShortcut(b);if(a&&a.keys){this.removeEvent(a.keys,a.handler);
delete this.shortcutIndex[b];this.shortcuts.erase(a);}return this;},removeShortcuts:function(a){a.each(this.removeShortcut,this);return this;},getShortcuts:function(){return this.shortcuts||[];
},getShortcut:function(a){return(this.shortcutIndex||{})[a];}});Keyboard.rebind=function(b,a){Array.from(a).each(function(c){c.getKeyboard().removeEvent(c.keys,c.handler);
c.getKeyboard().addEvent(b,c.handler);c.keys=b;c.getKeyboard().fireEvent("rebound");});};Keyboard.getActiveShortcuts=function(b){var a=[],c=[];Keyboard.each(b,[].push.bind(a));
a.each(function(d){c.extend(d.getShortcuts());});return c;};Keyboard.getShortcut=function(c,b,d){d=d||{};var a=d.many?[]:null,e=d.many?function(g){var f=g.getShortcut(c);
if(f){a.push(f);}}:function(f){if(!a){a=f.getShortcut(c);}};Keyboard.each(b,e);return a;};Keyboard.getShortcuts=function(b,a){return Keyboard.getShortcut(b,a,{many:true});
};