// Include all the necessary libraries
//ThingsBoard - Version 0.6.0 and Pubsubclient- version 2.8.0 ArduinoJson- version 6.19.4 rest are latest versions

#include <WiFiManager.h> // WiFiManager library
#include <ThingsBoard.h> // 


// Commented out the hardcoded Wi-Fi credentials (uncomment to fix this wifi/ for testing purpose)
// #define WIFI_AP             "Manu Dev" // name of your WiFi
// #define WIFI_PASSWORD       "nahipata" // password of your WiFi

// See https://thingsboard.io/docs/getting-started-guides/helloworld/
// to understand how to obtain an access token
#define TOKEN               "oQFWxHFYnZaN9Up7ntiC"  // enter access token of your ThingsBoard Device
#define THINGSBOARD_SERVER  "demo.thingsboard.io"

// Baud rate for debug serial
#define SERIAL_DEBUG_BAUD   115200

int Solenoid = 0;    // Define GPIO 0 for controlling the solenoid
unsigned long lastSend;

// Initialize ThingsBoard client
WiFiClient espClient;
// Initialize ThingsBoard instance
ThingsBoard tb(espClient);
// Wi-Fi radio's status
int status = WL_IDLE_STATUS;

void setup() {
  // Set output mode for the solenoid pin
  pinMode(Solenoid, OUTPUT);
  digitalWrite(Solenoid, LOW);  // Ensure solenoid is off initially

  InitWiFi();  // Initialize Wi-Fi
}

bool subscribed = false;

// This method is for controlling the solenoid through ThingsBoard RPC
RPC_Response controlSolenoid(const RPC_Data &data) {
  Serial.println("Received solenoid control request!");
  bool state = data.as<bool>();

  if (state) {
    Serial.println("Solenoid => On");
    digitalWrite(Solenoid, HIGH); // Activate solenoid
  } else {
    Serial.println("Solenoid => Off");
    digitalWrite(Solenoid, LOW);  // Deactivate solenoid
  }
  return RPC_Response();
}

const size_t callbacks_size = 1;
RPC_Callback callbacks[callbacks_size] = {
  { "controlSolenoid", controlSolenoid }   // enter the name of your RPC method inside the string
};

void loop() {
  delay(1000);

  if (WiFi.status() != WL_CONNECTED) {
    reconnect(); // Attempt to reconnect if Wi-Fi is disconnected
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

    // Perform a subscription
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