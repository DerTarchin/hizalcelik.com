int sensorPin = 0; // select the input pin for the potentiometer
int ledPin = 13; // select the pin for the LED
int sensorValue = 0; // variable to store the value coming from the sensor

void setup()
{
  //initialize serial communications at a 9600 baud rate
  Serial.begin(9600);
}

void loop()
{
  sensorValue = analogRead(sensorPin);// read the value from the sensor:
  Serial.println(sensorValue);
  delay(25);
}
