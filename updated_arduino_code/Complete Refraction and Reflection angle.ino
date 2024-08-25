// Include all the necessary libraries
//ThingsBoard - Version 0.6.0 and Pubsubclient- version 2.8.0 ArduinoJson- version 6.19.4 rest are latest versions

#include <ESP8266WiFi.h> // Library to manage ESP8266 
#include <WiFiManager.h> // Library to manage Wi-Fi connection
#include "ThingsBoard.h" // Library to manage ThingsBoard connection
#include <Servo.h>       // Library to manage Servo

Servo servo1;

// See https://thingsboard.io/docs/getting-started-guides/helloworld/
// to understand how to obtain an access token
#define TOKEN "otqrjgb1rpt88wtnvk9p"             // Access token of your ThingsBoard Device
#define THINGSBOARD_SERVER "demo.thingsboard.io" // ThingsBoard Server address

// Commented out the hardcoded Wi-Fi credentials (uncomment to fix this wifi/ for testing purpose)
// #define WIFI_AP             "Manu Dev" // name of your WiFi
// #define WIFI_PASSWORD       "nahipata" // password of your WiFi


// Baud rate for debug serial
#define SERIAL_DEBUG_BAUD 115200

// Initialize
WiFiClient espClient;

ThingsBoard tb(espClient);

void setup()
{

  Serial.begin(SERIAL_DEBUG_BAUD);

  // Initialize WiFiManager
  WiFiManager wifiManager;

  // Uncomment this to reset saved Wi-Fi credentials (in case of failure/testing)
  // wifiManager.resetSettings();

  // This starts the configuration portal for Wi-Fi selection
  if (!wifiManager.autoConnect("ESP8266-ConfigAP"))
  {
    Serial.println("Failed to connect to Wi-Fi. Resetting...");
    ESP.reset(); // Reset and try again if failed
    delay(1000);
  }

  Serial.println("Connected to Wi-Fi!");

  // Attach the servo to pin 2
  servo1.attach(2, 544, 3000);
  servo1.write(0);
  delay(1000);
}

bool subscribed = false;

// Method for getting the data from the control knob from ThingsBoard
RPC_Response kn1(const RPC_Data &data)
{
  Serial.print("Received the knob1 Value: ");
  char params[10];
  serializeJson(data, params);
  String _params = params;
  int value1 = _params.toInt();
  Serial.println(value1);
  servo1.write(value1);
  Serial.print("Servo written to: ");
  Serial.println(value1);
  return RPC_Response();
}

const size_t callbacks_size = 1;
RPC_Callback callbacks[callbacks_size] = {
    {"setValue_kn1", kn1} // name of switch variable
};

void loop()
{
  delay(1000);

  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Wi-Fi not connected. Reconnecting...");
    reconnect();
  }

  if (!tb.connected())
  {
    subscribed = false;
    // Connect to the ThingsBoard Server
    Serial.print("Connecting to: ");
    Serial.print(THINGSBOARD_SERVER);
    Serial.print(" with token ");
    Serial.println(TOKEN);
    if (!tb.connect(THINGSBOARD_SERVER, TOKEN))
    {
      Serial.println("Failed to connect");
      return;
    }
  }

  if (!subscribed)
  {
    Serial.println("Subscribing for RPC...");

    // Perform a subscription to listen knob
    if (!tb.RPC_Subscribe(callbacks, callbacks_size))
    {
      Serial.println("Failed to subscribe for RPC");
      return;
    }

    Serial.println("Subscribe done");
    subscribed = true;
  }
  tb.loop();
}

void reconnect()
{
  // Loop until we're reconnected
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Reconnecting to Wi-Fi...");
    WiFiManager wifiManager;
    // This starts the configuration portal for Wi-Fi selection in case connection fails
    wifiManager.autoConnect("ESP8266-ConfigAP");
  }
}
