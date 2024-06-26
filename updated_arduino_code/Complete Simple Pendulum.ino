#include <AccelStepper.h>
#include "ThingsBoard.h" //Version 0.6.0 and Pubsubclient version 2.8.0 ArduinoJson version 6.19.4
#include <ESP8266WiFi.h>
#include <Wire.h>


#define WIFI_AP             "Thomas"
#define WIFI_PASSWORD       "12345678"

// See https://thingsboard.io/docs/getting-started-guides/helloworld/
// to understand how to obtain an access token
#define TOKEN               "oQFWxHFYnZaN9Up7ntiC"  // enter access token of your ThingsBoard Device
#define THINGSBOARD_SERVER  "demo.thingsboard.io"

// Baud rate for debug serial
#define SERIAL_DEBUG_BAUD   115200

int ts = 0;// This is a very important variable for controling when to start and stop sending the data


// Initialize ThingsBoard client
WiFiClient espClient;
// Initialize ThingsBoard instance
ThingsBoard tb(espClient);
// the Wifi radio's status
int status = WL_IDLE_STATUS;

// We assume that all GPIOs are LOW
boolean gpioState[] = {false,false};

// Change this to fit the number of steps per revolution for your stepper motor
// If you have the 28BYJ-48 stepper motor you probably don't need to change it
const int stepsPerRevolution = 2048;  

// ULN2003 Motor Driver GPIO Pins
// NOTE: Use pins D1 and D2 to connect SCL and SDA pins respectively of the MPU-6050
#define IN1 16  //pin D0
#define IN2 14  //pin D5
#define IN3 12  //pin D6
#define IN4 13  //pin D7

// Initialize the stepper library.
// Warning the order of the input pins may be different if you use an other stepper motor
AccelStepper stepper(AccelStepper::HALF4WIRE, IN1, IN3, IN2, IN4);

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

  tb.sendTelemetryInt("Roll angle", AngleRoll);
  tb.sendTelemetryInt("Pitch angle", AnglePitch);
}

void setup()
{  
    // initialize serial for debugging
    Serial.begin(SERIAL_DEBUG_BAUD);
    WiFi.begin(WIFI_AP, WIFI_PASSWORD);
    InitWiFi();
    stepper.setMaxSpeed(1000.0);     // Set the maximum speed for the stepper motor
    stepper.setAcceleration(1000.0); // Set the Acceleration for the stepper motor
    pinMode(18, OUTPUT);             // Sets pin 18 as an output for the angle sensor though it is not really needed.
    Wire.setClock(400000);           // Make sure that you don't use the pin 18 (D8) for anything else. 
}

bool subscribed = false;

//This method is for toggling the on off switch
RPC_Response ts1(const RPC_Data &data)
{
  Serial.println("Received the set switch method 4!");
  char params[10];
  serializeJson(data, params);
  //Serial.println(params);
  String _params = params;
  if (_params == "true") {
    Serial.println("TS1 => On");
    ts=1;
    digitalWrite(18, HIGH);
    Wire.begin();
    delay(250);
    Wire.beginTransmission(0x68); 
    Wire.write(0x6B);
    Wire.write(0x00);
    Wire.endTransmission();
    // Activate the required pins 
    pinMode(IN1,HIGH);
    pinMode(IN2,HIGH);
    pinMode(IN3,HIGH);
    pinMode(IN4,HIGH);
    delay(20);
    stepper.runToNewPosition(4100);// It will start to pull the pendulum to initial position (one full rotation)
     
    delay(2000);
    stepper.runToNewPosition(0);// The rope needs to return in the original position for the pendulum to swing freely 
    delay(20);
    //After the move is complete you have to turn off all the input pins
    pinMode(IN1,LOW);
    pinMode(IN2,LOW);
    pinMode(IN3,LOW);
    pinMode(IN4,LOW);
  }
  else  if (_params == "false")  {
    Serial.println("TS1 => Off");
    ts=0;
    digitalWrite(18, LOW);
    Wire.endTransmission();
  }
return RPC_Response();
}

const size_t callbacks_size = 1;
RPC_Callback callbacks[callbacks_size] = {
  { "getValue",         ts1 }   // enter the name of your switch variable inside the string

};

void loop()
{    
  delay(50);

  if (WiFi.status() != WL_CONNECTED) {
    reconnect();
  }

  if (!tb.connected()) {
    subscribed = false;
    // Connect to the ThingsBoard
    Serial.print("Connecting to: ");
    Serial.print(THINGSBOARD_SERVER);
    Serial.print(" with token ");
    Serial.println(TOKEN);
    if (!tb.connect(THINGSBOARD_SERVER, TOKEN)) {
      Serial.println("Failed to connect");
      return;
    }
  }

  if (!subscribed) {
    Serial.println("Subscribing for RPC...");

    // Perform a subscription. All consequent data processing will happen in
    // processTemperatureChange() and processSwitchChange() functions,
    // as denoted by callbacks[] array.
    if (!tb.RPC_Subscribe(callbacks, callbacks_size)) {
      Serial.println("Failed to subscribe for RPC");
      return;
    }

    Serial.println("Subscribe done");
    subscribed = true;
  }
  if(ts==1){
  Serial.println("Sending data...");
  gyro_signals();
  Serial.print("Roll angle [°]");
  Serial.print(AngleRoll);
  Serial.print("Pitch angle [°]");
  Serial.println(AnglePitch);
  delay(50);
  
  }
  tb.loop();

/*
// Use the following loop for the calibration of the values
// Printing the Accelerometer Values in [g]. The max value should be 1[g]
// For more information about the calibration please check the video (14 | Measure angles with the MPU6050 accelerometer) 
// from Carbon Aeronautics in Youtube https://www.youtube.com/watch?v=7VW_XVbtu9k
  gyro_signals();
  Serial.print("Acceleration X [g]= ");
  Serial.print(AccX);
  Serial.print(" Acceleration Y [g]= ");
  Serial.print(AccY);
  Serial.print(" Acceleration Z [g]= ");
  Serial.println(AccZ);
  delay(50);
  */
  
}



// Method to initialize the WiFi connection
void InitWiFi()
{
  Serial.println("Connecting to AP ...");
  // attempt to connect to WiFi network

  WiFi.begin(WIFI_AP, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to AP");
}

// Method is needed when the ESP8266 tries to reconnect to the WiFi
void reconnect() {
  // Loop until we're reconnected
  status = WiFi.status();
  if ( status != WL_CONNECTED) {
    WiFi.begin(WIFI_AP, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("Connected to AP");
  }
}
