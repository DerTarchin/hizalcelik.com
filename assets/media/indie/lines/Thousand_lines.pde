float[] noise= new float[333];
int[] x1= new int[333];
int[] y1= new int[333];
int[] x2= new int[333];
int[] y2= new int[333];
float xoff = 0.0;
float xoff2 = 1;

void setup(){
  size(1280,720);
  for(int i=0;i<333;i++){
      x1[i] = int(random(5,2275));
      y1[i] = int(random(5,1715));
      x2[i] = x1[i] + int(random(-100,100));
      y2[i] = y1[i] + int(random(-100,100));
  }  
}

void draw(){
  background(#ffffff);
  xoff = xoff + .02;
  xoff2 = xoff2+.02;
  for(int i=0; i<333; i++){
    float n = noise(xoff);
    float g = noise(cos(xoff2)+2);
    // int x1n = 
    int s1 = int(random(8,12)*random(0,1));
    int s2 = int(random(8,12)*random(0,1));
    line(x1[i]*g,y1[i]*n,x2[i]*n,y2[i]*g);
    fill(#ffffff); stroke(0); strokeWeight(2);
    ellipse(x1[i]*g,y1[i]*n,s1,s1);
    ellipse(x2[i]*n,y2[i]*g,s2,s2);
  }
  if(mousePressed){noLoop();}
}

