// Include all the necessary libraries

#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseClient.h>
#include <WiFiClientSecure.h>
#include "esp_camera.h"
#include "base64.h"

// Replace with your network credentials
#define WIFI_SSID "Manu Dev"
#define WIFI_PASSWORD "nahipata"

// Replace with your Firebase credentials
#define DATABASE_URL "https://cam-storage-5ec5c-default-rtdb.firebaseio.com/" // Root URL of your Firebase Realtime Database
#define DATABASE_SECRET "your_key"                                            // Databse Secret Get it from firebase

// Camera configuration for AI Thinker ESP32-CAM
#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27
#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22

WiFiClientSecure ssl;
DefaultNetwork network;
AsyncClientClass client(ssl, getNetwork(network));

FirebaseApp app;
RealtimeDatabase Database;
AsyncResult result;
LegacyToken dbSecret(DATABASE_SECRET);

void printError(int code, const String &msg)
{
    Serial.printf("Error, msg: %s, code: %d\n", msg.c_str(), code);
}

void setup()
{
    Serial.begin(115200);

    // Connect to Wi-Fi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(300);
    }
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());

    Firebase.printf("Firebase Client v%s\n", FIREBASE_CLIENT_VERSION);

    ssl.setInsecure();

    // Initialize the authentication handler.
    initializeApp(client, app, getAuth(dbSecret));

    // Binding the authentication handler with your Database class object.
    app.getApp<RealtimeDatabase>(Database);

    // Setting database URL
    Database.url(DATABASE_URL);

    client.setAsyncResult(result);

    // Initialize the camera
    camera_config_t config;
    config.ledc_channel = LEDC_CHANNEL_0;
    config.ledc_timer = LEDC_TIMER_0;
    config.pin_d0 = Y2_GPIO_NUM;
    config.pin_d1 = Y3_GPIO_NUM;
    config.pin_d2 = Y4_GPIO_NUM;
    config.pin_d3 = Y5_GPIO_NUM;
    config.pin_d4 = Y6_GPIO_NUM;
    config.pin_d5 = Y7_GPIO_NUM;
    config.pin_d6 = Y8_GPIO_NUM;
    config.pin_d7 = Y9_GPIO_NUM;
    config.pin_xclk = XCLK_GPIO_NUM;
    config.pin_pclk = PCLK_GPIO_NUM;
    config.pin_vsync = VSYNC_GPIO_NUM;
    config.pin_href = HREF_GPIO_NUM;
    config.pin_sccb_sda = SIOD_GPIO_NUM;
    config.pin_sccb_scl = SIOC_GPIO_NUM;
    config.pin_pwdn = PWDN_GPIO_NUM;
    config.pin_reset = RESET_GPIO_NUM;
    config.xclk_freq_hz = 20000000;
    config.pixel_format = PIXFORMAT_JPEG;

    if (psramFound())
    {
        config.frame_size = FRAMESIZE_QVGA;
        config.jpeg_quality = 10;
        config.fb_count = 2;
    }
    else
    {
        config.frame_size = FRAMESIZE_QVGA;
        config.jpeg_quality = 10;
        config.fb_count = 1;
    }

    // Initialize the camera
    esp_err_t err = esp_camera_init(&config);
    if (err != ESP_OK)
    {
        Serial.printf("Camera init failed with error 0x%x", err);
        return;
    }
}

void flipImageUpsideDown(camera_fb_t *fb)
{
    int width = fb->width;
    int height = fb->height;
    int rowSize = width * 3; // 3 bytes per pixel (RGB)

    uint8_t *buf = fb->buf;
    uint8_t *tempRow = (uint8_t *)malloc(rowSize);

    for (int y = 0; y < height / 2; y++)
    {
        int row1 = y * rowSize;
        int row2 = (height - y - 1) * rowSize;

        memcpy(tempRow, buf + row1, rowSize);
        memcpy(buf + row1, buf + row2, rowSize);
        memcpy(buf + row2, tempRow, rowSize);
    }

    free(tempRow);
}

void loop()
{
    // Capture image
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb)
    {
        Serial.println("Camera capture failed");
        return;
    }

    // Uncomment below in order to flip the image  
    // flipImageUpsideDown(fb);

    // Convert image to base64 (necessary to send data faster)
    String base64Image = base64::encode(fb->buf, fb->len);
    esp_camera_fb_return(fb); // Return the frame buffer back to the driver

    // Upload image to Firebase
    Serial.print("Uploading image... ");
    bool status = Database.set<String>(client, "/images/esp32cam", base64Image);
    if (status)
    {
        Serial.println("Image uploaded successfully!");
    }
    else
    {
        printError(client.lastError().code(), client.lastError().message());
    }

    // Changes delay accordingly
    delay(5000); 
}