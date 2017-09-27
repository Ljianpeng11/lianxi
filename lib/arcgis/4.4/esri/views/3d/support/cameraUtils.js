// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.4/esri/copyright.txt for details.
//>>built
define("dojo/_base/lang ../../../geometry/SpatialReference ../../../config ../../../geometry/Point ../../../geometry/support/webMercatorUtils ../../../Camera ../lib/glMatrix ./mathUtils ./earthUtils ./projectionUtils ./cameraUtilsPlanar ./cameraUtilsSpherical".split(" "),function(L,r,D,t,x,y,M,u,v,q,E,F){function w(a,b){return"global"===a.viewingMode?F[b]:E[b]}function G(a,b,c){var e=a.renderSpatialReference,d=n.set(b.viewForward,N),d=H(a,b.eye,d,b.up,O);a=a.spatialReference||r.WGS84;q.vectorToVector(b.eye,
e,k,a)||(a=r.WGS84,q.vectorToVector(b.eye,e,k,a));return c?(c.position.x=k[0],c.position.y=k[1],c.position.z=k[2],c.position.spatialReference=a,c.heading=d.heading,c.tilt=d.tilt,c.fov=u.rad2deg(b.fov),c):new y(new t(k,a),d.heading,d.tilt,u.rad2deg(b.fov))}function I(a,b,c){var e=a.navigation.currentCamera,d=e.fovX,e=e.width/2;"global"===a.viewingMode&&null!=c&&(b*=Math.cos(u.deg2rad(c)));b/=a.renderCoordsHelper.unitInMeters;return e/(39.37*D.screenDPI/b)/Math.tan(d/2)}function J(a,b,c){var e=a.navigation.currentCamera;
b=39.37*D.screenDPI/(e.width/2/(b*Math.tan(e.fovX/2)));"global"===a.viewingMode&&(b/=Math.cos(u.deg2rad(c)));return b*=a.renderCoordsHelper.unitInMeters}function K(a,b,c,e,d,f){var h=a.renderSpatialReference;b=z(a,e.heading,e.tilt,b,c,d);a=q.vectorToPoint(b.eye,h,a.spatialReference||r.WGS84);if(!a)return null;if(!f)return new y(a,b.heading,b.tilt,e.fov);f.position=a;f.heading=b.heading;f.tilt=b.tilt;f.fov=e.fov;return f}function H(a,b,c,e,d){return w(a,"directionToHeadingTilt")(b,c,e,d)}function z(a,
b,c,e,d,f){var h=n.create(),l=a.renderSpatialReference;if(e&&e instanceof t){var g=e;q.pointToVector(g,h,a.renderSpatialReference);null==g.z&&("global"===a.viewingMode?a._pickRay([0,0,0],h):a._pickRay([h[0],h[1]-1,h[2]],h),null!=a.basemapTerrain&&(g=a.basemapTerrain.getElevation(g),null!=g&&a.renderCoordsHelper.setAltitude(g,h)))}else e?n.set(e,h):n.set(a.navigation.currentCamera.center,h);e&&e instanceof t||(e=q.vectorToPoint(h,l,a.spatialReference||r.WGS84));d=Math.max(d,a.navigation.minPoiDist);
l=c;c=d;if(!(g=f&&f.noReset))var p=e,g=a.engineToScreen(a.navigation.currentCamera.center),m=a.toScreen(p),p=g.x-m.x,g=g.y-m.y,g=!(Math.sqrt(p*p+g*g)>5*Math.max(a.width,a.height));g?(l=w(a,"eyeTiltToLookAtTilt")(h,c,l),l=a.navigation.constraints.tilt.apply(l,c),l=w(a,"lookAtTiltToEyeTilt")(h,c,l)):(b=0,l=a.navigation.constraints.tilt.min(c));c=l;b=w(a,"eyeForCenterWithHeadingTilt")(h,d,b,c);b.center=h;return f&&f.noReset||"global"!==a.viewingMode||(h=a.renderCoordsHelper.fromRenderCoords(b.eye,B,
a.spatialReference)?a.basemapTerrain&&(a.basemapTerrain.getElevation(B)||0)>B.z-1:!1,!h)?b:(h=a.navigation.constraints.tilt.min(d),z(a,0,h,e,d,L.mixin({},f,{noReset:!0})))}var n=M.vec3d,k=n.create(),A=n.create(),N=n.create(),O={heading:0,tilt:0},B=new t,C=new u.Cyclical(-2.0037508342788905E7,2.0037508342788905E7);return{externalToInternal:function(a,b){var c=a.renderSpatialReference,e=w(a,"headingTiltToDirectionUp"),d=n.create();return q.pointToVector(b.position,d,c)?(c=e(d,b.heading,b.tilt),n.add(c.direction,
d),a=a.navigation.getCameraIntersectTerrain(d,c.direction,c.up),a.fov=u.deg2rad(b.fov),a):null},internalToExternal:G,scaleToDistance:I,distanceToScale:J,fromExtent:function(a,b,c,e,d){e instanceof y&&(d=e,e={});var f="global"===a.viewingMode,h=a.renderSpatialReference,l=a.spatialReference||r.WGS84,g=r.WebMercator,p=b.spatialReference||g,m,n=0;null!=b.zmax&&null!=b.zmin&&(m=(b.zmax+b.zmin)/2,n=b.zmax-b.zmin);if(f){var f=new t(b.xmin,b.ymin,p),k=new t(b.xmax,b.ymax,p),f=x.project(f,g),k=x.project(k,
g);if(null===f||null===k)return;b=new t(C.center(f.x,k.x),(k.y+f.y)/2,g);null!=m&&(b.z=m);m=v.getGreatCircleSpanAt(b,f,k);g=m.lon;p=m.lat;C.diff(f.x,k.x)>C.range/2&&(g+=v.halfEarthCircumference);g=Math.min(g,v.halfEarthCircumference);p=Math.min(p,v.halfEarthCircumference)}else x.canProject(b,l)&&(b=x.project(b,l)),g=b.xmax-b.xmin,p=b.ymax-b.ymin,b=new t({x:b.xmin+.5*g,y:b.ymin+.5*p,z:m,spatialReference:l});m=a.navigation.currentCamera;c=z(a,c.heading,c.tilt,b,Math.max(1/Math.tan(m.fovX/2)*g*.5,1/
Math.tan(m.fovY/2)*p*.5,1/Math.tan(m.fov/2)*n*.5)/1,e);h=q.vectorToPoint(c.eye,h,l);if(!h)return null;d||(d=new y);d.position=h;d.heading=c.heading;d.tilt=c.tilt;d.fov=a.camera.fov;return d},toExtent:function(a,b,c,e,d){var f;f=a.renderSpatialReference;b||(c||(c=a.navigation.currentCamera),b=G(a,c,d));if(c)d=q.vectorToPoint(c.center,f,a.spatialReference||r.WGS84),f=c.distance;else{d=a.toMap(a.screenCenter);if(!d)return null;f=v.computeCarthesianDistance(b.position,d)}c||(c=a.navigation.currentCamera);
b=2*f*Math.tan(c.fovX/2)*1;c=2*f*Math.tan(c.fovY/2)*1;return"global"===a.viewingMode?F.toExtent(a,d,b,c,e):E.toExtent(a,d,b,c,e)},fromCenterScale:function(a,b,c,e,d,f){c=I(a,c,b.latitude);return K(a,b,c,e,d,f)},fromCenterDistance:K,directionToHeadingTilt:H,eyeHeadingTiltForCenterPointAtDistance:z,scaleToZoom:function(a,b){return(a=a.get("basemapTerrain.tilingScheme"))?a.levelAtScale(b):void 0},zoomToScale:function(a,b){return(a=a.get("basemapTerrain.tilingScheme"))?a.scaleAtLevel(b):void 0},computeScale:function(a,
b,c){var e=a.renderSpatialReference;b||(b=a.navigation.currentCamera);var d;d=r.WGS84;b.center?(q.vectorToVector(b.center,e,A,d),d=A[1],b=b.distance):(d=b.position.latitude,q.pointToVector(b.position,k,e),q.pointToVector(c,A,e),b=n.dist(k,A));return J(a,b,d)}}});