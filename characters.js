export const cast=['joachim','zendar','haj','mgjesdal','kiiim','izno'];
export const characterNames={nikolai:'Nikolai',terje:'Terje',mamen:'Mr. Mamen',sigve:'Sigve',joachim:'Joachim Froholt',zendar:'Zendar',haj:'Haj · definitely not Retrogamingpappa',mgjesdal:'mgjesdal',kiiim:'Kiiim',izno:'Izno'};
// Irregular syllable cadence; listening portraits always use the closed-mouth cell.
export function hostPortraitFrame(speaking,time,reduced=false){return speaking&&!reduced?[1,2,1,0,2,0,1,2][Math.floor(time/150)%8]:0;}
export class Characters {
 constructor(){this.guestCells={};this.guestImage=new Image();this.guestImage.onload=()=>this.prepareHosts(this.guestImage,['nikolai','terje'],this.guestCells);this.guestImage.src='assets/civ-guests.png';this.guestPortraitImage=new Image();this.guestPortraitImage.src='assets/civ-portraits.png';this.hostPortraitImage=new Image();this.hostPortraitImage.src='assets/studio-portraits.png';this.hostCells={};this.hostImage=new Image();this.hostImage.onload=()=>this.prepareHosts();this.hostImage.src='assets/studio-hosts.png';this.image=new Image();this.ready=false;this.cells=[];this.image.onload=()=>this.prepare();this.image.src='assets/characters.png';}
 prepareHosts(im=this.hostImage,ids=['mamen','sigve'],cells=this.hostCells){
  const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data,cw=c.width/2;
  for(const [col,id] of ids.entries()){let l=cw,r=0,t=c.height,b=0;for(let y=0;y<c.height;y++)for(let x=0;x<cw;x++)if(d[(y*c.width+col*cw+x)*4+3]>90){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y)}cells[id]={x:col*cw+l,y:t,w:r-l+1,h:b-t+1};}
 }
 drawHost(ctx,x,y,id,{time=0,height=186,facing=1,speaking=false,aspect=1,reduced=false}={}){
  const guest=['nikolai','terje'].includes(id),c=(guest?this.guestCells:this.hostCells)[id],im=guest?this.guestImage:this.hostImage;if(!c)return;const w=c.w*height/c.h,breath=reduced?0:Math.sin(time/650)*.6;
  ctx.save();ctx.translate(x,y);ctx.scale(aspect*(id==='sigve'?-1:1),1);ctx.fillStyle='#040a155c';ctx.beginPath();ctx.ellipse(0,0,w*.4,3,0,0,Math.PI*2);ctx.fill();
  if(speaking&&!reduced)ctx.transform(1,0,Math.sin(time/240)*.009,1,0,0);
  ctx.drawImage(im,c.x,c.y,c.w,c.h,-w/2,-height-breath,w,height+breath);ctx.restore();
 }
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
  if(['mamen','sigve','nikolai','terje'].includes(id)){this.drawHost(ctx,x,y,id,{time,height,facing,speaking,aspect,reduced});return}
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

  ctx.restore();
 }
 portrait(canvas,id,{facing=1,speaking=false,time=0,reduced=false}={}){
  if(!canvas)return;
  if(['mamen','sigve','nikolai','terje'].includes(id)){
   const guest=['nikolai','terje'].includes(id),g=canvas.getContext('2d'),im=guest?this.guestPortraitImage:this.hostPortraitImage;
   g.clearRect(0,0,canvas.width,canvas.height);g.imageSmoothingEnabled=false;
   if(im?.complete&&im.naturalWidth){
    const w=im.naturalWidth/3,h=im.naturalHeight/2,row=['mamen','nikolai'].includes(id)?0:1,frame=hostPortraitFrame(speaking,time,reduced);
    g.drawImage(im,frame*w,row*h,w,h,0,0,canvas.width,canvas.height);
   }else{
    const c=(guest?this.guestCells:this.hostCells)[id];if(!c)return;const size=c.h*.31;
    g.drawImage(guest?this.guestImage:this.hostImage,c.x+c.w/2-size/2,c.y,size,size,0,0,canvas.width,canvas.height);
   }
   return;
  }
  if(!this.ready)return;const ctx=canvas.getContext('2d'),col=cast.indexOf(id);if(col<0)return;
  const base=this.cells[0][col],frame=speaking&&!reduced&&[0,1,0,1,1,0][Math.floor(time/150)%6]?3:0,cell=this.cells[frame][col];
  ctx.clearRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;const size=base.h*.36;ctx.save();
  if(facing<0){ctx.translate(canvas.width,0);ctx.scale(-1,1)}
  ctx.drawImage(this.image,cell.x+cell.anchor-size/2,cell.y,size,size,0,0,canvas.width,canvas.height);ctx.restore();
 }
}
