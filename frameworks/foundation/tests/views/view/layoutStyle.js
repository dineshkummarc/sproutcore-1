// ========================================================================
// View Layout Unit Tests
// ========================================================================

/*globals module test ok isObj */

/* These unit tests verify:  layout(), frame(), styleLayout() and clippingFrame(). */

var parent, child;

function performLayoutTest(layout, no_f, no_s, with_f, with_s) {
  
  // make sure we add null properties and convert numbers to 'XXpx' to style layout.
  var keys = 'width height top bottom marginLeft marginTop left right zIndex minWidth maxWidth minHeight maxHeight'.w();
  keys.forEach(function(key) {
    if (no_s[key]===undefined) no_s[key] = null;
    if (with_s[key]===undefined) with_s[key] = null;  

    if (typeof no_s[key] === 'number') no_s[key] = no_s[key].toString() + 'px';
    if (typeof with_s[key] === 'number') with_s[key] = no_s[key].toString() + 'px';
  });
  
  // set layout
  child.set('layout', layout) ;

  // test
  same(child.get('frame'), no_f, "FRAME NO PARENT".fmt(SC.inspect(child.get('frame')), SC.inspect(no_f))) ;  
  same(child.get('layoutStyle'), no_s, "STYLE NO PARENT".fmt(SC.inspect(child.get('layoutStyle')), SC.inspect(no_s))) ;  

  // add parent
  parent.appendChild(child);
  
  // test again
  same(child.get('frame'), with_f, "FRAME WITH PARENT".fmt(SC.inspect(child.get('frame')), SC.inspect(with_f))) ;  
  same(child.get('layoutStyle'), with_s, "STYLE WITH PARENT".fmt(SC.inspect(child.get('layoutStyle')), SC.inspect(with_s))) ;  
}

var commonSetup = {
  setup: function() {
    
    // create basic parent view
    parent = SC.View.create({
      layout: { top: 0, left: 0, width: 200, height: 200 }
    });
    
    // create child view to test against.
    child = SC.View.create();
  },
  
  teardown: function() {
    //parent.destroy(); child.destroy();
    parent = child = null ;
  }
};

module("NOTIFICATIONS", commonSetup) ;

test("Setting layout will notify frame observers", function() {
  var didNotify = NO, didNotifyStyle = NO;
  child.addObserver('frame', this, function() { didNotify = YES; }) ;
  child.addObserver('layoutStyle', this, function() { didNotifyStyle = YES; });
  
  child.set('layout', { left: 0, top: 10, bottom: 20, right: 50 }) ;
  ok(didNotify, "didNotify");
  ok(didNotifyStyle, 'didNotifyStyle');
}) ;

// ..........................................................
// TEST FRAME/STYLEFRAME WITH BASIC LAYOUT VARIATIONS
// 
// NOTE:  Each test evaluates the frame before and after adding it to the 
// parent.

module('BASIC LAYOUT VARIATIONS', commonSetup);

test("layout {top, left, width, height}", function() {

  var layout = { top: 10, left: 10, width: 50, height: 50 };
  var s = { top: 10, left: 10, width: 50, height: 50 } ;
  var no_f = { x: 10, y: 10, width: 50, height: 50 } ;
  var with_f = { x: 10, y: 10, width: 50, height: 50 } ;

  performLayoutTest(layout, no_f, s, with_f, s) ;
}) ;

test("layout {top, left, bottom, right}", function() {

  var layout = { top: 10, left: 10, bottom: 10, right: 10 };
  var no_f = { x: 10, y: 10, width: 0, height: 0 } ;
  var with_f = { x: 10, y: 10, width: 180, height: 180 } ;
  var s = { top: 10, left: 10, bottom: 10, right: 10 } ;

  performLayoutTest(layout, no_f, s, with_f, s) ;
}) ;

test("layout {bottom, right, width, height}", function() {

  var layout = { bottom: 10, right: 10, width: 50, height: 50 };
  var no_f = { x: 0, y: 0, width: 50, height: 50 } ;
  var with_f = { x: 140, y: 140, width: 50, height: 50 } ;
  var s = { bottom: 10, right: 10, width: 50, height: 50 } ;

  performLayoutTest(layout, no_f, s, with_f, s) ;
}) ;

test("layout {centerX, centerY, width, height}", function() {

  var layout = { centerX: 10, centerY: 10, width: 60, height: 60 };
  var no_f = { x: 10, y: 10, width: 60, height: 60 } ;
  var with_f = { x: 80, y: 80, width: 60, height: 60 } ;
  var s = { marginLeft: -20, marginTop: -20, width: 60, height: 60, top: "50%", left: "50%" } ;

  performLayoutTest(layout, no_f, s, with_f, s) ;
}) ;

// ..........................................................
// TEST FRAME/STYLEFRAME WITH INVALID LAYOUT VARIATIONS
// 
// NOTE:  Each test evaluates the frame before and after adding it to the 
// parent.

module('INVALID LAYOUT VARIATIONS', commonSetup);

