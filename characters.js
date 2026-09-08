export const cast=['joachim','zendar','haj','mgjesdal','kiiim','izno'];
export const characterNames={joachim:'Joachim Froholt',zendar:'Zendar',haj:'Haj · definitely not Retrogamingpappa',mgjesdal:'mgjesdal',kiiim:'Kiiim',izno:'Izno'};
export class Characters {
 constructor(){this.image=new Image();this.ready=false;this.cells=[];this.image.onload=()=>this.prepare();this.image.src='assets/characters.png';}
 prepare(){
  const image=this.image,c=document.createElement('canvas');c.width=image.width;c.height=image.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0);const data=g.getImageData(0,0,c.width,c.height).data;
  // The transparent master uses these observed inter-row gaps. The last row
  // supplies expressive upper-body poses; standing legs complete the rig.
  const edges=[0,277,543,803,1024],cw=image.width/6;
  for(let row=0;row<4;row++){this.cells[row]=[];for(let col=0;col<6;col++){
   const start=edges[row],ch=edges[row+1]-start;let left=cw,right=0,top=ch,bottom=0;
   for(let y=0;y<ch;y++)for(let x=2;x<cw-2;x++){const a=data[((start+y)*c.width+col*cw+x)*4+3];if(a>90){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}}
   let sum=0,count=0;
   for(let y=top;y<top+(bottom-top)*.2;y++)for(let x=left;x<=right;x++){if(data[((Math.floor(start+y)*c.width)+col*cw+x)*4+3]>90){sum+=x;count++}}
   this.cells[row][col]={x:col*cw+left,y:start+top,w:Math.max(1,right-left+1),h:Math.max(1,bottom-top+1),anchor:(count?sum/count:(left+right)/2)-left};
  }}this.ready=true;
 }
 draw(ctx,x,y,id,{time=0,height=130,walking=false,facing=1,speaking=false,gesture=false,aspect=1,reduced=false}={}){
  if(!this.ready)return;
  const col=cast.indexOf(id),base=this.cells[0][col],pose=this.cells[3][col];
  const phase=time/1000+col*.83,scale=height/base.h,width=base.w*scale,anchor=base.anchor*scale;
  const stride=time/145,breath=reduced?0:Math.sin(phase*2.1)*.6;
  const bob=walking&&!reduced?Math.abs(Math.sin(stride))*1.5:0;
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(facing*aspect,1);ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#040a155c';ctx.beginPath();ctx.ellipse(0,0,width*.35,3,0,0,Math.PI*2);ctx.fill();ctx.translate(0,-bob);
  // Breathing pivots around the soles; idle characters never lift off the floor.
  if(!walking)ctx.scale(1,1+breath/height);
  const paint=(cell,sy,sh,dx,dy,dw,dh)=>ctx.drawImage(this.image,cell.x,cell.y+sy,cell.w,sh,dx,dy,dw,dh);
  if(walking&&!reduced){
   // Render complete walk poses: independently splicing torso, hips and
   // knees exposed gaps where the illustrated clothing did not line up.
   const frame=[1,0,2,0][Math.floor(time/145)%4];
   const walk=this.cells[frame][col],walkScale=height/walk.h;
   ctx.drawImage(this.image,walk.x,walk.y,walk.w,walk.h,
    -walk.anchor*walkScale,-height,walk.w*walkScale,height);
  }else{
   const idleGesture=!reduced&&id!=='joachim'&&((phase%(9+col))>8.1&&(phase%(9+col))<8.9);
   if(id==='kiiim'){
    // His long coat and cropped gesture pose have incompatible silhouettes.
    // Animate one complete sprite continuously instead of splicing its waist
    // or alternating two differently registered heads. Feet stay anchored.
    ctx.save();
    if(speaking&&!reduced)ctx.transform(1,0,Math.sin(time/260)*.008,1,0,0);
    paint(base,0,base.h,-anchor,-height,width,height);
    ctx.restore();
   }else if(speaking||gesture||idleGesture){
    const lower=base.h*.64;paint(base,lower,base.h-lower,-anchor,-height+lower*scale,width,(base.h-lower)*scale);
    // Retain the complete standing lower body and overlay the gesture rig.
    // Clipped waist-up source art is never rendered as a floating character.
    const torso=base.h*.64;
    paint(pose,0,Math.min(pose.h,torso),-pose.anchor*scale,-height,pose.w*scale,Math.min(pose.h,torso)*scale);

   }else paint(base,0,base.h,-anchor,-height,width,height);
  }
  if(id==='kiiim'&&!reduced){ctx.fillStyle=`rgba(135,246,161,${.12+Math.sin(phase*3)*.08})`;ctx.beginPath();ctx.ellipse(0,-height*.57,width*.065,height*.026,0,0,7);ctx.fill()}
  ctx.restore();
 }
 portrait(canvas,id,{facing=1}={}){if(!this.ready)return;const ctx=canvas.getContext('2d'),col=cast.indexOf(id);if(col<0)return;const cell=this.cells[0][col];ctx.clearRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;const size=cell.h*.36;ctx.save();if(facing<0){ctx.translate(canvas.width,0);ctx.scale(-1,1)}ctx.drawImage(this.image,cell.x+cell.anchor-size/2,cell.y,size,size,0,0,canvas.width,canvas.height);ctx.restore();}
}
