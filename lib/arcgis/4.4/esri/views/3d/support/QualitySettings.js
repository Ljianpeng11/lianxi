// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.4/esri/copyright.txt for details.
//>>built
define("require exports ../../../core/tsSupport/extendsHelper ../../../core/tsSupport/decorateHelper ../../../core/accessorSupport/typescript ../../../core/Accessor".split(" "),function(c,k,g,a,b,h){var d=function(a){function b(){return null!==a&&a.apply(this,arguments)||this}g(b,a);return b}(h);a([b.property({value:1})],d.prototype,"lodFactor",void 0);var d=a([b.subclass()],d),e=function(a){function b(){return null!==a&&a.apply(this,arguments)||this}g(b,a);b.prototype.getDefaults=function(){return{"3dObject":new d,
point:new d,integratedMesh:new d,pointCloud:new d}};return b}(h);a([b.property()],e.prototype,"3dObject",void 0);a([b.property()],e.prototype,"point",void 0);a([b.property()],e.prototype,"integratedMesh",void 0);a([b.property()],e.prototype,"pointCloud",void 0);var e=a([b.subclass()],e),f=function(a){function b(){return null!==a&&a.apply(this,arguments)||this}g(b,a);return b}(h);a([b.property({value:0})],f.prototype,"lodBias",void 0);a([b.property({value:1})],f.prototype,"angledSplitBias",void 0);
f=a([b.subclass()],f);c=function(a){function b(){return null!==a&&a.apply(this,arguments)||this}g(b,a);b.prototype.getDefaults=function(){return{sceneService:new e,tiledSurface:new f,antialiasingEnabled:!0}};return b}(h);a([b.property()],c.prototype,"sceneService",void 0);a([b.property()],c.prototype,"tiledSurface",void 0);a([b.property()],c.prototype,"antialiasingEnabled",void 0);a([b.property()],c.prototype,"gpuMemoryLimit",void 0);return c=a([b.subclass()],c)});