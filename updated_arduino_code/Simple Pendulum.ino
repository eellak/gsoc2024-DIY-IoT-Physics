// Include all the necessary libraries
//ThingsBoard - Version 0.6.0 and Pubsubclient- version 2.8.0 ArduinoJson- version 6.19.4 rest are latest versions

#include <AccelStepper.h>
#include "ThingsBoard.h" //Version 0.6.0 and Pubsubclient version 2.8.0 ArduinoJson version 6.19.4
#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <Wire.h>


// Commented out the hardcoded Wi-Fi credentials (uncomment to fix this wifi/ for testing purpose)
// #define WIFI_AP             "Manu Dev" // name of your WiFi
// #define WIFI_PASSWORD       "nahipata" // password of your WiFi

// See https://thingsboard.io/docs/getting-started-guides/helloworld/
// to understand how to obtain an access token
#define TOKEN               "oQFWxHFYnZaN9Up7ntiC"  // enter access token of your ThingsBoard Device
#define THINGSBOARD_SERVER  "demo.thingsboard.io"

// Baud rate for debug serial
#define SERIAL_DEBUG_BAUD   115200

int ts = 0; // This is a very important variable for controlling when to start and stop sending the data

// Initialize ThingsBoard client
WiFiClient espClient;
// Initialize ThingsBoard instance
ThingsBoard tb(espClient);
// the Wifi radio's status
int status = WL_IDLE_STATUS;

// We assume that all GPIOs are LOW
boolean gpioState[] = {false, false};

// Change this to fit the number of steps per revolution for your stepper motor
// If you have the 28BYJ-48 stepper motor you probably don't need to change it
const int stepsPerRevolution = 2048;  

// ULN2003 Motor Driver GPIO Pins
#define IN1 16  //pin D0
#define IN2 14  //pin D5
#define IN3 12  //pin D6
#define IN4 13  //pin D7

// Initialize the stepper library.
AccelStepper stepper(AccelStepper::HALF4WIRE, IN1, IN3, IN2, IN4);

float RateRoll, RatePitch, RateYaw;

// Define the accelerometer Variables
float AccX, AccY, AccZ;
float AngleRoll, AnglePitch;

float LoopTimer;

void gyro_signals(void) {
  Wire.beginTransmission(0x68);
  Wire.write(0x1A); // Switch on the digital Low-Pass filter
  Wire.write(0x05);
  Wire.endTransmission();

  // Configure the accelerometer output
  Wire.beginTransmission(0x68);
  Wire.write(0x1C);
  Wire.write(0x10);
  Wire.endTransmission();

  // Pull the accelerometers measurements from the sensor
  Wire.beginTransmission(0x68);
  Wire.write(0x3B);
  Wire.endTransmission(); 
  Wire.requestFrom(0x68, 6);
  int16_t AccXLSB = Wire.read() << 8 | Wire.read();
  int16_t AccYLSB = Wire.read() << 8 | Wire.read();
  int16_t AccZLSB = Wire.read() << 8 | Wire.read();

  // Configure the gyroscope output and pull rotation rate measurement
  Wire.beginTransmission(0x68);
  Wire.write(0x1B); 
  Wire.write(0x8);
  Wire.endTransmission();
  Wire.beginTransmission(0x68);
  Wire.write(0x43);
  Wire.endTransmission();
  
  Wire.requestFrom(0x68, 6);  
  int16_t GyroX = Wire.read() << 8 | Wire.read();
  int16_t GyroY = Wire.read() << 8 | Wire.read();
  int16_t GyroZ = Wire.read() << 8 | Wire.read();
  RateRoll = (float)GyroX / 65.5;
  RatePitch = (float)GyroY / 65.5;
  RateYaw = (float)GyroZ / 65.5;
  
  AccX = (float)AccXLSB / 4096 - 0.04; 
  AccY = (float)AccYLSB / 4096 + 0.04; 
  AccZ = (float)AccZLSB / 4096 - 0.12; 

  // Calculate the absolute Angles for Roll and Pitch 
  AngleRoll = atan(AccY / sqrt(AccX * AccX + AccZ * AccZ)) * 1 / (3.142 / 180);
  AnglePitch = -atan(AccX / sqrt(AccY * AccY + AccZ * AccZ)) * 1 / (3.142 / 180);

  tb.sendTelemetryInt("Roll angle", AngleRoll);
  tb.sendTelemetryInt("Pitch angle", AnglePitch);
}

