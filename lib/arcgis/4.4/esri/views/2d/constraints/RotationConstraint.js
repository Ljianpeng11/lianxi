// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.4/esri/copyright.txt for details.
//>>built
define("require exports ../../../core/tsSupport/declareExtendsHelper ../../../core/tsSupport/decorateHelper ../../../core/accessorSupport/decorators ../../../core/Accessor".split(" "),function(b,g,e,c,a,f){b=d=function(b){function a(){var a=null!==b&&b.apply(this,arguments)||this;a.enabled=!0;a.rotationEnabled=!0;return a}e(a,b);a.prototype.constrain=function(a,b){if(!this.enabled)return a;this.rotationEnabled||(a.rotation=0);return a};a.prototype.clone=function(){return new d({enabled:this.enabled,
rotationEnabled:this.rotationEnabled})};return a}(a.declared(f));c([a.property()],b.prototype,"enabled",void 0);c([a.property()],b.prototype,"rotationEnabled",void 0);b=d=c([a.subclass("esri.views.2d.constraints.RotationConstraint")],b);var d;return b});