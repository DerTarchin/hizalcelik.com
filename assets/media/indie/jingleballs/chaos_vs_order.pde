import ddf.minim.*;
import ddf.minim.ugens.*;

Minim       minim;
AudioOutput out;
Oscil       wave;

void setup(){
  size(1000,500); 
  minim = new Minim(this);
  out = minim.getLineOut();
  wave = new Oscil( 300, 0.5f, Waves.SINE );
  wave.patch( out );
}
 
void draw(){
  background(255);
  smooth(); 
 
 //golan's randomness
  float randomness = map(mouseX, 0,width, 0,1);
  randomness = constrain(randomness, 0,1);
 
  for (int i=1; i<width/50; i++){
    float rand1 = randomness * random(-15,15); 
    float rand2 = randomness * random(-15,15);
    float freq = 200+ randomness* random(0, 680);
    wave.setFrequency( freq );
    fill(0+randomness*255);
    ellipse (i*50,height/2+rand1,20+rand1,20+rand2);
  }
}
