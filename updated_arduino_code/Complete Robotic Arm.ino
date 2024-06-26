#include "ThingsBoard.h" //Version 0.6.0 and Pubsubclient version 2.8.0 ArduinoJson version 6.19.4
#include <ESP8266WiFi.h>// Latest
#include <Servo.h> //Latest

//initiate the 3 different servo motors
Servo servo1;
Servo servo2;
Servo servo3;

#define WIFI_AP             "Thomas"// name of your wifi
#define WIFI_PASSWORD       "asdfghjkl" // password of your wifi

// See https://thingsboard.io/docs/getting-started-guides/helloworld/
// to understand how to obtain an access token
#define TOKEN               "X6J8UIdEi395DI3T3yzi"  // enter access token of your ThingsBoard Device
#define THINGSBOARD_SERVER  "demo.thingsboard.io"

// Baud rate for debug serial
#define SERIAL_DEBUG_BAUD   115200


// Initialize ThingsBoard client
WiFiClient espClient;
// Initialize ThingsBoard instance
ThingsBoard tb(espClient);
// the Wifi radio's status
int status = WL_IDLE_STATUS;


void setup() {
  // initialize serial for debugging
  Serial.begin(SERIAL_DEBUG_BAUD);
  WiFi.begin(WIFI_AP, WIFI_PASSWORD);
  InitWiFi();
  servo1.attach(2,544,3000); //servo.attach(pin, min, max) pin 2 = D4
  servo2.attach(0,544,3000); //servo.attach(pin, min, max) pin 0 = D3
  servo3.attach(4,544,3000); //servo.attach(pin, min, max) pin 4 = D2
  servo1.write(0);
  servo2.write(0);
  servo3.write(0);
  delay(1000);
}

bool subscribed = false;

//This method is for getting the data from the 1st control knob from thingsboard
RPC_Response kn1(const RPC_Data &data)
{
  Serial.print("Received the knob1 Value");
  char params[10];
  serializeJson(data, params);
  String _params = params;
  int value1=_params.toInt();
  Serial.println(value1);
  servo1.write(value1);
  return RPC_Response();
}
//This method is for getting the data from the 2nd control knob from thingsboard
RPC_Response kn2(const RPC_Data &data)
{
  Serial.print("Received the knob2 Value");
  char params[10];
  serializeJson(data, params);
  String _params = params;
  int value2=_params.toInt();
  Serial.println(value2);
  servo2.write(value2);
  return RPC_Response();
}
//This method is for getting the data from the 3rd control knob from thingsboard
RPC_Response kn3(const RPC_Data &data)
{
  Serial.print("Received the knob3 Value");
  char params[10];
  serializeJson(data, params);
  String _params = params;
  int value3=_params.toInt();
  Serial.println(value3);
  servo3.write(value3);
  return RPC_Response();
}

const size_t callbacks_size = 3;
RPC_Callback callbacks[callbacks_size] = {
  { "setValue_kn1",         kn1 },   // enter the name of your switch variable inside the string
  { "setValue_kn2",         kn2 },   // enter the name of your switch variable inside the string
  { "setValue_kn3",         kn3 }   // enter the name of your switch variable inside the string
};

void loop() {
  delay(1000);

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
  tb.loop();
}

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
