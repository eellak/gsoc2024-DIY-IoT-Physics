
# DIY IoT Physics Experiments for Education:  
**Enhancing Remote Learning and Experimentation**  
*GSoC'24 @GFOSS*

## Project Details

| **GSoC Project**           | DIY IoT Physics Experiments for Education: Enhancing Remote Learning and Experimentation |
|----------------------------|--------------------------------------------------|
| **Contributor**            | Manu Dev                                   |
| **Mentors**                | Hariton Polatoglou                          |
| **Demo Website**           | [Visit Here](https://iot-one-tau.vercel.app/)                                  |
| **Orignal Repository**           | [Visit Here](https://github.com/eellak/gsoc2024-DIY-IoT-Physics/tree/main)                                  |
| **Contact**                | [manudev0004@gmail.com](mailto:manudev0004@gmail.com) |

---

## Overview

This project focuses on developing a comprehensive IoT-based physics lab management system designed to enhance remote learning and experimentation. The system allows users to book lab slots, manage equipment, and monitor lab activities in real-time. By integrating technologies such as React.js, Node.js, Firebase, ThingsBoard, Node MCU and ESP32-CAM, the project offers a modern solution to educational lab management challenges.

---

## Achievements

### Website Development
- **User Interface**: Developed a user-friendly website enabling users to view lab information and equipment details. To attract students and provide information about the lab.
- **Authentication**: Implemented login and signup pages, supporting both traditional and social logins (Google, GitHub). College students and Teachers needs to Sign Up while School students can Log in diretcly using User Name and School code.

### Slot Booking System
- **Booking Feature**: Enabled users to book lab slots, logged in user can view available slots and book as per their need this ensures organized lab usage and preventing scheduling conflicts.

### Firebase Integration
- **Authentication**: Integrated Google and GitHub login options for seamless user access.
- **Data Management**: Stored user data securely using Firebase Database. It is easy to setup and implement.
- **Camera Stream**: Stored ESP32-Cam data securely using Firebase Realtime Database, which can be accessed anywhere and used to stream lab live feed to ThingsBoard Dashboard.

### ThingsBoard Dashboards
- **Custom Dashboards**: Designed and implemented dashboards for various lab equipment, providing real-time monitoring and control capabilities. In total I made 5 Dashboard Indiviually for each lab euipments i.e 1. Light reflection refraction, 2. Heat Energy Boxes, 3. Spring Oscillator, 4. Robotic Arm, 5. Simple Pendulum.

###  Introduced ESP32-CAM 
- **Image Capture**: Developed code to capture and store images, aiding in remote experiment monitoring. This is fast and easy way to see what happening in lab from anywhere.
- **Live Streaming**: ESP32-CAM to stream live video from lab environments. It can easily stream 20-30 FPS over good internet connection and free subscription of firebase.


### Arduino Code 
- **New Code**: Develop code for Spring Oscillator and ESP32-CAM for easy integration with ThingsBoard Dashboard.
- **Enhancements**: Improved the existing codebase, integrating new features (In case to failed to connect default Wifi network it will enable its Access Point to enable user to search for any available network and connects to it).
- **Optimisation**: Optimised the previous code.

### Actuator Simulator 
- **Python Code**: Develop code in python for simulatie different actuators so that is can be easy to debug and test Devices and Dashboards in Things Board Platform.

---

## What can be done further

### Admin Panel Creation
- **Full Functionality**: Design and develop a comprehensive admin panel to manage users and lab operations effectively. This will be helpful to admins, as they will have complete control over the platform without much knowledge of whats going in backend.

### Backend Integration with ThingsBoard API
- **Seamless Interaction**: Connect the backend more efficiently with the ThingsBoard API, allowing users to switch between different functionalities with ease. Suppose a user books a slot, he/she will receive a mail to create password so that they can easily use Things Board Dashboard with existing Dashboard for that particular task. 

### Code Refinement
- **Optimization**: Nothing is best so there is always room for further optimization of the code for performance improvements.
- **Security Fixes**: Futher work can be done to improve the security in the website, prevention and limiting the number of slot booking can be helpful too.
- **Bug Fixes**: Identify and fix any remaining bugs to enhance system stability.

---

## Technologies Used

- **Frontend**: React.js,Typescript, Tailwind CSS
- **Backend**: Node.js, Firebase
- **Database**: Firebase Realtime Database and Firestore Database
- **IoT Platform**: ThingsBoard
- **Hardware**: C++ (Arduino)

---


## Hardware Used

### 1. **NodeMCU**
   - The NodeMCU is an open-source IoT platform that uses the ESP8266 Wi-Fi module. It is ideal for creating Wi-Fi-enabled projects with minimal effort. In this project, the NodeMCU acts as a central controller for various sensors and actuators, managing data communication between the hardware components and the cloud. It is very cheap and easy to use and have wide support available over the internet.

### 2. **ESP32-CAM**
   - The ESP32-CAM is a compact microcontroller module with a built-in camera, capable of capturing images and streaming video over Wi-Fi. It is equipped with a powerful dual-core processor and a variety of interfaces, making it suitable for IoT and embedded applications. In this project, the ESP32-CAM is used to monitor lab activities and stream live footage to the cloud. It costs less than $5, hence well-suited for this project

### 3. **Servo Motors**
   - Servo motors are rotary actuators that allow for precise control of angular position. They are commonly used in robotics and automation projects. In this setup, servo motors are utilized to control mechanical movements in lab experiments, providing accurate and repeatable positioning. (Used in Light Refractions, Robotic Arm)

### 4. **DHT11 Sensor**
   - The DHT11 is a basic, low-cost digital temperature and humidity sensor. It provides reliable data with a simple interface, making it perfect for environmental monitoring. This sensor is used in the project to measure and log the temperature and humidity conditions within the lab environment. (Used in Heat Energy Boxes)

### 5. **Electromagnet**
   - An electromagnet is a type of magnet in which the magnetic field is produced by an electric current. In this project, the electromagnet is used in Spring Oscillator to simulate human intrection. Its operation can be controlled through the NodeMCU, enabling a wide range of experimental setups.

---


## How to Set Up Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/eellak/gsoc2024-DIY-IoT-Physics.git
   cd yourproject
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - **Create a Firebase Project**:
     - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
     - Register your web app and obtain the Firebase configuration object.

   - **Add Firebase to Your Project**:

     - Create a `firebaseConfig.tsx` file in your project and include the following configuration:
       ```javascript
       const firebaseConfig = {
         apiKey: "YOUR_API_KEY",
         authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
         projectId: "YOUR_PROJECT_ID",
         storageBucket: "YOUR_PROJECT_ID.appspot.com",
         messagingSenderId: "YOUR_SENDER_ID",
         appId: "YOUR_APP_ID",
         measurementId: "YOUR_MEASUREMENT_ID"
       };
       
       export default firebaseConfig;
       ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```



---

## How to Set Up Arduino

1. **Install Arduino IDE**:
   - Download and install the [Arduino IDE](https://www.arduino.cc/en/software).

2. **Install ESP32 Board**:
   - Add the ESP32 board to the Arduino IDE by going to **File > Preferences** and adding the following URL to the **Additional Board Manager URLs**:
     ```
     https://dl.espressif.com/dl/package_esp32_index.json
     ```
   - Then, navigate to **Tools > Board > Board Manager**, search for "ESP32," and install the latest version.

3. **Install Required Libraries**:
   - Open the Arduino IDE and go to **Sketch > Include Library > Manage Libraries**. Search for and install the following libraries:

   | **Library Name**            | **Author**            | **Version** |
   |-----------------------------|-----------------------|-------------|
   | **WiFiManager**             | Tzapu                 | 0.16.0      |
   | **Firebase ESP32 Client**   | Mobizt                | 3.11.11     |
   | **ESP32 Camera Web Server** | Rui Santos            | 1.0.0       |
   | **ArduinoJson**             | Benoit Blanchon       | 6.19.4      |
   | **ESP Async WebServer**     | Me-No-Dev             | 1.2.3       |

4. **Upload Code**:
   - Open the `.ino` file from the [project](https://github.com/eellak/gsoc2024-DIY-IoT-Physics/tree/main/updated_arduino_code) in the Arduino IDE.
   - Connect your NodeMCU or ESP32-CAM  to your computer using a USB to serial adapter.
   - Select the correct board and port under **Tools > Board** and **Tools > Port**.
   - Click **Upload** to flash the code onto your board respectively for different purposes.

5. **Connect to Wi-Fi**:
   - The ESP32-CAM will attempt to connect to the Wi-Fi network specified in the code. If it fails, it will start in Access Point mode, allowing you to configure the Wi-Fi credentials via a web portal.

---

## Demo Website

Explore the functional demo website: [Click Here](https://iot-one-tau.vercel.app/).
Although there me some bugs as it is not tested in large scale. Feel free to share if any issues is found

---

## Contact Information

For any questions or further information, feel free to reach out:  
**Email**: [manudev0004@gmail.com](mailto:manudev0004@gmail.com)

---
## About GFOSS
Open Technologies Alliance (GFOSS)  is a non-profit organization founded in 2008, 37 Universities and Research Centers are shareholders of GFOSS.   Our main goal is to promote Openness through the use and the development of Open Standards and Open Technologies in Education, Public Administration and Business in Greece. [Know More](https://gfoss.eu/)
