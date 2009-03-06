// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            portions copyright @2009 Apple, Inc.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/*global module test htmlbody ok equals same stop start */
var pane, view, view1 ;
module("SC.ScrollerView",{
  setup: function() {
    SC.RunLoop.begin();
	pane = SC.MainPane.create({
	  childViews: [
	    SC.ScrollerView.extend({		     
		}),
		SC.ScrollerView.extend({		     
		  minimum:10,
		  maximum:100,
		  isEnabled:NO,
		  value:15,
		  layoutDirection: SC.LAYOUT_HORIZONTAL
		})
	  ]	
	});
	pane.append(); // make sure there is a layer...
	SC.RunLoop.end();	
	view = pane.childViews[0];
	view1= pane.childViews[1];
  },

  teardown: function() {
   	pane.remove();
   	pane = view = null ;
  }
});

test("listing the displayProperties",function(){
  var obj = view.get('displayProperties');
  equals(4,obj.length,'the number of dispay properties');
  equals('value',obj[0],'the offset value property');
  equals('minimum',obj[1],'the minimum offset value property');
  equals('maximum',obj[2],'the maximum offset value property');	
  equals('isEnabled',obj[3],'the isEnabled offset value property');	  
});

test("testing properties of a scrollerview", function(){
  equals(10,view1.get('minimum'),'Minimum offset value for the scroller')	;
  equals(100,view1.get('maximum'),'Maximum offset value for the scroller');
  equals(NO,view1.get('isEnabled'),'The scroller should be not enabled');
  equals(SC.LAYOUT_VERTICAL,view.get('layoutDirection'),'The default scroller direction should be vertical');
  equals(SC.LAYOUT_HORIZONTAL,view1.get('layoutDirection'),'The scroller direction set as vertical during view creation');
  equals(0,view.value,'The default offset value set during creation for a scroller should be 0');
  equals(15,view1.value,'The offset value should be 15');
  // view1.set('layoutDirection',SC.LAYOUT_VERTICAL);
  // equals(SC.LAYOUT_VERTICAL,view1.get('layoutDirection'),'The scroller direction set after view creation');
});

test("ownerScrollValueKey() function of the scroller view",function(){
  equals('verticalScrollOffset',view.ownerScrollValueKey(),'should have a vertical scroll offset');
  equals('horizontalScrollOffset',view1.ownerScrollValueKey(),'should have a vertical scroll offset');
});
