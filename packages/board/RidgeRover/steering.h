#include <Arduino.h>
#include "timing.h"

#define PIN_STEER_ENA 11
#define PIN_STEER_DIR 12
#define PIN_STEER_PUL 13
#define PIN_STEER_POT A0

#define STEER_MICROSTEPS 2;
#define STEER_CALIBRATE_STEPS 50;
#define STEER_CALIBRATE_DELAY 50;
#define STEER_TOLERANCE 0.05

enum SteeringState
{
    CALIBRATE,
    NORMAL
};


class Steering
{

private:
    float potMinValue;
    float potMaxValue;
    float potRawValue;
    float potValue;

    float currentSteer = 0;
    float targetSteer = 0;

    SteeringState state;
    Timing stepperTiming{MICROS, 100};

    bool on = false;
public:
    Steering()
    {
        pinMode(PIN_STEER_POT, INPUT);
        pinMode(PIN_STEER_ENA, OUTPUT);
        pinMode(PIN_STEER_DIR, OUTPUT);
        pinMode(PIN_STEER_PUL, OUTPUT);
        setState(CALIBRATE);
    };
    void setState(SteeringState targetState)
    {
        state = targetState;
        if (state == CALIBRATE)
        {
            potMinValue = 1025;
            potMaxValue = -1;
            potRawValue = 0;
            potValue = 0;
        }
        else if (state == NORMAL)
        {
        }
    };
    void readPot()
    {
        potRawValue = (float)analogRead(PIN_STEER_POT);
        potValue = log(potRawValue) / log(10) * 10;
        potMinValue = min(potMinValue, potValue);
        potMaxValue = max(potMaxValue, potValue);
        float range = potMaxValue - potMinValue;
        float center = potMinValue + range / 2;
        float diff = center - potValue;
        currentSteer = diff / range * 2;
    };
    void update()
    {
        readPot();
        if(stepperTiming.poll()){
            digitalWrite(PIN_STEER_PUL, on ? HIGH : LOW);
            on = !on;
            stepperTiming.reset();
        }
    };
};