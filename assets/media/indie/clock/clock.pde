int radius = 120;
int lineradius=radius/2-3;
int[] cX= new int[24];
int[] cY= new int[24];
float[] time1c1r1= new float[10];
float[] time2c1r1= new float[10];
float[] time1c1r2= new float[10];
float[] time2c1r2= new float[10];
float[] time1c1r3= new float[10];
float[] time2c1r3= new float[10];
float[] time1c2r1= new float[10];
float[] time2c2r1= new float[10];
float[] time1c2r2= new float[10];
float[] time2c2r2= new float[10];
float[] time1c2r3= new float[10];
float[] time2c2r3= new float[10];

int prevSec; 
int prevMin;
int millisRolloverTime;

void setup() {
  size(1280, 720);
  for (int c=0; c<8; c++) {
    for (int r=0; r<3; r++) {
      int index = c+(8*r);
      cX[index]=(width/2)-(radius*4-radius/2)+(radius*c);
      cY[index]=(height/2)-radius+(radius*r);
    }
  }

  setTime();
  millisRolloverTime=0;
}

void draw() {
  background(#ffffff);
  fill(0);
  rect(width/2-radius/2, height/2-120, radius, radius*2);
  fill(#ffffff);
  noStroke();
  ellipse(width/2, height/2-radius/2, radius/2.68, radius/2.68);
  ellipse(width/2, height/2+radius/2, radius/2.68, radius/2.68);

  for (int i=0; i<24; i++) {
    stroke(0);
    strokeWeight(4); 
    fill(#ffffff);
    ellipse(cX[i], cY[i], radius, radius);
    strokeWeight(8);

    showTimeMove(i);
    //showTimeTogether(i);

    if (minute()+1==60) {
      println("Next min: 00");
    } else {
      println("Next min: "+(minute()+1));
    }
    if (hour()+1==24) {
      println("Next hr: 00");
    } else {
      println("Next hr: "+(hour()+1));
    }
  }
}

float backwards(float num) {
  float newnum = num;
  if (num==0) { 
    newnum= 0;
  }
  if (num==90) { 
    newnum= 270;
  }
  if (num==135) { 
    newnum= 225;
  }
  if (num==180) { 
    newnum= 180;
  }
  if (num==270) { 
    newnum= 90;
  }
  return newnum;
}

void showTimeMove(int i) {

  if (prevSec != second()) {
    millisRolloverTime = millis();
  } 
  prevSec = second();
  int mils = millis() - millisRolloverTime;
  float test = map(second() + mils/1000.0, 0, 60, 0, 360+(0));
  line(width/2, height/2-radius/2, width/2+cos(radians(test))*20, (height/2-radius/2)+(sin(radians(test))*20));
  line(width/2, height/2+radius/2, width/2+cos(radians(test))*20, (height/2+radius/2)+(sin(radians(test))*20));

  float animate = 0;
  int animationTime = 16;
  if (second()>=(60-animationTime)) {
    animate = (second()- (60-animationTime) + mils/1000.0);
  } else {  
    animate = 0;
  }



  int start = 135;
  int end = 225;
  test = -1*map(animate, 0, animationTime, -1*start, 360+end);
  //line(radius, radius, radius+cos(radians(test))*lineradius, radius+sin(radians(test))*lineradius);

  int digitH1=hour()/10;
  int digitH2=hour()%10;
  int digitM1=minute()/10;
  int digitM2=minute()%10;
  float coords; 
  float digitM1move;

  int hour = hour();
  int minute = minute();


  // FIRST DIGIT
  if (i==0) {
    if ((hour==9 || hour==19) && minute==59) {
      coords = map(animate, 0, animationTime, time1c1r1[digitH1], 1440+(time1c1r1[digitH1+1]));
    } else if (hour==23 && minute==59) {
      coords = map(animate, 0, animationTime, time1c1r1[digitH1], 1440+(time1c1r1[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c1r1[digitH1], 1440+(time1c1r1[digitH1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour==9 || hour==19) && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r1[digitH1], 720+(backwards(time2c1r1[digitH1+1])));
    } else if (hour==23 && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r1[digitH1], 720+(backwards(time2c1r1[0])));
    } else {      
      coords = -1*map(animate, 0, animationTime, -1*time2c1r1[digitH1], 720+(backwards(time2c1r1[digitH1])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==1) {
    if ((hour==9 || hour==19) && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time1c2r1[digitH1], 720+(backwards(time1c2r1[digitH1+1])));
    } else if (hour==23 && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time1c2r1[digitH1], 720+(backwards(time1c2r1[0])));
    } else {      
      coords = -1*map(animate, 0, animationTime, -1*time1c2r1[digitH1], 720+(backwards(time1c2r1[digitH1])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour==9 || hour==19) && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c2r1[digitH1], 360+(backwards(time2c2r1[digitH1+1])));
    } else if (hour==23 && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c2r1[digitH1], 360+(backwards(time2c2r1[0])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time2c2r1[digitH1], 360+(backwards(time2c2r1[digitH1])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==8) {
    if ((hour==9 || hour==19) && minute==59) {
      coords = map(animate, 0, animationTime, time1c1r2[digitH1], 360+(time1c1r2[digitH1+1]));
    } else if (hour==23 && minute==59) {
      coords = map(animate, 0, animationTime, time1c1r2[digitH1], 360+(time1c1r2[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c1r2[digitH1], 360+(time1c1r2[digitH1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour==9 || hour==19) && minute==59) {
      coords = map(animate, 0, animationTime, time2c1r2[digitH1], 720+(time2c1r2[digitH1+1]));
    } else if (hour==23 && minute==59) {
      coords = map(animate, 0, animationTime, time2c1r2[digitH1], 720+(time2c1r2[0]));
    } else {
      coords = map(animate, 0, animationTime, time2c1r2[digitH1], 720+(time2c1r2[digitH1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==9) {
    if ((hour==9 || hour==19) && minute==59) {
      coords = map(animate, 0, animationTime, time1c2r2[digitH1], 720+(time1c2r2[digitH1+1]));
    } else if (hour==23 && minute==59) {
      coords = map(animate, 0, animationTime, time1c2r2[digitH1], 720+(time1c2r2[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c2r2[digitH1], 720+(time1c2r2[digitH1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour==9 || hour==19) && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c2r2[digitH1], 1080+(backwards(time2c2r2[digitH1+1])));
    } else if (hour==23 && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c2r2[digitH1], 1080+(backwards(time2c2r2[0])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time2c2r2[digitH1], 1080+(backwards(time2c2r2[digitH1])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==16) {
    if ((hour==9 || hour==19) && minute==59) {
      coords = map(animate, 0, animationTime, time1c1r3[digitH1], 720+(time1c1r3[digitH1+1]));
    } else if (hour==23 && minute==59) {
      coords = map(animate, 0, animationTime, time1c1r3[digitH1], 720+(time1c1r3[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c1r3[digitH1], 720+(time1c1r3[digitH1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour==9 || hour==19) && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r3[digitH1], 720+(backwards(time2c1r3[digitH1+1])));
    } else if (hour==23 && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r3[digitH1], 720+(backwards(time2c1r3[digitH1+1])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r3[digitH1], 720+(backwards(time2c1r3[digitH1])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==17) {
    if ((hour==9 || hour==19) && minute==59) {
      coords = map(animate, 0, animationTime, time1c2r3[digitH1], 720+(time1c2r3[digitH1+1]));
    } else if (hour==23 && minute==59) {
      coords = map(animate, 0, animationTime, time1c2r3[digitH1], 720+(time1c2r3[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c2r3[digitH1], 720+(time1c2r3[digitH1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour==9 || hour==19) && minute==59) {
      coords = map(animate, 0, animationTime, time2c2r3[digitH1], 1080+(time2c2r3[digitH1+1]));
    } else if (hour==23 && minute==59) {
      coords = map(animate, 0, animationTime, time2c2r3[digitH1], 1080+(time2c2r3[0]));
    } else {
      coords = map(animate, 0, animationTime, time2c2r3[digitH1], 1080+(time2c2r3[digitH1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }

  // SECOND DIGIT
  if (i==2) {
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = map(animate, 0, animationTime, time1c1r1[digitH2], 720+(time1c1r1[digitH2+1]));
    } else if ((hour==23 || hour==19 || hour==9) && minute==59) {
      coords = map(animate, 0, animationTime, time1c1r1[digitH2], 720+(time1c1r1[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c1r1[digitH2], 720+(time1c1r1[digitH2]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r1[digitH2], 720+(backwards(time2c1r1[digitH2+1])));
    } else if ((hour==23 || hour==19 || hour==9) && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r1[digitH2], 720+(backwards(time2c1r1[0])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r1[digitH2], 720+(backwards(time2c1r1[digitH2])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==3) {
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = map(animate, 0, animationTime, time1c2r1[digitH2], 720+(time1c2r1[digitH2+1]));
    } else if ((hour==23 || hour==19 || hour==9) && minute==59) {
      coords = map(animate, 0, animationTime, time1c2r1[digitH2], 720+(time1c2r1[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c2r1[digitH2], 720+(time1c2r1[digitH2]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = map(animate, 0, animationTime, time2c2r1[digitH2], 1440+(time2c2r1[digitH2+1]));
    } else if ((hour==23 || hour==19 || hour==9) && minute==59) {
      coords = map(animate, 0, animationTime, time2c2r1[digitH2], 1440+(time2c2r1[0]));
    } else {
      coords = map(animate, 0, animationTime, time2c2r1[digitH2], 1440+(time2c2r1[digitH2]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==10) {
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = map(animate, 0, animationTime, time1c1r2[digitH2], 720+(time1c1r2[digitH2+1]));
    } else if ((hour==23 || hour==19 || hour==9) && minute==59) {
      coords = map(animate, 0, animationTime, time1c1r2[digitH2], 720+(time1c1r2[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c1r2[digitH2], 720+(time1c1r2[digitH2]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = map(animate, 0, animationTime, time2c1r2[digitH2], 360+(time2c1r2[digitH2+1]));
    } else if ((hour==23 || hour==19 || hour==9) && minute==59) {
      coords = map(animate, 0, animationTime, time2c1r2[digitH2], 360+(time2c1r2[0]));
    } else {
      coords = map(animate, 0, animationTime, time2c1r2[digitH2], 360+(time2c1r2[digitH2]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==11) {
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = map(animate, 0, animationTime, time1c2r2[digitH2], 360+(time1c2r2[digitH2+1]));
    } else if ((hour==23 || hour==19 || hour==9) && minute==59) {
      coords = map(animate, 0, animationTime, time1c2r2[digitH2], 360+(time1c2r2[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c2r2[digitH2], 360+(time1c2r2[digitH2]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c2r2[digitH2], 720+(backwards(time2c2r2[digitH2+1])));
    } else if (digitH2==9 && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c2r2[digitH2], 720+(backwards(time2c2r2[0])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time2c2r2[digitH2], 720+(backwards(time2c2r2[digitH2])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==18) {
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time1c1r3[digitH2], 720+(backwards(time1c1r3[digitH2+1])));
    } else if (digitH2==9 && minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time1c1r3[digitH2], 720+(backwards(time1c1r3[0])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time1c1r3[digitH2], 720+(backwards(time1c1r3[digitH2])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = map(animate, 0, animationTime, time2c1r3[digitH2], 1080+(time2c1r3[digitH2+1]));
    } else if (digitH2==9 && minute==59) {
      coords = map(animate, 0, animationTime, time2c1r3[digitH2], 1080+(time2c1r3[0]));
    } else {
      coords = map(animate, 0, animationTime, time2c1r3[digitH2], 1080+(time2c1r3[digitH2]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==19) {
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = map(animate, 0, animationTime, time1c2r3[digitH2], 1080+(time1c2r3[digitH2+1]));
    } else if ((hour==23 || hour==19 || hour==9) && minute==59) {
      coords = map(animate, 0, animationTime, time1c2r3[digitH2], 1080+(time1c2r3[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c2r3[digitH2], 1080+(time1c2r3[digitH2]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if ((hour!=9 && hour!=19 && hour!=23) && minute==59) {
      coords = map(animate, 0, animationTime, time2c2r3[digitH2], 720+(time2c2r3[digitH2+1]));
    } else if ((hour==23 || hour==19 || hour==9) && minute==59) {
      coords = map(animate, 0, animationTime, time2c2r3[digitH2], 720+(time2c2r3[0]));
    } else {
      coords = map(animate, 0, animationTime, time2c2r3[digitH2], 720+(time2c2r3[digitH2]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }

  // THIRD DIGIT
  if (i==4) {
    if (digitM1!=5 && digitM2==9) {
      coords = map(animate, 0, animationTime, time1c1r1[digitM1], 720+(time1c1r1[digitM1+1]));
    } else if (minute==59) {
      coords = map(animate, 0, animationTime, time1c1r1[digitM1], 720+(time1c1r1[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c1r1[digitM1], 720+(time1c1r1[digitM1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM1!=5 && digitM2==9) {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r1[digitM1], 1080+(backwards(time2c1r1[digitM1+1])));
    } else if (minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r1[digitM1], 1080+(backwards(time2c1r1[0])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r1[digitM1], 1080+(backwards(time2c1r1[digitM1])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==5) {
    if (digitM1!=5 && digitM2==9) {
      coords = map(animate, 0, animationTime, time1c2r1[digitM1], 720+(time1c2r1[digitM1+1]));
    } else if (minute==59) {
      coords = map(animate, 0, animationTime, time1c2r1[digitM1], 720+(time1c2r1[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c2r1[digitM1], 720+(time1c2r1[digitM1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM1!=5 && digitM2==9) {
      coords = map(animate, 0, animationTime, time2c2r1[digitM1], 360+(time2c2r1[digitM1+1]));
    } else if (minute==59) {
      coords = map(animate, 0, animationTime, time2c2r1[digitM1], 360+(time2c2r1[0]));
    } else {
      coords = map(animate, 0, animationTime, time2c2r1[digitM1], 360+(time2c2r1[digitM1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==12) {
    if (digitM1!=5 && digitM2==9) {
      coords = -1*map(animate, 0, animationTime, -1*time1c1r2[digitM1], 1080+(backwards(time1c1r2[digitM1+1])));
    } else if (minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time1c1r2[digitM1], 1080+(backwards(time1c1r2[0])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time1c1r2[digitM1], 1080+(backwards(time1c1r2[digitM1])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM1!=5 && digitM2==9) {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r2[digitM1], 720+(backwards(time2c1r2[digitM1+1])));
    } else if (minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r2[digitM1], 720+(backwards(time2c1r2[0])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r2[digitM1], 720+(backwards(time2c1r2[digitM1])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==13) {
    if (digitM1!=5 && digitM2==9) {
      coords = -1*map(animate, 0, animationTime, -1*time1c2r2[digitM1], 720+(backwards(time1c2r2[digitM1+1])));
    } else if (minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time1c2r2[digitM1], 720+(backwards(time1c2r2[0])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time1c2r2[digitM1], 720+(backwards(time1c2r2[digitM1])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM1!=5 && digitM2==9) {
      coords = map(animate, 0, animationTime, time2c2r2[digitM1], 720+(time2c2r2[digitM1+1]));
    } else if (minute==59) {
      coords = map(animate, 0, animationTime, time2c2r2[digitM1], 720+(time2c2r2[0]));
    } else {
      coords = map(animate, 0, animationTime, time2c2r2[digitM1], 720+(time2c2r2[digitM1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==20) {
    if (digitM1!=5 && digitM2==9) {
      coords = -1*map(animate, 0, animationTime, -1*time1c1r3[digitM1], 720+(backwards(time1c1r3[digitM1+1])));
    } else if (minute==59) {
      coords = -1*map(animate, 0, animationTime, -1*time1c1r3[digitM1], 720+(backwards(time1c1r3[0])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time1c1r3[digitM1], 720+(backwards(time1c1r3[digitM1])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM1!=5 && digitM2==9) {
      coords = map(animate, 0, animationTime, time2c1r3[digitM1], 1080+(time2c1r3[digitM1+1]));
    } else if (minute==59) {
      coords = map(animate, 0, animationTime, time2c1r3[digitM1], 1080+(time2c1r3[0]));
    } else {
      coords = map(animate, 0, animationTime, time2c1r3[digitM1], 1080+(time2c1r3[digitM1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==21) {
    if (digitM1!=5 && digitM2==9) {
      coords = map(animate, 0, animationTime, time1c2r3[digitM1], 360+(time1c2r3[digitM1+1]));
    } else if (minute==59) {
      coords = map(animate, 0, animationTime, time1c2r3[digitM1], 360+(time1c2r3[0]));
    } else {
      coords = map(animate, 0, animationTime, time1c2r3[digitM1], 360+(time1c2r3[digitM1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM1!=5 && digitM2==9) {
      coords = map(animate, 0, animationTime, time2c2r3[digitM1], 720+(time2c2r3[digitM1+1]));
    } else if (minute==59) {
      coords = map(animate, 0, animationTime, time2c2r3[digitM1], 720+(time2c2r3[0]));
    } else {
      coords = map(animate, 0, animationTime, time2c2r3[digitM1], 720+(time2c2r3[digitM1]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }

  // FOURTH DIGIT
  if (i==6) {
    if (digitM2!=9) {
      coords = map(animate, 0, animationTime, time1c1r1[digitM2], 1440+(time1c1r1[digitM2+1]));
    } else {
      coords = map(animate, 0, animationTime, time1c1r1[digitM2], 1440+(time1c1r1[0]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM2!=9) {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r1[digitM2], 720+(backwards(time2c1r1[digitM2+1])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time2c1r1[digitM2], 720+(backwards(time2c1r1[0])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==7) {
    if (digitM2!=9) {
      coords = map(animate, 0, animationTime, time1c2r1[digitM2], 720+(time1c2r1[digitM2+1]));
    } else {
      coords = map(animate, 0, animationTime, time1c2r1[digitM2], 720+(time1c2r1[0]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM2!=9) {
      coords = map(animate, 0, animationTime, time2c2r1[digitM2], 360+(time2c2r1[digitM2+1]));
    } else {
      coords = map(animate, 0, animationTime, time2c2r1[digitM2], 360+(time2c2r1[0]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==14) {
    if (digitM2!=9) {
      coords = map(animate, 0, animationTime, time1c1r2[digitM2], 360+(time1c1r2[digitM2+1]));
    } else {
      coords = map(animate, 0, animationTime, time1c1r2[digitM2], 360+(time1c1r2[0]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM2!=9) {
      coords = map(animate, 0, animationTime, time2c1r2[digitM2], 720+(time2c1r2[digitM2+1]));
    } else {
      coords = map(animate, 0, animationTime, time2c1r2[digitM2], 720+(time2c1r2[0]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==15) {
    if (digitM2!=9) {
      coords = -1*map(animate, 0, animationTime, -1*time1c2r2[digitM2], 720+(backwards(time1c2r2[digitM2+1])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time1c2r2[digitM2], 720+(backwards(time1c2r2[0])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM2!=9) {
      coords = -1*map(animate, 0, animationTime, -1*time2c2r2[digitM2], 360+(backwards(time2c2r2[digitM2+1])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time2c2r2[digitM2], 360+(backwards(time2c2r2[0])));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==22) {
    if (digitM2!=9) {
      coords = -1*map(animate, 0, animationTime, -1*time1c1r3[digitM2], 360+(backwards(time1c1r3[digitM2+1])));
    } else {
      coords = -1*map(animate, 0, animationTime, -1*time1c1r3[digitM2], 360+(time1c1r3[0]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM2!=9) {
      coords = map(animate, 0, animationTime, time2c1r3[digitM2], 720+(time2c1r3[digitM2+1]));
    } else {
      coords = map(animate, 0, animationTime, time2c1r3[digitM2], 720+(time2c1r3[0]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
  if (i==23) {
    if (digitM2!=9) {
      coords = map(animate, 0, animationTime, time1c2r3[digitM2], 1080+(time1c2r3[digitM2+1]));
    } else {
      coords = map(animate, 0, animationTime, time1c2r3[digitM2], 1080+(time1c2r3[0]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
    if (digitM2!=9) {
      coords = map(animate, 0, animationTime, time2c2r3[digitM2], 360+(time2c2r3[digitM2+1]));
    } else {
      coords = map(animate, 0, animationTime, time2c2r3[digitM2], 360+(time2c2r3[0]));
    }
    line(cX[i], cY[i], cX[i]+cos(radians(coords))*lineradius, cY[i]+sin(radians(coords))*lineradius);
  }
}

void setTime() {
  int d;
  d=0;//SET TIME = 0
  time1c1r1[d] = 0;
  time2c1r1[d] = 90;
  time1c1r2[d] = 270;
  time2c1r2[d] = 90;
  time1c1r3[d] = 270;
  time2c1r3[d] = 0;
  time1c2r1[d] = 180;
  time2c2r1[d] = 90;
  time1c2r2[d] = 270;
  time2c2r2[d] = 90;
  time1c2r3[d] = 270;
  time2c2r3[d] = 180;

  d=1;//SET TIME = 1
  time1c1r1[d] = 135;
  time2c1r1[d] = 135;
  time1c1r2[d] = 135;
  time2c1r2[d] = 135;
  time1c1r3[d] = 135;
  time2c1r3[d] = 135;
  time1c2r1[d] = 90;
  time2c2r1[d] = 90;
  time1c2r2[d] = 270;
  time2c2r2[d] = 90;
  time1c2r3[d] = 270;
  time2c2r3[d] = 270;

  d=2;//SET TIME = 2
  time1c1r1[d] = 0;
  time2c1r1[d] = 0;
  time1c1r2[d] = 0;
  time2c1r2[d] = 90;
  time1c1r3[d] = 270;
  time2c1r3[d] = 0;
  time1c2r1[d] = 180;
  time2c2r1[d] = 90;
  time1c2r2[d] = 270;
  time2c2r2[d] = 180;
  time1c2r3[d] = 180;
  time2c2r3[d] = 180;

  d=3;//SET TIME = 3
  time1c1r1[d] = 0;
  time2c1r1[d] = 0;
  time1c1r2[d] = 0;
  time2c1r2[d] = 0;
  time1c1r3[d] = 0;
  time2c1r3[d] = 0;
  time1c2r1[d] = 180;
  time2c2r1[d] = 90;
  time1c2r2[d] = 270;
  time2c2r2[d] = 180;
  time1c2r3[d] = 270;
  time2c2r3[d] = 180;

  d=4;//SET TIME = 4
  time1c1r1[d] = 90;
  time2c1r1[d] = 90;
  time1c1r2[d] = 270;
  time2c1r2[d] = 0;
  time1c1r3[d] = 135;
  time2c1r3[d] = 135;
  time1c2r1[d] = 90;
  time2c2r1[d] = 90;
  time1c2r2[d] = 270;
  time2c2r2[d] = 90;
  time1c2r3[d] = 270;
  time2c2r3[d] = 270;

  d=5;//SET TIME = 5
  time1c1r1[d] = 0;
  time2c1r1[d] = 90;
  time1c1r2[d] = 270;
  time2c1r2[d] = 0;
  time1c1r3[d] = 0;
  time2c1r3[d] = 0;
  time1c2r1[d] = 180;
  time2c2r1[d] = 180;
  time1c2r2[d] = 180;
  time2c2r2[d] = 90;
  time1c2r3[d] = 270;
  time2c2r3[d] = 180;

  d=6;//SET TIME = 6
  time1c1r1[d] = 0;
  time2c1r1[d] = 90;
  time1c1r2[d] = 270;
  time2c1r2[d] = 90;
  time1c1r3[d] = 270;
  time2c1r3[d] = 0;
  time1c2r1[d] = 180;
  time2c2r1[d] = 180;
  time1c2r2[d] = 180;
  time2c2r2[d] = 90;
  time1c2r3[d] = 270;
  time2c2r3[d] = 180;

  d=7;//SET TIME = 7
  time1c1r1[d] = 0;
  time2c1r1[d] = 0;
  time1c1r2[d] = 135;
  time2c1r2[d] = 135;
  time1c1r3[d] = 135;
  time2c1r3[d] = 135;
  time1c2r1[d] = 180;
  time2c2r1[d] = 90;
  time1c2r2[d] = 270;
  time2c2r2[d] = 90;
  time1c2r3[d] = 270;
  time2c2r3[d] = 270;

  d=8;//SET TIME = 8
  time1c1r1[d] = 0;
  time2c1r1[d] = 90;
  time1c1r2[d] = 270;
  time2c1r2[d] = 0;
  time1c1r3[d] = 270;
  time2c1r3[d] = 0;
  time1c2r1[d] = 180;
  time2c2r1[d] = 90;
  time1c2r2[d] = 270;
  time2c2r2[d] = 180;
  time1c2r3[d] = 270;
  time2c2r3[d] = 180;

  d=9;//SET TIME = 9
  time1c1r1[d] = 0;
  time2c1r1[d] = 90;
  time1c1r2[d] = 270;
  time2c1r2[d] = 0;
  time1c1r3[d] = 135;
  time2c1r3[d] = 135;
  time1c2r1[d] = 180;
  time2c2r1[d] = 90;
  time1c2r2[d] = 270;
  time2c2r2[d] = 90;
  time1c2r3[d] = 270;
  time2c2r3[d] = 270;
}

void showTimeTogether(int i) {
  int digit=second()%10;
  //SET TIME BY ROW AND COLUMN
  if (i%2!=0) {
    if (i<8) {
      line(cX[i], cY[i], cX[i]+cos(radians(time1c2r1[digit]))*lineradius, cY[i]+sin(radians(time1c2r1[digit]))*lineradius);
      line(cX[i], cY[i], cX[i]+cos(radians(time2c2r1[digit]))*lineradius, cY[i]+sin(radians(time2c2r1[digit]))*lineradius);
    } else if (i>=8 && i<16) {
      line(cX[i], cY[i], cX[i]+cos(radians(time1c2r2[digit]))*lineradius, cY[i]+sin(radians(time1c2r2[digit]))*lineradius);
      line(cX[i], cY[i], cX[i]+cos(radians(time2c2r2[digit]))*lineradius, cY[i]+sin(radians(time2c2r2[digit]))*lineradius);
    } else {
      line(cX[i], cY[i], cX[i]+cos(radians(time1c2r3[digit]))*lineradius, cY[i]+sin(radians(time1c2r3[digit]))*lineradius);
      line(cX[i], cY[i], cX[i]+cos(radians(time2c2r3[digit]))*lineradius, cY[i]+sin(radians(time2c2r3[digit]))*lineradius);
    }
  } else {
    if (i<8) {
      line(cX[i], cY[i], cX[i]+cos(radians(time1c1r1[digit]))*lineradius, cY[i]+sin(radians(time1c1r1[digit]))*lineradius);
      line(cX[i], cY[i], cX[i]+cos(radians(time2c1r1[digit]))*lineradius, cY[i]+sin(radians(time2c1r1[digit]))*lineradius);
    } else if (i>=8 && i<16) {
      line(cX[i], cY[i], cX[i]+cos(radians(time1c1r2[digit]))*lineradius, cY[i]+sin(radians(time1c1r2[digit]))*lineradius);
      line(cX[i], cY[i], cX[i]+cos(radians(time2c1r2[digit]))*lineradius, cY[i]+sin(radians(time2c1r2[digit]))*lineradius);
    } else {
      line(cX[i], cY[i], cX[i]+cos(radians(time1c1r3[digit]))*lineradius, cY[i]+sin(radians(time1c1r3[digit]))*lineradius);
      line(cX[i], cY[i], cX[i]+cos(radians(time2c1r3[digit]))*lineradius, cY[i]+sin(radians(time2c1r3[digit]))*lineradius);
    }
  }
}

