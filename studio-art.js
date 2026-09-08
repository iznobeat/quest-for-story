// Collectible props are separate from the clean background, so saves can hide them.
export class StudioProps {
 constructor(){this.cells={};this.image=new Image();this.image.onload=()=>this.prepare();this.image.src='assets/studio-props.png';}
 prepare(){const im=this.image,c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;
  for(const [col,id] of ['cable','manual'].entries()){const split=Math.floor(c.width*.46),start=col===0?0:split,end=col===0?split:c.width;let l=end,r=start,t=c.height,b=0;for(let y=0;y<c.height;y++)for(let x=start;x<end;x++)if(d[(y*c.width+x)*4+3]>90){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y)}if(r>=l&&b>=t)this.cells[id]={x:l,y:t,w:r-l+1,h:b-t+1};}
 }
 draw(ctx,state,episode){if(state.scene!=='newsroom')return;for(const [id,x,y,w,h] of episode.props){const c=this.cells[id];if(!c||!episode.objectVisible(state,id))continue;ctx.drawImage(this.image,c.x,c.y,c.w,c.h,x*7.68,y*4.32,w*7.68,h*4.32);}}
}
