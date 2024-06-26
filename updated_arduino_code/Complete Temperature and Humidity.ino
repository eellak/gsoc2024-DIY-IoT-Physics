#include "ThingsBoard.h" //Version 0.6.0 and Pubsubclient version 2.8.0 ArduinoJson version 6.19.4
#include <ESP8266WiFi.h>
#include <DHT.h>


#define WIFI_AP             "Thomas"
#define WIFI_PASSWORD       "12345678"

// See https://thingsboard.io/docs/getting-started-guides/helloworld/
// to understand how to obtain an access token
#define TOKEN               "h5t7oicry4kll98904hv"  // enter access token of your ThingsBoard Device
#define THINGSBOARD_SERVER  "demo.thingsboard.io"

// Baud rate for debug serial
#define SERIAL_DEBUG_BAUD   115200

int ts = 0;// This is a very important variable for controling when to start and stop sending the data
#define DHTPIN 2 //Define the GPIO 2(D4 = GPIO2) pin as the DHTPIN 
#define DHTTYPE DHT11

// Initialize DHT sensor.
DHT dht(DHTPIN, DHTTYPE);
unsigned long lastSend;

// Initialize ThingsBoard client
WiFiClient espClient;
// Initialize ThingsBoard instance
ThingsBoard tb(espClient);
// the Wifi radio's status
int status = WL_IDLE_STATUS;

// We assume that all GPIOs are LOW
boolean gpioState[] = {false,false};

void setup() {
  // Set output mode for all GPIO pins
  pinMode(DHTPIN, INPUT);
  dht.begin();
  delay(10);
  // initialize serial for debugging
  Serial.begin(SERIAL_DEBUG_BAUD);
  WiFi.begin(WIFI_AP, WIFI_PASSWORD);
  InitWiFi();
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
    Serial.println("Toggle Switch - 1 => On");
    ts=1;
    
  }
  else  if (_params == "false")  {
    Serial.println("Toggle Switch - 1 => Off");
    ts=0;
  }
return RPC_Response();
}

// This method is to get the measurement from the sensor and send it to the server
// It also prins in the serial port the measured temperature and humidity
void getAndSendTemperatureAndHumidityData()
{
  Serial.println("Collecting temperature data.");

  // Reading temperature or humidity takes about 250 milliseconds!
  float humidity = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float temperature = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  //Print data in serial port
  Serial.println("Sending data to ThingsBoard:");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" *C ");

  tb.sendTelemetryInt("temperature", temperature);
  tb.sendTelemetryInt("Humidity", humidity);
}

const size_t callbacks_size = 1;
RPC_Callback callbacks[callbacks_size] = {
  { "getValue_1",         ts1 }   // enter the name of your switch variable inside the string

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
  if(ts==1){
  Serial.println("Sending data...");
  getAndSendTemperatureAndHumidityData();
  
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