test("layout {top, left} - assume right/bottom=0", function() {
  
  var layout = { top: 10, left: 10 };
  var no_f = { x: 10, y: 10, width: 0, height: 0 } ;
  var with_f = { x: 10, y: 10, width: 190, height: 190 } ;
  var s = { bottom: 0, right: 0, top: 10, left: 10 } ;

  performLayoutTest(layout, no_f, s, with_f, s) ;
}) ;

test("layout {height, width} - assume top/left=0", function() {

  var layout = { height: 60, width: 60 };
  var no_f = { x: 0, y: 0, width: 60, height: 60 } ;
  var with_f = { x: 0, y: 0, width: 60, height: 60 } ;
  var s = { width: 60, height: 60, top: 0, left: 0 } ;
  
  performLayoutTest(layout, no_f, s, with_f, s) ;
  
}) ;

test("layout {right, bottom} - assume top/left=0", function() {

  var layout = { right: 10, bottom: 10 };
  var no_f = { x: 0, y: 0, width: 0, height: 0 } ;
  var with_f = { x: 0, y: 0, width: 190, height: 190 } ;
  var s = { bottom: 10, right: 10, top: 0, left: 0 } ;
  
  performLayoutTest(layout, no_f, s, with_f, s) ;
  
}) ;

test("layout {centerX, centerY} - assume width/height=0", function() {

  var layout = { centerX: 10, centerY: 10 };
  var no_f = { x: 10, y: 10, width: 0, height: 0 } ;
  var with_f = { x: 110, y: 110, width: 0, height: 0 } ;
  var s = { width: 0, height: 0, top: "50%", left: "50%", marginTop: 10, marginLeft: 10 } ;
  
  performLayoutTest(layout, no_f, s, with_f, s) ;
  
}) ;

test("layout {top, left, centerX, centerY, height, width} - top/left take presidence", function() {

  var layout = { top: 10, left: 10, centerX: 10, centerY: 10, height: 60, width: 60 };
  var no_f = { x: 10, y: 10, width: 60, height: 60 } ;
  var with_f = { x: 10, y: 10, width: 60, height: 60 } ;
  var s = { width: 60, height: 60, top: 10, left: 10 } ;
  
  performLayoutTest(layout, no_f, s, with_f, s) ;
  
}) ;

test("layout {bottom, right, centerX, centerY, height, width} - bottom/right take presidence", function() {

  var layout = { bottom: 10, right: 10, centerX: 10, centerY: 10, height: 60, width: 60 };
  var no_f = { x: 0, y: 0, width: 60, height: 60 } ;
  var with_f = { x: 130, y: 130, width: 60, height: 60 } ;
  var s = { width: 60, height: 60, bottom: 10, right: 10 } ;
  
  performLayoutTest(layout, no_f, s, with_f, s) ;
  
}) ;

test("layout {top, left, bottom, right, centerX, centerY, height, width} - top/left take presidence", function() {

  var layout = { top: 10, left: 10, bottom: 10, right: 10, centerX: 10, centerY: 10, height: 60, width: 60 };
  var no_f = { x: 10, y: 10, width: 60, height: 60 } ;
  var with_f = { x: 10, y: 10, width: 60, height: 60 } ;
  var s = { width: 60, height: 60, top: 10, left: 10 } ;
  
  performLayoutTest(layout, no_f, s, with_f, s) ;
  
}) ;

// ..........................................................
// TEST FRAME/STYLEFRAME WHEN PARENT VIEW IS RESIZED
// 

module('RESIZE FRAME', commonSetup);
 
function verifyFrameResize(layout, before, after) {
  parent.appendChild(child);
  child.set('layout', layout);
  
  isObj(child.get('frame'), before, "Before: %@ == %@".fmt(SC.inspect(child.get('frame')), SC.inspect(before))) ;
  
  parent.adjust('width', 300).adjust('height', 300);
  
  isObj(child.get('frame'), after, "After: %@ == %@".fmt(SC.inspect(child.get('frame')), SC.inspect(after)));
  
}

test("frame does not change with top/left/w/h", function(){
  var layout = { top: 10, left: 10, width: 60, height: 60 };
  var before = { x: 10, y: 10, width: 60, height: 60 };
  var after =  { x: 10, y: 10, width: 60, height: 60 };
  verifyFrameResize(layout, before, after);
});

test("frame shifts down with bottom/right/w/h", function(){
  var layout = { bottom: 10, right: 10, width: 60, height: 60 };
  var before = { x: 130, y: 130, width: 60, height: 60 };
  var after =  { x: 230, y: 230, width: 60, height: 60 };
  verifyFrameResize(layout, before, after);
});

test("frame size shifts with top/left/bottom/right", function(){
  var layout = { top: 10, left: 10, bottom: 10, right: 10 };
  var before = { x: 10, y: 10, width: 180, height: 180 };
  var after =  { x: 10, y: 10, width: 280, height: 280 };
  verifyFrameResize(layout, before, after);
});

test("frame loc shifts with centerX/centerY", function(){
  var layout = { centerX: 10, centerY: 10, width: 60, height: 60 };
  var before = { x: 80, y: 80, width: 60, height: 60 };
  var after =  { x: 130, y: 130, width: 60, height: 60 };
  verifyFrameResize(layout, before, after);
});