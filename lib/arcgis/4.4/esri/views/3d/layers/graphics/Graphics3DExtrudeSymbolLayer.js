// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.4/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/extendsHelper ./Graphics3DSymbolLayer ./Graphics3DGraphicLayer ./Graphics3DSymbolCommonCode ../../../../geometry/Polygon ../../../../geometry/Point ../../support/projectionUtils ../../lib/glMatrix ../../webgl-engine/Stage ../../webgl-engine/lib/Object3D ../../webgl-engine/lib/Geometry ../../webgl-engine/lib/GeometryData ../../webgl-engine/materials/Material ../../webgl-engine/lib/Util ./earcut/earcut ./graphicUtils".split(" "),function(M,oa,Y,Z,aa,
G,ba,ca,da,N,O,ea,fa,ga,ha,ia,ja,ka){function la(d,e,a,b,c,g,f,t,w,q,l,v,h,ma){var p=a.length/3,B=0;l+=2*b.count;var k=b.index,y=b.count,n=w,u=l;m.set(h,r);var x=0<v?1:-1,k=3*k,A=n;h=3*A;for(var C=n+y,n=3*C,D=0;D<y;++D)ma&&(r[0]=d[k+0],r[1]=d[k+1],r[2]=d[k+2],m.normalize(r)),c[h+0]=d[k+0],c[h+1]=d[k+1],c[h+2]=d[k+2],g[h+0]=e[k+0],g[h+1]=e[k+1],g[h+2]=e[k+2],f[h+0]=-x*r[0],f[h+1]=-x*r[1],f[h+2]=-x*r[2],t[A]=0,c[n+0]=d[k+0]+v*r[0],c[n+1]=d[k+1]+v*r[1],c[n+2]=d[k+2]+v*r[2],g[n+0]=e[k+0],g[n+1]=e[k+1],
g[n+2]=e[k+2],f[n+0]=x*r[0],f[n+1]=x*r[1],f[n+2]=x*r[2],t[C]=v,h+=3,n+=3,k+=3,A+=1,C+=1;k=0;h=3*u;n=3*(u+p);h=3*(u+p);n=3*u;d=P;e=Q;0>v&&(d=Q,e=P);for(D=0;D<p;++D)q[h+0]=a[k+d[0]],q[h+1]=a[k+d[1]],q[h+2]=a[k+d[2]],q[n+0]=a[k+e[0]]+y,q[n+1]=a[k+e[1]]+y,q[n+2]=a[k+e[2]]+y,h+=3,n+=3,k+=3;w+=2*b.count;l=l+2*p-(2*b.count+2*p);R(c,g,t,f,B,b.pathLengths[0],b.count,w,q,l,v);w+=4*b.pathLengths[0];l+=2*b.pathLengths[0];B+=b.pathLengths[0];for(a=1;a<b.pathLengths.length;++a)R(c,g,t,f,B,b.pathLengths[a],b.count,
w,q,l,v),w+=4*b.pathLengths[a],l+=2*b.pathLengths[a],B+=b.pathLengths[a]}function K(d,e,a,b,c,g,f){b[g]=b[f];f*=3;g*=3;d[g+0]=d[f+0];d[g+1]=d[f+1];d[g+2]=d[f+2];e[g+0]=e[f+0];e[g+1]=e[f+1];e[g+2]=e[f+2];a[g+0]=c[0];a[g+1]=c[1];a[g+2]=c[2]}function R(d,e,a,b,c,g,f,t,w,q,l){var v=c,h=c+1,r=c+f,p=c+f+1,B=t,k=t+1,y=t+2*g;t=t+2*g+1;0>l&&(v=c+f+1,p=c);q*=3;for(var n=0;n<g;++n){n===g-1&&(0<l?(h=c,p=c+f):(h=c,v=c+f));var u=d,x=v,A=h,C=r,D=I,x=3*x,A=3*A,C=3*C;m.set3(u[x++],u[x++],u[x++],L);m.set3(u[A++],u[A++],
u[A++],S);m.set3(u[C++],u[C++],u[C++],T);m.subtract(S,L,U);m.subtract(T,L,V);m.cross(V,U,D);m.normalize(D,D);K(d,e,b,a,I,B,v);K(d,e,b,a,I,k,h);K(d,e,b,a,I,y,r);K(d,e,b,a,I,t,p);w[q++]=B;w[q++]=y;w[q++]=t;w[q++]=B;w[q++]=t;w[q++]=k;v++;h++;r++;p++;B+=2;k+=2;y+=2;t+=2}}function na(d,e,a,b){var c=b.setAltitude;J.spatialReference=a.spatialReference;for(var g=d.getGeometryRecords(),f=g.length,t="absolute-height"!==e.mode,w=0,q=0;q<f;q++){var l=g[q].geometry,v=g[q].transformation;E[0]=v[12];E[1]=v[13];
E[2]=v[14];l.invalidateBoundingInfo();for(var h=l.getData().getVertexAttr(),l=h[z.POSITION].data,v=h[z.SIZE].data,h=h.mapPos.data,m=l.length/3,p=0,r=0,k=!1,y=0,n=0;n<m;n++){J.x=h[r];J.y=h[r+1];J.z=h[r+2];H[0]=l[p];H[1]=l[p+1];H[2]=l[p+2];var u=G.computeElevation(a,J,e,t?W:null);t&&(y+=W.terrainElevation);F[0]=l[p]+E[0];F[1]=l[p+1]+E[1];F[2]=l[p+2]+E[2];c(u+v[p/3],F,0);l[p]=F[0]-E[0];l[p+1]=F[1]-E[1];l[p+2]=F[2]-E[2];u=.01/b.unitInMeters;if(Math.abs(H[0]-l[p])>u||Math.abs(H[1]-l[p+1])>u||Math.abs(H[2]-
l[p+2])>u)k=!0;r+=3;p+=3}k&&d.geometryVertexAttrsUpdated(q);w+=y/m}return w/f}var z=ia.VertexAttrConstants,m=N.vec3d,X=N.mat4d,F=m.create(),r=m.create(),P=[0,2,1],Q=[0,1,2],J=new ca,W={verticalDistanceToGround:0,terrainElevation:0};M=function(d){function e(){return null!==d&&d.apply(this,arguments)||this}Y(e,d);e.prototype._prepareResources=function(){if(!this._isPropertyDriven("size")){var a=ka.validateSymbolLayerSize(this._getSymbolSize());if(a){this._logWarning(a);this.reject();return}}var a=this._getStageIdHint(),
b=this._getMaterialOpacityAndColor(),c=m.create(b),b=b[3],c={diffuse:c,ambient:c,opacity:b,transparent:1>b||this._isPropertyDriven("opacity"),vertexColors:!0};this._material=new ha(c,a+"_3dlinemat");this._context.stage.add(O.ModelContentType.MATERIAL,this._material);this.resolve()};e.prototype.destroy=function(){this.isFulfilled()||this.reject();this._material&&this._context.stage.remove(O.ModelContentType.MATERIAL,this._material.getId())};e.prototype.createGraphics3DGraphic=function(a,b){var c=a.geometry;
if("polygon"!==c.type&&"extent"!==c.type)return this._logWarning("unsupported geometry type for extrude symbol: "+c.type),null;var c="polygon"===c.type||"extent"===c.type?"rings":"paths",g="graphic"+a.uid,f=this._getVertexOpacityAndColor(b,Float32Array,255),e=this.getGraphicElevationInfo(a);return this._createAs3DShape(a,c,b,f,e,g,a.uid)};e.prototype.layerPropertyChanged=function(a,b,c){if("opacity"===a)return b=this._getMaterialOpacity(),c=1>b||this._isPropertyDriven("opacity"),this._material.setParameterValues({opacity:b,
transparent:c}),!0;if("elevationInfo"===a){this._updateElevationInfo();for(var g in b){var f=b[g];if(a=c(f))f=this.getGraphicElevationInfo(f.graphic),a.needsElevationUpdates=G.needsElevationUpdates3D(f.mode),a.elevationInfo.set(f)}return!0}return!1};e.prototype._getExtrusionSize=function(a){a=a.size&&this._isPropertyDriven("size")?G.getSingleSizeDriver(a.size,2):this._getSymbolSize();return a/=this._context.renderCoordsHelper.unitInMeters};e.prototype._getSymbolSize=function(){return this.symbol.size||
1};e.prototype._createAs3DShape=function(a,b,c,g,f,e,d){a=a.geometry;"extent"===a.type&&(a=ba.fromExtent(a));b=a[b];var t=a.hasZ;if(0<b.length){var l=[],r=[],h=[],w=m.create(),p=Array(6),B=this._context.renderSpatialReference===da.SphericalRenderSpatialReference,k=this._getExtrusionSize(c),y=m.create();B||this._context.renderCoordsHelper.worldUpAtPosition(null,y);c=G.getGeometryVertexData3D(b,t,a.spatialReference,this._context.renderSpatialReference,this._context.elevationProvider,f);var n=c.geometryData.polygons,
u=c.eleVertexData,x=c.vertexData;a=x.length/3;var A=new Float64Array(18*a),C=new Float64Array(18*a),D=new Float64Array(18*a),E=new Float64Array(6*a),z=0;a=function(a){var b=n[a],c=b.count,d=b.index;if(F._context.clippingExtent&&(G.computeBoundingBox(u,d,c,p),G.boundingBoxClipped(p,F._context.clippingExtent)))return"continue";var f=new Float64Array(u.buffer,3*d*A.BYTES_PER_ELEMENT,3*c),t=b.holeIndices.map(function(a){return a-d}),f=ja(f,t,3);if(0<f.length){G.chooseOrigin(x,d,c,w);var t=new Uint32Array(6*
c+2*f.length),m=6*c,q=new Float64Array(A.buffer,3*z*A.BYTES_PER_ELEMENT,3*m),v=new Float64Array(C.buffer,3*z*C.BYTES_PER_ELEMENT,3*m),H=new Float64Array(D.buffer,3*z*D.BYTES_PER_ELEMENT,3*m),I=new Float64Array(E.buffer,1*z*E.BYTES_PER_ELEMENT,1*m);la(x,u,f,b,q,H,v,I,0,t,0,k,y,B);G.subtractCoordinates(q,0,m,w);z+=6*c;b=F._createExtrudeGeometry(t,{positions:q,elevation:H,normals:v,heights:I},g);a=new fa(b,e+"path"+a);a.singleUse=!0;l.push(a);r.push([F._material]);a=X.identity();X.translate(a,w,a);h.push(a)}};
var F=this;for(b=0;b<n.length;++b)a(b);return 0<l.length?(d=new ea({geometries:l,materials:r,transformations:h,castShadow:!0,metadata:{layerId:this._context.layer.id,graphicId:d},idHint:e}),d=new aa(this,d,l,null,null,na,f),d.alignedTerrainElevation=c.terrainElevation,d.needsElevationUpdates=G.needsElevationUpdates3D(f.mode),d):null}this._logWarning("no paths found for extrusion symbol");return null};e.prototype._createExtrudeGeometry=function(a,b,c){for(var d=a.length,f=new Uint32Array(d),e=0;e<
d;e++)f[e]=0;d={};e={};d[z.POSITION]=a;d[z.NORMAL]=a;d[z.COLOR]=f;e[z.POSITION]={size:3,data:b.positions};e[z.NORMAL]={size:3,data:b.normals};e[z.COLOR]={size:4,data:c};e[z.SIZE]={size:1,data:b.heights};b.elevation&&(e.mapPos={size:3,data:b.elevation},d.mapPos=a);return new ga(e,d)};return e}(Z);var I=m.create(),L=m.create(),S=m.create(),T=m.create(),U=m.create(),V=m.create(),H=m.create(),E=m.create();return M});