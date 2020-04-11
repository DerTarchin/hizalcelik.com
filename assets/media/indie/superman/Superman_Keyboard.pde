int[][] clouds = new int[10][4];
Animation man;

float manY;
int size;
int speed;
boolean gameOver;
int level;
int millis;
int score;
PImage cld1;
PImage cld2;
int manX;



void setup() {
  size(240, 160);
  initialize();
  man = new Animation("man", 23);
}

void draw()
{

  textAlign(CENTER);
  background(#4AE8E8);
  textSize(14);
  text("Level "+level, width/7, height/8);
  textSize(11);
  text("Score: "+score, width/6, height/8+14);
  
  if (millis>30000) {
    level++; 
    // speed++; 
    // size++;
  }
  millis = millis()%30000;
    manY = map(mouseY,0,height, 5, height-15);
    manY = constrain(manY, 5, height-15);
  
  noStroke();
  fill(255, 0, 0);

  man.display(width/7, manY);
  // ellipse(width/6, manY, 15, 15);

  for (int i=0; i<10; i++) {
    fill(255);
    if (clouds[i][2]==10 && !gameOver) {
      image(cld1, width-clouds[i][0], clouds[i][1]);
    } else { 
      if (!gameOver) {
        image(cld2, width-clouds[i][0], clouds[i][1]);
      }
    }
    //ellipse(width-clouds[i][0], clouds[i][1], size, size);
    if (manX >= width-clouds[i][0] && 
      manX <= width-clouds[i][0]+clouds[i][3]) {
      if (!gameOver) {
        score++;
      }
      if (manY <= clouds[i][1]+clouds[i][2] && 
        manY+size >=clouds[i][1]) {
        gameOver=true;
        if (!gameOver) {
          score--;
        }
      }
    }
    if (!gameOver) {
      clouds[i][0]+=speed;
      if (clouds[i][0]>(width+20)) {
        clouds[i][0] = clouds[i][0]%int(random(1, 30));
        clouds[i][1]= int(random(0, height));
      }
    }
    if (gameOver) {
      textSize(28);
      text("Game Over", width/2, height/2);
      textSize(14);
      text("Press 'R' to play again", width/2, height/2+28);
    }
  }
  if (keyPressed) {
    if (key == 'r') {
      initialize();
    }
  }
}

void initialize() {
  for (int i=0; i<10; i++) {
    clouds[i][0] = int(random(-width*1.5, -10));
    clouds[i][1] = int(random(0, height));
    if (i%2==0) {
      clouds[i][2] = 10;
      clouds[i][3] = 20;
    } else {
      clouds[i][2] = 15;
      clouds[i][3] = 30;
    }
  }
  size = 9;
  manX = width/7+16;
  speed = 3;
  gameOver = false;
  level = 1;
  score = 0;
  cld1 = loadImage("cloud_small.png");
  cld2 = loadImage("cloud_big.png");
  manY = mouseY;
}

// Class for animating a sequence of GIFs

class Animation {
  PImage[] images;
  int imageCount;
  int frame;

  Animation(String imagePrefix, int count) {
    imageCount = count;
    images = new PImage[imageCount];

    for (int i = 0; i < imageCount; i++) {
      // Use nf() to number format 'i' into four digits
      String filename = imagePrefix + nf(i, 4) + ".gif";
      images[i] = loadImage(filename);
    }
  }

  void display(float xpos, float ypos) {
    frame = (frame+1) % imageCount;
    image(images[frame], xpos, ypos);
  }

  int getWidth() {
    return images[0].width;
  }
}


