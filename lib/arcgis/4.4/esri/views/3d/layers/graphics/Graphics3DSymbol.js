// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.4/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/extendsHelper ../../support/PromiseLightweight ./Graphics3DGraphic ./Graphics3DSymbolLayerFactory".split(" "),function(u,v,p,q,r,t){return function(l){function g(b,f,c){var a=l.call(this)||this;a.symbol=b;b=b.symbolLayers;c&&(b=c.concat(b));c=b.length;a.childGraphics3DSymbols=Array(b.length);a.childGraphics3DSymbolPromises=Array(b.length);for(var e=f.layerOrder,d=0,g=0,m=!1,n=function(b,a){a&&(this.childGraphics3DSymbols[b]=a,g++);d--;!this.isRejected()&&
m&&1>d&&(0<g?this.resolve():this.reject())},h=0;h<c;h++){var k=b.getItemAt(h);!1!==k.enabled&&(f.layerOrder=e+(1-(1+h)/c),f.layerOrderDelta=1/c,k=t.make(a.symbol,k,f,k._ignoreDrivers))&&(d++,a.childGraphics3DSymbolPromises[h]=k,k.then(n.bind(a,h,k),n.bind(a,h,null)))}f.layerOrder=e;m=!0;!a.isRejected()&&1>d&&(0<g?a.resolve():a.reject());return a}p(g,l);g.prototype.createGraphics3DGraphic=function(b,f,c){for(var a=Array(this.childGraphics3DSymbols.length),e=0;e<this.childGraphics3DSymbols.length;e++){var d=
this.childGraphics3DSymbols[e];d&&(a[e]=d.createGraphics3DGraphic(b,f))}return new r(b,c||this,a)};g.prototype.layerPropertyChanged=function(b,f){for(var c=this.childGraphics3DSymbols.length,a=function(a){var c=e.childGraphics3DSymbols[a],d=function(b){return b._graphics[a]};if(c&&!c.layerPropertyChanged(b,f,d))return{value:!1}},e=this,d=0;d<c;d++){var g=a(d);if("object"===typeof g)return g.value}return!0};g.prototype.applyRendererDiff=function(b,f,c){return this.isResolved()?this.childGraphics3DSymbols.reduce(function(a,
e,d){return a&&(!e||e.applyRendererDiff(b,f,c,d))},!0):!1};g.prototype.getFastUpdateStatus=function(){var b=0,f=0,c=0;this.childGraphics3DSymbolPromises.forEach(function(a){a&&!a.isFulfilled()?b++:a&&a.isFastUpdatesEnabled()?c++:a&&f++});return{loading:b,slow:f,fast:c}};g.prototype.setDrawOrder=function(b,f){for(var c=this.childGraphics3DSymbols.length,a=1/c,e=0;e<c;e++){var d=this.childGraphics3DSymbols[e];d&&d.setDrawOrder(b+(1-(1+e)/c),a,f)}};g.prototype.destroy=function(){this.isFulfilled()||
this.reject();for(var b=0;b<this.childGraphics3DSymbolPromises.length;b++)this.childGraphics3DSymbolPromises[b]&&this.childGraphics3DSymbolPromises[b].destroy()};return g}(q.Promise)});