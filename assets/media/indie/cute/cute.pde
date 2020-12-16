int skinColorR = 100;
int skinColorG = 200;
int skinColorB = 300;

void setup() {
  size(600, 600);
}

void draw() {
  background(#ffffff);
  smooth();

  float randxymin = 85;
  float randxymax = 130;

  float randXL = map(mouseX, 0, width, randxymin, randxymax);
  randXL = constrain(randXL, randxymin, randxymax); 
  float randXR = map(width-mouseX, 0, width, randxymin, randxymax);
  randXR = constrain(randXR, randxymin, randxymax); 
  float randYT = map(mouseY, 0, height, randxymin, randxymax);
  randYT = constrain(randYT, randxymin, randxymax);
  float randYB = map(height-mouseY, 0, height, randxymin, randxymax);
  randYB = constrain(randYT, randxymin, randxymax);

  float randXS = map(mouseX, 0, width, 10, 40);
  randXS = constrain(randXS, 10, 40); 
  float randYS = map(mouseY, 0, height, 10, 40);
  randYS = constrain(randYS, 10, 40); 

  //define features
  float eyeSize = (randXS+randYS)/2; 
  float faceWidth = randXL; 
  float faceHeight = randYT;


  //draw features
  strokeWeight(1);
  fill(skinColorR, skinColorG, skinColorB);
  ellipse (width/2, height/2, faceWidth, faceHeight); 
  filter(BLUR, 3);
  float eyeLX = width/2 - faceWidth*0.15;
  float eyeRX = width/2 + faceWidth*0.15;
  fill(#ffffff);
  if ((mouseX>=((width/2)-(faceWidth/2))) && (mouseX<=((width/2)+(faceWidth/2))) 
  && (mouseY>=((height/2)-(faceHeight/2))) && (mouseY<=((height/2)+(faceHeight/2)))) {
    noFill(); 
  strokeWeight(2);
  arc(eyeLX, height/2-faceHeight*0.1, 20, 10, PI, TWO_PI);
  arc(eyeRX, height/2-faceHeight*0.1, 20, 10, PI, TWO_PI);
  } else {
    ellipse (eyeLX, height/2-faceHeight*0.1, 20, eyeSize); 
    ellipse (eyeRX, height/2-faceHeight*0.1, 20, eyeSize);
    fill(0, 0, 0);
    ellipse (eyeLX, height/2-faceHeight*0.1, 8, 8); 
    ellipse (eyeRX, height/2-faceHeight*0.1, 8, 8); 
  }
  strokeWeight(1);
    fill(0, 0, 0);
  if ((mouseX>=((width/2)-(faceWidth/2))) && (mouseX<=((width/2)+(faceWidth/2)))) {
    if ((mouseY>=((height/2)-(faceHeight/2))) && (mouseY<=((height/2)+(faceHeight/2)))) {
      float mouthHeight = random(10, 30);
      arc(width/2, height/2+faceHeight*0.1, 30, mouthHeight, 0, PI, PIE);
    }
  }
    float MXS = map(mouseX, 0, width, -100, 100);
  MXS = constrain(MXS, -100, 100); 
 float MYS = map(mouseY, 0, height, -100, 100);
  MYS = constrain(MYS, -100, 100); 

    float space1 = random(-3,3);
    float space2 = random(-3,3);
  
    float armLength = 40;
    float LarmStartX = width/2-faceWidth*0.38;
    float LarmStartY = height/2+faceHeight*0.05;
   float LarmMidInsideX = (width/2)-70+MXS*.5+space2/3;
   float LarmMidInsideY = (height/2)+50+MYS+space1/3;
   float LarmMidOutsideX = LarmMidInsideX+(MXS);
   LarmMidOutsideX = constrain(LarmMidOutsideX,LarmStartX-armLength*.8,LarmStartX+armLength*.8);
   float LarmMidOutsideY = LarmMidInsideY+(MYS);
      LarmMidOutsideY = constrain(LarmMidOutsideY,LarmStartY-armLength*.8,LarmStartY+armLength*.8);
   float LarmEndX = mouseX-10;
   LarmEndX = constrain(LarmEndX,LarmStartX-armLength,LarmStartX+armLength)+space1;
   float LarmEndY = mouseY-10;
   LarmEndY = constrain(LarmEndY,LarmStartY-armLength,LarmStartY+armLength)+space2;
  
  
   float RarmStartX = width/2+faceWidth*0.38;
    float RarmStartY = height/2+faceHeight*0.05;
   float RarmMidInsideX = (width/2)+70+MXS*.5+space2/3;
   float RarmMidInsideY = (height/2)+50+MYS+space1/3;
   float RarmMidOutsideX = RarmMidInsideX+(MXS*.5);
   RarmMidOutsideX = constrain(RarmMidOutsideX,RarmStartX-armLength*.8,RarmStartX+armLength*.8);
   float RarmMidOutsideY = RarmMidInsideY+(MYS*.5);
   RarmMidOutsideY = constrain(RarmMidOutsideY,RarmStartY-armLength*.8,RarmStartY+armLength*.8);   
   float RarmEndX = mouseX+10;
   RarmEndX = constrain(RarmEndX,RarmStartX-armLength,RarmStartX+armLength)+space2;
   float RarmEndY = mouseY-10;
   RarmEndY = constrain(RarmEndY,RarmStartY-armLength,RarmStartY+armLength)+space1;
  
  noFill();
  stroke(0);
  strokeWeight(3);
  bezier(LarmStartX, LarmStartY, 
  LarmMidInsideX, LarmMidInsideY,//height/2+faceHeight*0.8, 
  LarmMidOutsideX, LarmMidOutsideY, LarmEndX, LarmEndY);
  bezier(RarmStartX, RarmStartY, 
  RarmMidInsideX, RarmMidInsideY,//height/2+faceHeight*0.8, 
  RarmMidOutsideX, RarmMidOutsideY, RarmEndX, RarmEndY);
}

void mousePressed() {
  skinColorR = int(random (0, 255));
  skinColorG = int(random (0, 255));
  skinColorB = int(random (0, 255));
}

