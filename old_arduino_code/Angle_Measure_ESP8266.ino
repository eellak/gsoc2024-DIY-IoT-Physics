#include <Wire.h>
float RateRoll, RatePitch, RateYaw;

//Define the accelerometer Variables
float AccX, AccY, AccZ;
float AngleRoll, AnglePitch;

float LoopTimer;
void gyro_signals(void) {
  Wire.beginTransmission(0x68);
  Wire.write(0x1A); //Switch on the digital Low-Pass filter
  Wire.write(0x05);
  Wire.endTransmission();

  //Configure the accelerometer output
  Wire.beginTransmission(0x68);
  Wire.write(0x1C);
  Wire.write(0x10);
  Wire.endTransmission();

  //Pull the accelerometers measurements from the sensor
  Wire.beginTransmission(0x68);
  Wire.write(0x3B);
  Wire.endTransmission(); 
  Wire.requestFrom(0x68,6);
  int16_t AccXLSB = Wire.read() << 8 | Wire.read();
  int16_t AccYLSB = Wire.read() << 8 | Wire.read();
  int16_t AccZLSB = Wire.read() << 8 | Wire.read();

  //Configure the gyroscope output and pull rotation rate measurement
  Wire.beginTransmission(0x68);
  Wire.write(0x1B); 
  Wire.write(0x8);
  Wire.endTransmission();
  Wire.beginTransmission(0x68);
  Wire.write(0x43);
  Wire.endTransmission();
  
  Wire.requestFrom(0x68,6);  
  int16_t GyroX=Wire.read()<<8 | Wire.read();
  int16_t GyroY=Wire.read()<<8 | Wire.read();
  int16_t GyroZ=Wire.read()<<8 | Wire.read();
  RateRoll=(float)GyroX/65.5;
  RatePitch=(float)GyroY/65.5;
  RateYaw=(float)GyroZ/65.5;
  
  AccX=(float)AccXLSB/4096-0.04; //Because we use the 8g Full Scale Range the LSB sensitivity is 4096 LSB/g
  AccY=(float)AccYLSB/4096+0.04; //So we divide the measurement by 4096 to convert in [g]
  AccZ=(float)AccZLSB/4096-0.12; //Also the calibration numbers have to be set manualy on evry different sensor 
  // Example: AccZ=(float)AccZLSB/4096 +- caliration value;

  //Calculate the absolute Angles for Roll and Pitch 
  AngleRoll=atan(AccY/sqrt(AccX*AccX+AccZ*AccZ))*1/(3.142/180);
  AnglePitch=-atan(AccX/sqrt(AccY*AccY+AccZ*AccZ))*1/(3.142/180);
}

//Starting communication with the gyroscope
void setup() {
  Serial.begin(57600);
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
  Wire.setClock(400000);
  Wire.begin();
  delay(250);
  Wire.beginTransmission(0x68); 
  Wire.write(0x6B);
  Wire.write(0x00);
  Wire.endTransmission();
}

/*
//Use the following loop for the calibration of the values
//Printing the Accelerometer Values in [g]. The max value should be 1[g]
void loop() {
  gyro_signals();
  Serial.print("Acceleration X [g]= ");
  Serial.print(AccX);
  Serial.print(" Acceleration Y [g]= ");
  Serial.print(AccY);
  Serial.print(" Acceleration Z [g]= ");
  Serial.println(AccZ);
  delay(50);
}
*/

//Use this loop for printing the angles and not during the calibration stage.
void loop() {
  gyro_signals();
  Serial.print("Roll angle [°]");
  Serial.print(AngleRoll);
  Serial.print("Pitch angle [°]");
  Serial.println(AnglePitch);
  delay(50);
}
