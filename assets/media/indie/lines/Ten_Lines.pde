int speed = 4;//speed
int[] h = new int[10];
int width = 75; //width changes length of lines (lines = width/2)
int height = speed*150; //height (depends on speed for ease on eyes)
int x = 0; //start locatoin for red player line
int switcher = 1;
int start = 0;
int score=0;

void setup() {
  surface.setSize(width, height);
  background(255);
  for (int i=0; i<10; i++) {
    h[i]= -height/9*i+int(random(-20, 20));
  }
}
void draw() {
  noStroke();
  fill(0, 0, 0);
  rect(0, 0, width, height);
  strokeWeight(5);
  stroke(255, 0, 0);
  line(x, height-2, x+width/2, height-2);
  stroke(#ffffff);

  for (int k=0; k<10; k++) {
    if (switcher>0) {
      start = width/2;
    } else {
      start =0;
    }
    line(start, h[k], start+width/2, h[k]);
    //fill(255,0,0);
    //text(k, start, h[k]);
    //fill(#ffffff);
    h[k] = h[k]+speed;//int(float(speed)*random(0,1));

    switcher=switcher*-1;
    if (h[k]>height && x==start) {
      println(score);
      fill(#ffffff);
      text("Score: "+score, width/2-23, height/2);
      noLoop();
    }
    if (mousePressed) {
      noLoop();
    }
    if (h[k]>height) {
      h[k] = reset(k);
      // cleanup(k);
    }
  }
}

void keyPressed() {
  if (key == CODED) {
    if (keyCode == LEFT && x>0) {
      x=x-width/2;
    } else if (keyCode == RIGHT && x<width/2) {
      x=x+width/2;
    }
  }
}

int reset(int k) {
  int temp = -70+int(random(-30, 30));
  score++;
  return temp;
}

void cleanup(int k) {
  for (int m=0; m<10; m++) {
    if ((h[m]>0 && h[m]<50) && h[k]<=0) {
      for (int j=k; j<10; j++) {
        if (h[j]<0) {
          h[j]=h[j]-50;
        }
      }
    }
  }
}
