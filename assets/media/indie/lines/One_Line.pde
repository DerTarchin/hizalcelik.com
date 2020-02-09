// RULES: keep mouse under each end to bounce back up
//        keep mouse over each end to freeze the end
//        keep from hitting the bottom

int points =0;

float x = 80;   // x location of square
float x2 = 120;
float y = 0;     // y location of square
float y2 = 0;

float speed = 0;   // speed of square
float speed2 = 0.5;

float gravity = .05;

int hardness = 7;

void setup() {
  size(200, 900);
  background(255);
}

void draw() {
  fill(#ffffff, 90);
  rect(0, 0, width, height);
  // Display the square
  fill(175);
  stroke(0);
  line(x, y, x2, y2);

  // Add speed to location.
  y = y + speed;
  y2 =y2+speed2;

  // Add gravity to speed.
  speed = speed + gravity;
  speed2 = speed2 + gravity;

  // If square reaches the bottom
  // Reverse speed

  int floor1 = mouseY;
  int floor2 = mouseY;

  if (mouseX >80-hardness && mouseX < 80+hardness && y > floor1 && y < floor1+10) {
    floor1 = mouseY;
    points++;
    speed = speed * -.98;
  } else {
    floor1 = height;
  }
  if (mouseX>120-hardness && mouseX<120+hardness && y2 > floor2 && y2 < floor2+10) {
    points++;
    speed2 = speed2 * -.97;
    floor2 = mouseY;
  } else {
    floor2 = height;
  }

  println(points);
  //  if (y2 > floor2) {
  //    points++;
  //    speed2 = speed2 * -.97;
  //}

  if (y >= height || y2 >= height) {
    noLoop();
    textSize(30);
    text("Game Over", 20, height/2);
    textSize(15);
    int finalPoints = points;
    text("Points: "+finalPoints, 65, height/2+30);
    speed = 0;
    speed2 = 0;
  }
}


