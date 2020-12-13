import oscP5.*;
OscP5 oscP5;

// num faces found
int found;

// pose
float poseScale;
PVector posePosition = new PVector();
PVector poseOrientation = new PVector();

// gesture
float mouthHeight;
float mouthWidth;
float eyeLeft;
float eyeRight;
float eyebrowLeft;
float eyebrowRight;
float jaw;
float nostrils;
float lineradiusL = 10;
float lineradiusR = 10;

void setup() {
  size(640, 480);
  //frameRate(30);
  oscP5 = new OscP5(this, 8338);
  oscP5.plug(this, "found", "/found");
  oscP5.plug(this, "poseScale", "/pose/scale");
  oscP5.plug(this, "posePosition", "/pose/position");
  oscP5.plug(this, "poseOrientation", "/pose/orientation");
  oscP5.plug(this, "mouthWidthReceived", "/gesture/mouth/width");
  oscP5.plug(this, "mouthHeightReceived", "/gesture/mouth/height");
  oscP5.plug(this, "eyeLeftReceived", "/gesture/eye/left");
  oscP5.plug(this, "eyeRightReceived", "/gesture/eye/right");
  oscP5.plug(this, "eyebrowLeftReceived", "/gesture/eyebrow/left");
  oscP5.plug(this, "eyebrowRightReceived", "/gesture/eyebrow/right");
  oscP5.plug(this, "jawReceived", "/gesture/jaw");
  oscP5.plug(this, "nostrilsReceived", "/gesture/nostrils");
}

void draw() {  
  background(#ffee34);
  stroke(0);
  lineradiusL = eyebrowLeft*4;
  lineradiusR = eyebrowRight*4;
  if (found > 0) {
    translate(posePosition.x, posePosition.y+50);
    scale(poseScale);
    //EYEBROWS
    strokeWeight(1.6);
    line(-25, eyeLeft*-8, -25+cos(radians(270))*lineradiusL, eyeLeft*-8+sin(radians(270))*lineradiusL);
    line(-25, eyeLeft*-8, -25+cos(radians(240))*lineradiusL, eyeLeft*-8+sin(radians(240))*lineradiusL);
    line(-25, eyeLeft*-8, -25+cos(radians(300))*lineradiusL, eyeLeft*-8+sin(radians(300))*lineradiusL);
    line(25, eyeRight*-8, 25+cos(radians(270))*lineradiusR, eyeRight*-8+sin(radians(270))*lineradiusR);
    line(25, eyeRight*-8, 25+cos(radians(240))*lineradiusR, eyeRight*-8+sin(radians(240))*lineradiusR);
    line(25, eyeRight*-8, 25+cos(radians(300))*lineradiusR, eyeRight*-8+sin(radians(300))*lineradiusR);
    //EYES
    strokeWeight(.8);
    fill(255);
    ellipse(-25, eyeLeft*-8, 50, 50);
    ellipse(25, eyeRight*-8, 50, 50);
    fill(#34bcf3);
    ellipse(-23, eyeLeft*-8, 20, 20);
    ellipse(23, eyeRight*-8, 20, 20);
    fill(0);
    ellipse(-23, eyeLeft*-8, 11, 11);
    ellipse(23, eyeRight*-8, 11, 11);
    //FRECKLES
    fill(#b96119);
    noStroke();
    ellipse(-35, eyeLeft*-8+30, 3, 2);
    ellipse(-45, eyeLeft*-8+30, 4, 2);
    ellipse(-40, eyeLeft*-8+35, 1, 3);
    ellipse(35, eyeRight*-8+30, 3, 2);
    ellipse(45, eyeRight*-8+30, 4, 2);
    ellipse(40, eyeRight*-8+35, 1, 3);
    //NOSE
    fill(#ffee34);
    stroke(0);
    strokeWeight(0.8);
    beginShape();
    vertex(nostrils*-1+1, nostrils+2);
    bezierVertex(nostrils*-1-17, nostrils*-5, nostrils*-1+30, nostrils*-5, nostrils*-1+11, nostrils+2);
    endShape();
    //MOUTH
    fill(255);
    rect(-13,40-mouthWidth*.75,10,13);
    rect(0,40-mouthWidth*.75,10,13);
    if(mouthWidth*-3+70>0){noFill();}
    else{
    fill(#ffee34);}
    bezier(-40,mouthWidth*-3+70, -30, 30, 30, 30, 40, mouthWidth*-3+70);
    //CHIN THING
    strokeWeight(2);
    stroke(#f59c9f);
    curve(-30, 13-mouthWidth*.75, -20, 56-mouthWidth*.75, 0, 58-mouthWidth*.75, 0, 63-mouthWidth*.75);
    curve(0, 63-mouthWidth*.75, 0, 58-mouthWidth*.75, 20, 56-mouthWidth*.75, 30, 13-mouthWidth*.75);
  }
}

// OSC CALLBACK FUNCTIONS

public void found(int i) {
  println("found: " + i);
  found = i;
}

public void poseScale(float s) {
  println("scale: " + s);
  poseScale = s;
}

public void posePosition(float x, float y) {
  println("pose position\tX: " + x + " Y: " + y );
  posePosition.set(x, y, 0);
}

public void poseOrientation(float x, float y, float z) {
  println("pose orientation\tX: " + x + " Y: " + y + " Z: " + z);
  poseOrientation.set(x, y, z);
}

public void mouthWidthReceived(float w) {
  println("mouth Width: " + w);
  mouthWidth = w;
}

public void mouthHeightReceived(float h) {
  println("mouth height: " + h);
  mouthHeight = h;
}

public void eyeLeftReceived(float f) {
  println("eye left: " + f);
  eyeLeft = f;
}

public void eyeRightReceived(float f) {
  println("eye right: " + f);
  eyeRight = f;
}

public void eyebrowLeftReceived(float f) {
  println("eyebrow left: " + f);
  eyebrowLeft = f;
}

public void eyebrowRightReceived(float f) {
  println("eyebrow right: " + f);
  eyebrowRight = f;
}

public void jawReceived(float f) {
  println("jaw: " + f);
  jaw = f;
}

public void nostrilsReceived(float f) {
  println("nostrils: " + f);
  nostrils = f;
}

// all other OSC messages end up here
void oscEvent(OscMessage m) {

  /* print the address pattern and the typetag of the received OscMessage */
  println("#received an osc message");
  println("Complete message: "+m);
  println(" addrpattern: "+m.addrPattern());
  println(" typetag: "+m.typetag());
  println(" arguments: "+m.arguments()[0].toString());

  if (m.isPlugged() == false) {
    println("UNPLUGGED: " + m);
  }
}

