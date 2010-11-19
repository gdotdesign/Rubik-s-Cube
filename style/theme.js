GDotUI={}
GDotUI.Theme={
    Global:{
        active: 'active',
        inactive: 'inactive'
    },
    Icons:{
      add:'style/images/add.png',  
      remove:'style/images/delete.png',
      edit: 'style/images/pencil.png',
      handleVertical:'style/images/control_pause.png',
      handleHorizontal:''
    },
    Button:{
        'class':'button',
        defaultText: 'Button',
        defaultIcon: '../style/images/pencil.png'
    },
    DataList:{
        'class':'data-list'
    },
    Toggler:{
      'class': 'toggler',
      onClass: 'on',
      offClass: 'off',
      separatorClass: 'sep',
      onText: 'ON',
      offText: 'OFF'
    },
    Float:{
        'class':'float',
        bottomHandle:'bottom',
        topHandle:'handle',
        content:'base',
        controls:'control',
        iconOptions:{
            mode:'vertical',
            spacing:{
                x:0,
                y:5
            }
        }
    },
    Unit:{
        'class':'unit-pick'
    },
    Select: {
        'class':'select-pick'
    },
    Table:{
        'class':'data-table'
    },
    Icon:{
        'class':'icon'
    },
    IconGroup:{
        'class':'iconGroup'
    },
    Overlay:{
        'class':'overlay'
    },
    Picker:{
        'class':'picker',
        event: 'dblclick',
        picking: 'picking',
        offset: 10
    },
    Slider:{
        barClass:'bar',
        knobClass:'knob'
    },
    Slot:{
        'class':'slot'  
    },
    Tab:{
        'class':'tab'
    },
    Tabs:{
        'class':'tabs'
    },
    Text:{
        'class':'textPick'
    },
    Tip:{
        'class':'tip',
        offset: 5,
        location: { x:"left",
                    y:"bottom" }
    },
    Date:{
      'class':'datePick',
      yearFrom: 1980,
      format:'%Y %B %d - %A',
      DateTime:{
        'class':'date-time',
        format:'%Y %B %d - %A %H:%M'
      },
      Time:{
        'class':'time',
        format:'%H:%M'
      }
    },
    Number:{
        'class':'number',
        range:[-100,100],
        steps:200,
        reset: true
    },
    List:{
      'class':'list',
      selected: 'selectedItem'
    },
    ListItem:{
      'class':'list-item',
      title:'title',
      subTitle:'subtitle',
      handle:'list-handle',
      offset:2
    },
    Forms:{
        Field:{
            struct:{
                "dl":{
                    "dt":{
                        "label":''
                    },
                    "dd":{
                        "input":''
                    }
                }
            }
        }
    },
    Color:{
       sb:'sb',
       black:'black',
       white:'white',
       wrapper:'wrapper',
      'class':'color',
       format: 'hex', 
       controls:{
          'class':'slotcontrol'
       }
    }
}