void setup() {  
  // initialize serial for debugging
  Serial.begin(SERIAL_DEBUG_BAUD);

  // Wi-Fi Manager initialization
  WiFiManager wifiManager;

  // Reset saved settings for debugging
  // wifiManager.resetSettings();

  // Attempt to connect to saved Wi-Fi credentials or create an AP
  if (!wifiManager.autoConnect("ESP_AP")) {
    Serial.println("Failed to connect and hit timeout");
    delay(3000);
    ESP.reset();
    delay(5000);
  }

  // Connection successful
  Serial.println("Connected to Wi-Fi");

  stepper.setMaxSpeed(1000.0);     // Set the maximum speed for the stepper motor
  stepper.setAcceleration(1000.0); // Set the Acceleration for the stepper motor
  pinMode(18, OUTPUT);             // Sets pin 18 as an output for the angle sensor though it is not really needed.
  Wire.setClock(400000);           // Make sure that you don't use the pin 18 (D8) for anything else.
}

bool subscribed = false;

// This method is for toggling the on/off switch
RPC_Response ts1(const RPC_Data &data) {
  Serial.println("Received the set switch method 4!");
  char params[10];
  serializeJson(data, params);
  String _params = params;
  if (_params == "true") {
    Serial.println("TS1 => On");
    ts = 1;
    digitalWrite(18, HIGH);
    Wire.begin();
    delay(250);
    Wire.beginTransmission(0x68); 
    Wire.write(0x6B);
    Wire.write(0x00);
    Wire.endTransmission();
    // Activate the required pins 
    pinMode(IN1, HIGH);
    pinMode(IN2, HIGH);
    pinMode(IN3, HIGH);
    pinMode(IN4, HIGH);
    delay(20);
    stepper.runToNewPosition(4100); // It will start to pull the pendulum to initial position (one full rotation)
    delay(2000);
    stepper.runToNewPosition(0);    // The rope needs to return to the original position for the pendulum to swing freely 
    delay(20);
    // After the move is complete you have to turn off all the input pins
    pinMode(IN1, LOW);
    pinMode(IN2, LOW);
    pinMode(IN3, LOW);
    pinMode(IN4, LOW);
  } else if (_params == "false") {
    Serial.println("TS1 => Off");
    ts = 0;
    digitalWrite(18, LOW);
    Wire.endTransmission();
  }
  return RPC_Response();
}

const size_t callbacks_size = 1;
RPC_Callback callbacks[callbacks_size] = {
  { "getValue", ts1 }   // Enter the name of your switch variable inside the string
};

void loop() {    
  delay(50);

  if (WiFi.status() != WL_CONNECTED) {
    reconnect();
  }

  if (!tb.connected()) {
    subscribed = false;
    // Connect to ThingsBoard
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

  if (ts == 1) {
    Serial.println("Sending data...");
    gyro_signals();
    Serial.print("Roll angle [°]: ");
    Serial.print(AngleRoll);
    Serial.print(" Pitch angle [°]: ");
    Serial.println(AnglePitch);
    delay(50);
  }

  tb.loop();
}

void InitWiFi() {
  Serial.println("Connecting to AP ...");
  WiFiManager wifiManager;

  // Uncomment the following line to reset saved Wi-Fi credentials
  // wifiManager.resetSettings();

  // Start configuration portal for Wi-Fi selection
  if (!wifiManager.autoConnect("ESP8266-ConfigAP")) {
    Serial.println("Failed to connect to Wi-Fi. Resetting...");
    ESP.reset();
    delay(1000);
  }

  Serial.println("Connected to AP");
}

void reconnect() {
  // Reconnect to Wi-Fi if disconnected
  status = WiFi.status();
  if (status != WL_CONNECTED) {
    WiFiManager wifiManager;
    wifiManager.autoConnect("ESP8266-ConfigAP");
  }
}
