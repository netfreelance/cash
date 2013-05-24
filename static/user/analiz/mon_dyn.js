var cash_analiz_mdyn_lbl = {
    id: "cash_analiz_mdyn_lbl",
    xtype: 'label',
    cls: "cash_analiz_lbl",
    text: 'Помесячная динамика'
};


var cash_analiz_mdyn_from_date =
{
    xtype: 'datefield',
    startDay:1,
    fieldLabel: 'Период',
    name: 'cash_analiz_mdyn_from_date',
    id: 'cash_analiz_mdyn_from_date',
    labelWidth: 55,
    format: "Y-m-d",
    maxValue: new Date(),
    width: 160,
    onChange: cash_analiz_mdyn_refresh
}; // cash_analiz_mdyn_from_date


var cash_analiz_mdyn_to_date =
{
    xtype: 'datefield',
    fieldLabel: 'по',
    startDay:1,
    name: 'cash_analiz_mdyn_to_date',
    id: 'cash_analiz_mdyn_to_date',
    labelWidth: 20,
    format: "Y-m-d",
    width: 120,
    onChange: cash_analiz_mdyn_refresh
}; // cash_analiz_mdyn_to_date


var cash_analiz_mdyn_date = {
      xtype: 'toolbar',
      dock: 'top',
      ui: 'footer',
      items: [cash_analiz_mdyn_from_date, " ", cash_analiz_mdyn_to_date],
      region: 'north',
      id: "cash_analiz_mdyn_date",
}; //cash_analiz_mdyn_date


function cash_analiz_mdyn_refresh() {
  if(Ext.getCmp('cash_analiz_mdyn_from_date').getValue() == null) return;
  if(Ext.getCmp('cash_analiz_mdyn_to_date').getValue() == null) return;

  cash_analiz_mdyn_store.proxy.url = "ajax/analiz/mon_dyn.php?from=" + Ext.Date.format(Ext.getCmp('cash_analiz_mdyn_from_date').getValue(),'Y-m-d') +
				    "&to=" + Ext.Date.format(Ext.getCmp('cash_analiz_mdyn_to_date').getValue(),'Y-m-d');
  cash_analiz_mdyn_store.load();
  setAnkhor();
} //cash_analiz_mdyn_refresh

var cash_analiz_mdyn_model = Ext.define('cash_analiz_mdyn_model', {
    extend: 'Ext.data.Model',
    fields: [
	{name: 'tname',		type: 'string'},
	{name: 'in_amount', 	type: 'double'},
	{name: 'out_amount', 	type: 'double'}
    ]
}); //cash_analiz_mdyn_model

var cash_analiz_mdyn_store = Ext.create('Ext.data.Store', {
    model: 'cash_analiz_mdyn_model',
    autoLoad: false,
    proxy: {
	type: 'ajax',
	url: 'ajax/analiz/mon_dyn.php?'
    }
}); //cash_analiz_mdyn_store
//
var cash_analiz_mdyn_chart = Ext.create('Ext.chart.Chart', {
    id: "cash_analiz_mdyn_chart",
    width: w - 100,
    height: h - 100,
    animate: true,
    shadow: true,
    store: cash_analiz_mdyn_store,
    legend: {
      position: 'right'
    },
    axes: [{
	type: 'Category',
	position: 'bottom',
	fields: ['tname'],
	title: 'Месяц'
    },{
	type: 'Numeric',
	position: 'left',
	fields: ['in_amount', 'out_amount'],
	minimum: 0,
	label: {
	    renderer: Ext.util.Format.numberRenderer('0,0')
	},
	grid: true,
	title: 'Сумма'
    }],
    series: [{
	type: 'column',
	axis: 'left',
	yField: 'tname',
	xField: ['in_amount', 'out_amount']
    }]
});

var cash_analiz_mdyn_chart = Ext.create('Ext.chart.Chart', {
    id: "cash_analiz_mdyn_chart",
    width: w - 100,
    height: h - 100,
    animate: true,
    shadow: true,
    store: cash_analiz_mdyn_store,
    legend: {
      position: 'right'
    },
    axes: [{
	type: 'Numeric',
	position: 'left',
	fields: ['in_amount', 'out_amount'],
	label: {
	    renderer: Ext.util.Format.numberRenderer('0,0')
	},
	title: 'Сумма',
	grid: true,
	minimum: 0
    }, {
	type: 'Category',
	position: 'bottom',
	fields: ['tname'],
	title: 'Месяц'
    }],
    series: [{
	type: 'column',
	axis: 'left',
	highlight: true,
	tips: {
	  trackMouse: true,
	  width: 220,
	  height: 28,
	  renderer: function(storeItem, item) {
	    this.setTitle(storeItem.get('tname') + ': ' + price_r(storeItem.get(item.yField)) );
	  }
	},
	label: {
	  display: 'insideEnd',
	  'text-anchor': 'middle',
	    field: 'data1',
	    renderer: Ext.util.Format.numberRenderer('0'),
	    orientation: 'vertical',
	    color: '#333'
	},
	xField: 'tname',
	yField: ['in_amount', 'out_amount'],
	title: ['Приход', 'Расход']
    }]
});


function cash_analiz_mdyn_load(_cb) {
  if(Ext.getCmp('cash_analiz_mondyn').items.length > 0) {
    if(_cb != undefined) _cb();
    return;
  }

  Ext.getCmp('cash_analiz_mondyn').add(cash_analiz_mdyn_lbl);
  Ext.getCmp('cash_analiz_mondyn').add(cash_analiz_mdyn_date);
  Ext.getCmp('cash_analiz_mondyn').add(cash_analiz_mdyn_chart);

  var cd = new Date();

  Ext.getCmp('cash_analiz_mdyn_from_date').setValue(new Date(cd.getFullYear(), 0, 1));
  Ext.getCmp('cash_analiz_mdyn_to_date').setValue(cd);

  if(_cb != undefined) _cb();
}