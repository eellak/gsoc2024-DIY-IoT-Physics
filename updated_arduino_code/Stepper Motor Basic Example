// Great help with stepper basics in https://randomnerdtutorials.com/esp8266-nodemcu-stepper-motor-28byj-48-uln2003/
#include <AccelStepper.h>

// Change this to fit the number of steps per revolution for your stepper motor
// If you have the 28BYJ-48 stepper motor you probably don't need to change it
const int stepsPerRevolution = 2048;  

// ULN2003 Motor Driver GPIO Pins
#define IN1 16  //D0
#define IN2 14  //D5
#define IN3 12  //D6
#define IN4 13  //D7

// Initialize the stepper library.
// Warning the order of the input pins may be different if you use an other stepper motor
AccelStepper stepper(AccelStepper::HALF4WIRE, IN1, IN3, IN2, IN4);

void setup()
{  
    stepper.setMaxSpeed(1000.0);
    stepper.setAcceleration(1000.0);
    stepper.runToNewPosition(4100);//this is for one full rotation (360 degrees). 
    delay(2000);
    stepper.runToNewPosition(0);// It needs to return in the original position for the pendulum to swing freely 
    delay(20);
    //After the move is complete you have to turn off all the input pins
    pinMode(IN1,LOW);
    pinMode(IN2,LOW);
    pinMode(IN3,LOW);
    pinMode(IN4,LOW);
}

void loop()
{    

}
