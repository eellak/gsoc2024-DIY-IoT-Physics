#include "ThingsBoard.h" // Version 0.6.0 and Pubsubclient version 2.8.0 ArduinoJson version 6.19.4
#include <ESP8266WiFi.h>  // Latest
#include <WiFiManager.h>  // Library to manage Wi-Fi connection
#include <Servo.h>        // Latest

// Initialize the 3 different servo motors
Servo servo1;
Servo servo2;
Servo servo3;

// Commented out the hardcoded Wi-Fi credentials (uncomment to fix this wifi/ for testing purpose)
// #define WIFI_AP             "Manu Dev" // name of your WiFi
// #define WIFI_PASSWORD       "nahipata" // password of your WiFi


// ThingsBoard and Wi-Fi credentials
#define TOKEN "X6J8UIdEi395DI3T3yzi"  // Access token of your ThingsBoard Device
#define THINGSBOARD_SERVER "demo.thingsboard.io" // ThingsBoard Server address

// Baud rate for debug serial
#define SERIAL_DEBUG_BAUD 115200

// Initialize ThingsBoard client
WiFiClient espClient;
// Initialize ThingsBoard instance
ThingsBoard tb(espClient);

// Status of the Wi-Fi connection
int status = WL_IDLE_STATUS;

void setup() {
  // Initialize serial for debugging
  Serial.begin(SERIAL_DEBUG_BAUD);
  InitWiFi();  // Initialize Wi-Fi

  // Attach servos to pins
  servo1.attach(2, 544, 3000); // Pin 2 = D4
  servo2.attach(0, 544, 3000); // Pin 0 = D3
  servo3.attach(4, 544, 3000); // Pin 4 = D2

  // Set initial servo positions
  servo1.write(0);
  servo2.write(0);
  servo3.write(0);
  delay(1000);
}

bool subscribed = false;

// Method to get data from the 1st control knob from ThingsBoard
RPC_Response kn1(const RPC_Data &data) {
  Serial.print("Received the knob1 Value");
  char params[10];
  serializeJson(data, params);
  String _params = params;
  int value1 = _params.toInt();
  Serial.println(value1);
  servo1.write(value1);
  return RPC_Response();
}

// Method to get data from the 2nd control knob from ThingsBoard
RPC_Response kn2(const RPC_Data &data) {
  Serial.print("Received the knob2 Value");
  char params[10];
  serializeJson(data, params);
  String _params = params;
  int value2 = _params.toInt();
  Serial.println(value2);
  servo2.write(value2);
  return RPC_Response();
}

// Method to get data from the 3rd control knob from ThingsBoard
RPC_Response kn3(const RPC_Data &data) {
  Serial.print("Received the knob3 Value");
  char params[10];
  serializeJson(data, params);
  String _params = params;
  int value3 = _params.toInt();
  Serial.println(value3);
  servo3.write(value3);
  return RPC_Response();
}

const size_t callbacks_size = 3;
RPC_Callback callbacks[callbacks_size] = {
  {"setValue_kn1", kn1}, // Callback for knob 1
  {"setValue_kn2", kn2}, // Callback for knob 2
  {"setValue_kn3", kn3}  // Callback for knob 3
};

void loop() {
  delay(1000);

  if (WiFi.status() != WL_CONNECTED) {
    reconnect(); // Attempt to reconnect if Wi-Fi is disconnected
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

    // Perform a subscription for RPC
    if (!tb.RPC_Subscribe(callbacks, callbacks_size)) {
      Serial.println("Failed to subscribe for RPC");
      return;
    }

    Serial.println("Subscribe done");
    subscribed = true;
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
