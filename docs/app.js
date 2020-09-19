!function(t){function e(e){for(var i,a,s=e[0],u=e[1],h=e[2],l=0,c=[];l<s.length;l++)a=s[l],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&c.push(o[a][0]),o[a]=0;for(i in u)Object.prototype.hasOwnProperty.call(u,i)&&(t[i]=u[i]);for(f&&f(e);c.length;)c.shift()();return r.push.apply(r,h||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],i=!0,s=1;s<n.length;s++){var u=n[s];0!==o[u]&&(i=!1)}i&&(r.splice(e--,1),t=a(a.s=n[0]))}return t}var i={},o={0:0},r=[];function a(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=t,a.c=i,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)a.d(n,i,function(e){return t[e]}.bind(null,i));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="";var s=window.webpackJsonp=window.webpackJsonp||[],u=s.push.bind(s);s.push=e,s=s.slice();for(var h=0;h<s.length;h++)e(s[h]);var f=u;r.push([2,1]),n()}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(){}return t.CanvasWidth=800,t.CanvasHeight=600,t.InnerQuadSize=50,t.BorderSize=10,t.HookSize=10,t.PuzzleTotalSize=t.InnerQuadSize+2*t.BorderSize,t.PuzzleShadowAlpha=.6,t.PuzzleShadowOffset=3,t.PuzzleScaleOnOver=1.2,t.PuzzleScalingOutAnimzationDuration=100,t.PuzzleScalingInAnimzationDuration=300,t.PuzzleScalingOutAnimzationEase="Cubic.Out",t.PuzzleScalingInAnimzationEase="Linear",t.MinDistanceToAutoPut=60,t.FieldShadowAlpha=.2,t.FieldShadowTint=59417,t.DebugLineStyle={width:2,color:16777215},t.DebugDrawingConfigs={lineStyle:t.DebugLineStyle},t}();e.default=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.EConnection=void 0,function(t){t[t.None=0]="None",t[t.In=1]="In",t[t.Out=2]="Out"}(e.EConnection||(e.EConnection={}))},function(t,e,n){t.exports=n(3)},function(t,e,n){"use strict";var i,o=this&&this.__extends||(i=function(t,e){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),r=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var a=r(n(4)),s=r(n(5)),u=r(n(6)),h=r(n(7)),f=r(n(8)),l=r(n(9)),c=r(n(10)),d=r(n(11)),p=r(n(0)),_=r(n(12)),z=r(n(13)),g=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e._puzzles=[],e}return o(e,t),e.prototype.preload=function(){this.load.image("target",s.default),this.load.image("background",f.default),this.load.image("patterns_atlas",h.default),this.load.image("field_shadow",u.default)},e.prototype.loadImages=function(t){var e=this,n=new Image;n.onload=function(){var i=new Image;i.onload=function(){t(n,i)},i.src=e.textures.getBase64("target")},n.src=this.textures.getBase64("patterns_atlas"),this.onPuzzleDragEnd=this.onPuzzleDragEnd.bind(this)},e.prototype.constructPuzzlePieces=function(t,e){var n=new d.default(this.textures,t,e),i=new z.default(this.add,this.tweens,this.input,this.onPuzzleDragEnd),o=this.getGrid(e),r=this.getOffsetsToCenter(e);this.showFieldShadow(r,e);for(var a=0,s=0;s<o.Height;++s)for(var u=0;u<o.Width;++u){var h=a++,f=new _.default((u+.5)*p.default.InnerQuadSize,(s+.5)*p.default.InnerQuadSize),l=n.generateTextureForPuzzle(h,f,o.Connections[s][u]),g=new _.default(f.x+r.x,f.y+r.y),P=i.constructGamePuzzle(h,g,l,!0),w=new c.default(h,o.Connections[s][u],g,P);this._puzzles.push(w)}return this._puzzles},e.prototype.showFieldShadow=function(t,e){this.add.image(0,0,"field_shadow").setOrigin(0,0).setPosition(t.x,t.y).setScale(e.width,e.height).setTint(p.default.FieldShadowTint).setAlpha(p.default.FieldShadowAlpha)},e.prototype.getOffsetsToCenter=function(t){return{x:(p.default.CanvasWidth-t.width)/2,y:(p.default.CanvasHeight-t.height)/2}},e.prototype.onPuzzleDragEnd=function(t,e){var n=this._puzzles[t];a.default.Math.Distance.BetweenPoints(n.TargetPosition,e)<p.default.MinDistanceToAutoPut&&n.putOnTargetPosition()},e.prototype.getGrid=function(t){var e=t.width/p.default.InnerQuadSize,n=t.height/p.default.InnerQuadSize;return{Width:e,Height:n,Connections:(new l.default).make(n,e)}},e.prototype.runGame=function(t,e){this.constructPuzzlePieces(t,e)},e.prototype.create=function(){this.add.image(0,0,"background").setOrigin(0,0).setAlpha(.5);this.runGame=this.runGame.bind(this),this.loadImages(this.runGame)},e}(a.default.Scene);e.default=g;var P={type:a.default.AUTO,parent:"phaser-example",width:p.default.CanvasWidth,height:p.default.CanvasHeight,scene:[g],transparent:!0};new a.default.Game(P)},,function(t,e,n){t.exports=n.p+"a9882238a1bb3d7163780cee658ae487.png"},function(t,e,n){t.exports=n.p+"ce21cbdd9b894e6af794813eb3fdaf60.png"},function(t,e,n){t.exports=n.p+"4b7c61bf12ddd92789647909bbd3c511.png"},function(t,e,n){t.exports=n.p+"fa6e1d2c76b02c62ca18584fb1aef57e.jpg"},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(1),o=function(){function t(){var t;this._oppositeConnection=((t={})[i.EConnection.In]=i.EConnection.Out,t[i.EConnection.Out]=i.EConnection.In,t)}return t.prototype.make=function(t,e){for(var n=[],i=0;i<t;++i){var o=[];n.push(o);for(var r=0;r<e;++r){var a=this.makePuzzle(n,t,e,i,r);o.push(a)}}return n},t.prototype.makePuzzle=function(t,e,n,o,r){var a=i.EConnection.None,s=i.EConnection.None,u=i.EConnection.None,h=i.EConnection.None;if(o>0){var f=t[o-1][r];a=this.getOppositeConnection(f.BottomConnection)}if(r>0){var l=t[o][r-1];h=this.getOppositeConnection(l.RightConnection)}return o<e-1&&(u=this.getRandomConnection()),r<n-1&&(s=this.getRandomConnection()),{TopConnection:a,RightConnection:s,BottomConnection:u,LeftConnection:h}},t.prototype.getRandomConnection=function(){return Math.random()<.5?i.EConnection.In:i.EConnection.Out},t.prototype.getOppositeConnection=function(t){return this._oppositeConnection[t]},t}();e.default=o},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e,n,i){this._isOnTargetPosition=!1,this.Id=t,this.Connections=e,this.TargetPosition=n,this.View=i,this._isOnTargetPosition=!1}return Object.defineProperty(t.prototype,"IsOnTargetPosition",{get:function(){return this._isOnTargetPosition},enumerable:!1,configurable:!0}),t.prototype.putOnTargetPosition=function(){this.View.setPosition(this.TargetPosition),this._isOnTargetPosition=!0},t}();e.default=i},function(t,e,n){"use strict";var i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=i(n(0)),a=function(){function t(t,e,n){this._sizeOfInnerPartOfPiece=r.default.InnerQuadSize,this._offset=r.default.BorderSize,this._pieceSize=r.default.PuzzleTotalSize,this._maskPartsAreas={"horiz-out":[0,50,30,10],"vert-out":[70,0,10,30],"horiz-in":[0,0,50,10],"vert-in":[50,0,10,50],quad:[0,20,30,30],"horiz-solid":[0,10,50,10],"vert-solid":[60,0,10,50]},this._borderPartsAreas={"horiz-in-top":[0,60,50,10],"horiz-in-bottom":[0,69,50,10],"horiz-out-top":[0,69,50,10],"horiz-out-bottom":[0,60,50,10],"horiz-solid-top":[0,88,50,1],"horiz-solid-bottom":[0,79,50,10],"vert-in-left":[52,50,10,50],"vert-in-right":[61,50,10,50],"vert-out-left":[61,50,10,50],"vert-out-right":[52,50,10,50],"vert-solid-left":[71,50,10,50],"vert-solid-right":[80,50,1,50]},this._patternsAtlas=e,this._target=n,this._textureManager=t}return t.prototype.generateTextureForPuzzle=function(t,e,n){var i="puzzlePiece-"+t,o=this._textureManager.createCanvas(i,this._pieceSize,this._pieceSize),a=o.context;this.drawPuzzlePieceMask(a,n),a.globalCompositeOperation="source-in";var s=e.x-r.default.PuzzleTotalSize/2,u=e.y-r.default.PuzzleTotalSize/2;return a.drawImage(this._target,s,u,r.default.PuzzleTotalSize,r.default.PuzzleTotalSize,0,0,r.default.PuzzleTotalSize,r.default.PuzzleTotalSize),a.globalCompositeOperation="source-over",this.drawPuzzlePieceBorder(a,n),a.save(),o.refresh(),i},t.prototype.drawPatternPiece=function(t,e,n,i,o){var r=this._maskPartsAreas[n],a=r[0],s=r[1],u=r[2],h=r[3];e.drawImage(t,a,s,u,h,i,o,u,h)},t.prototype.drawnBorder=function(t,e,n,i,o){var r=this._borderPartsAreas[n],a=r[0],s=r[1],u=r[2],h=r[3];e.drawImage(t,a,s,u,h,i,o,u,h)},t.prototype.drawPuzzlePieceMask=function(t,e){this.drawPatternPiece(this._patternsAtlas,t,"quad",2*this._offset,2*this._offset),e.BottomConnection==o.EConnection.In?this.drawPatternPiece(this._patternsAtlas,t,"horiz-in",this._offset,this._sizeOfInnerPartOfPiece):(this.drawPatternPiece(this._patternsAtlas,t,"horiz-solid",this._offset,this._sizeOfInnerPartOfPiece),e.BottomConnection==o.EConnection.Out&&this.drawPatternPiece(this._patternsAtlas,t,"horiz-out",this._offset,this._sizeOfInnerPartOfPiece+this._offset)),e.TopConnection==o.EConnection.In?this.drawPatternPiece(this._patternsAtlas,t,"horiz-in",this._offset,this._offset):(this.drawPatternPiece(this._patternsAtlas,t,"horiz-solid",this._offset,this._offset),e.TopConnection==o.EConnection.Out&&this.drawPatternPiece(this._patternsAtlas,t,"horiz-out",this._offset,0)),e.RightConnection==o.EConnection.In?this.drawPatternPiece(this._patternsAtlas,t,"vert-in",this._sizeOfInnerPartOfPiece,this._offset):(this.drawPatternPiece(this._patternsAtlas,t,"vert-solid",this._sizeOfInnerPartOfPiece,this._offset),e.RightConnection==o.EConnection.Out&&this.drawPatternPiece(this._patternsAtlas,t,"vert-out",this._sizeOfInnerPartOfPiece+this._offset,this._offset)),e.LeftConnection==o.EConnection.In?this.drawPatternPiece(this._patternsAtlas,t,"vert-in",this._offset,this._offset):(this.drawPatternPiece(this._patternsAtlas,t,"vert-solid",this._offset,this._offset),e.LeftConnection==o.EConnection.Out&&this.drawPatternPiece(this._patternsAtlas,t,"vert-out",0,this._offset))},t.prototype.drawPuzzlePieceBorder=function(t,e){e.BottomConnection==o.EConnection.In?this.drawnBorder(this._patternsAtlas,t,"horiz-in-bottom",this._offset,this._sizeOfInnerPartOfPiece):e.BottomConnection==o.EConnection.Out?this.drawnBorder(this._patternsAtlas,t,"horiz-out-bottom",this._offset,this._sizeOfInnerPartOfPiece+this._offset):this.drawnBorder(this._patternsAtlas,t,"horiz-solid-bottom",this._offset,this._sizeOfInnerPartOfPiece),e.LeftConnection==o.EConnection.In?this.drawnBorder(this._patternsAtlas,t,"vert-in-left",this._offset,this._offset):e.LeftConnection==o.EConnection.Out?this.drawnBorder(this._patternsAtlas,t,"vert-out-left",0,this._offset):this.drawnBorder(this._patternsAtlas,t,"vert-solid-left",0,this._offset),e.RightConnection==o.EConnection.In?this.drawnBorder(this._patternsAtlas,t,"vert-in-right",this._sizeOfInnerPartOfPiece,this._offset):e.RightConnection==o.EConnection.Out?this.drawnBorder(this._patternsAtlas,t,"vert-out-right",this._sizeOfInnerPartOfPiece+this._offset,this._offset):this.drawnBorder(this._patternsAtlas,t,"vert-solid-right",this._sizeOfInnerPartOfPiece+this._offset,this._offset),e.TopConnection==o.EConnection.In?this.drawnBorder(this._patternsAtlas,t,"horiz-in-top",this._offset,this._offset):e.TopConnection==o.EConnection.Out?this.drawnBorder(this._patternsAtlas,t,"horiz-out-top",this._offset,0):this.drawnBorder(this._patternsAtlas,t,"horiz-solid-top",this._offset,this._offset)},t}();e.default=a},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t,e){this.x=t,this.y=e};e.default=i},function(t,e,n){"use strict";var i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var o=i(n(0)),r=i(n(14)),a=function(){function t(t,e,n,i){this._puzzleViewByName=new Map,this._gameObjectFactory=t,this._tweensManager=e,this._inputManager=n,this.onDragStart=this.onDragStart.bind(this),this.onDrag=this.onDrag.bind(this),this.onDragEnd=this.onDragEnd.bind(this),this._inputManager.on("dragstart",this.onDragStart),this._inputManager.on("drag",this.onDrag),this._inputManager.on("dragend",this.onDragEnd),this._debugGraphics=this._gameObjectFactory.graphics(o.default.DebugDrawingConfigs),this._debugGraphics.setDepth(1e4),this._movedCallback=i}return t.prototype.constructGamePuzzle=function(t,e,n,i){void 0===i&&(i=!1);var a=e.x,s=e.y;i&&(a=Math.random()*o.default.CanvasWidth,s=Math.random()*o.default.CanvasHeight);var u=this._gameObjectFactory.image(0,0,n).setOrigin(.5,.5).setAlpha(o.default.PuzzleShadowAlpha).setTint(0),h=this._gameObjectFactory.image(0,0,n).setOrigin(.5,.5).setName(t.toString()),f=new Phaser.Geom.Rectangle(o.default.BorderSize,o.default.BorderSize,o.default.InnerQuadSize,o.default.InnerQuadSize);h.setInteractive(f,Phaser.Geom.Rectangle.Contains),this._inputManager.setDraggable(h);var l=new r.default(n,e,h,u);return l.setPosition({x:a,y:s}),this._puzzleViewByName[h.name]=l,l},t.prototype.onDragStart=function(t,e){var n=e.name;n&&this._puzzleViewByName[n].startZoomInAnimation(this._tweensManager)},t.prototype.onDragEnd=function(t,e){this._debugGraphics.clear();var n=e.name;n&&(this._puzzleViewByName[n].startZoomOutAnimation(this._tweensManager),this._movedCallback(+n,t))},t.prototype.onDrag=function(t,e){if(null!=e&&e.name){var n=this._puzzleViewByName[e.name];n&&(n.setPosition(t),this.drawLineToPositionOnDrag(n.MainSprite,n.TargetPosition))}},t.prototype.drawLineToPositionOnDrag=function(t,e){var n=new Phaser.Geom.Line(t.x,t.y,e.x,e.y);this._debugGraphics.clear(),this._debugGraphics.strokeLineShape(n)},t}();e.default=a},function(t,e,n){"use strict";var i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});var o=i(n(0)),r=function(){function t(t,e,n,i){this.Texture=t,this.TargetPosition=e,this.MainSprite=n,this.ShadowSprite=i}return t.prototype.setPosition=function(e){var n=t.getSpriteShadowPosition(e);this.MainSprite.setPosition(e.x,e.y),this.ShadowSprite.setPosition(n.x,n.y)},t.prototype.startZoomInAnimation=function(e){t.startScaleOutTween(this.MainSprite,e),t.startScaleOutTween(this.ShadowSprite,e)},t.prototype.startZoomOutAnimation=function(e){e.killTweensOf(this.MainSprite),e.killTweensOf(this.ShadowSprite),t.startScaleInTween(this.MainSprite,e),t.startScaleInTween(this.ShadowSprite,e)},t.startScaleOutTween=function(t,e){e.add({targets:t,scale:{from:1,to:o.default.PuzzleScaleOnOver},ease:o.default.PuzzleScalingOutAnimzationEase,duration:o.default.PuzzleScalingOutAnimzationDuration})},t.startScaleInTween=function(t,e){e.add({targets:t,scale:{from:t.scale,to:1},ease:o.default.PuzzleScalingInAnimzationEase,duration:o.default.PuzzleScalingInAnimzationDuration})},t.getSpriteShadowPosition=function(t){return{x:t.x+o.default.PuzzleShadowOffset,y:t.y+o.default.PuzzleShadowOffset}},t}();e.default=r}]);