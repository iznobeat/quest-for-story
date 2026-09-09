// Each collectible is its own alpha sprite, so collecting it removes the art too.
export class CivProps {
 constructor(){this.cells={};this.image=new Image();this.image.onload=()=>this.prepare();this.image.src='assets/civ-props.png';}
 prepare(){const im=this.image,c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;
  for(const [i,id] of ['comb','napkin','flower','ribbon'].entries()){const x0=Math.floor(i%2*c.width/2),x1=Math.floor((i%2+1)*c.width/2),y0=Math.floor(Math.floor(i/2)*c.height/2),y1=Math.floor((Math.floor(i/2)+1)*c.height/2);let l=x1,r=x0,t=y1,b=y0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(d[(y*c.width+x)*4+3]>90){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y)}if(r>=l&&b>=t)this.cells[id]={x:l,y:t,w:r-l+1,h:b-t+1};}
 }
 draw(ctx,s,episode){for(const [id,scene,x,y,w,h] of episode.props){const c=this.cells[id];if(s.scene===scene&&c&&episode.objectVisible(s,id))ctx.drawImage(this.image,c.x,c.y,c.w,c.h,x*7.68,y*4.32,w*7.68,h*4.32);}}
}
