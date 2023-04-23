#include <Arduino.h>
#include "timing.h"

#define PIN_STEER_ENA 11
#define PIN_STEER_DIR 12
#define PIN_STEER_PUL 13
#define PIN_STEER_POT A0

#define STEER_MICROSTEPS 2;
#define STEER_CALIBRATE_STEPS 50 * STEER_MICROSTEPS;
#define STEER_CALIBRATE_DELAY 50;
#define STEER_TOLERANCE 0.05

#define STEER_ENABLE LOW
#define STEER_DISABLE HIGH
#define STEER_LEFT HIGH
#define STEER_RIGHT LOW

enum SteeringState
{
    CALIBRATE,
    NORMAL
};

enum SteeringPulseState
{
    IDLE,
    RESTING,
    PULSING,
};

class Steering
{

private:
    Timing tNormal{MICROS, 200};

    float potMinValue;
    float potMaxValue;
    float potRawValue;
    float potValue;
    Timing tPot{MILLIS, 5};
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

    SteeringState state;

    int pulse = 0;
    SteeringPulseState pulseState = IDLE;
    Timing tPulse{MICROS, 50};
    Timing tRest{MILLIS, 5};
    Timing tIdle{MILLIS, 2500};

    void updatePulse()
    {
        if (pulseState == IDLE)
        {
            if (pulse == 0)
            {
                if (tIdle.poll())
                {
                    digitalWrite(PIN_STEER_ENA, STEER_DISABLE);
                }
            }
            else
            {
                digitalWrite(PIN_STEER_ENA, STEER_ENABLE);
                digitalWrite(PIN_STEER_DIR, pulse > 0 ? STEER_RIGHT : STEER_LEFT);
                digitalWrite(PIN_STEER_PUL, HIGH);
                tPulse.reset();
                pulseState = PULSING;
            }
        }
        else if (pulseState == PULSING)
        {
            if (tPulse.poll())
            {
                digitalWrite(PIN_STEER_PUL, LOW);
                pulseState = RESTING;
                tRest.reset();
            }
        }
        else if (pulseState == RESTING)
        {
            if (tRest.poll())
            {
                if (pulse > 0)
                    pulse--;
                if (pulse < 0)
                    pulse++;
                pulseState = IDLE;
                tIdle.reset();
            }
        }
    };

    int calibrateStep = 0;
    int calibrateStepsLeft = 0;
    Timing tCalibrate{MILLIS, 25};
    void updateCalibrate()
    {
        if (calibrateStep == 0)
        {
            // Start calibrate right
            calibrateStepsLeft = STEER_CALIBRATE_STEPS;
            calibrateStep = 1;
            tCalibrate.reset();
        }
        else if (calibrateStep == 1)
        {
            if (tCalibrate.poll())
            {
                if (calibrateStepsLeft == 0)
                {
                    // Start calibrate left
                    calibrateStepsLeft = STEER_CALIBRATE_STEPS;
                    calibrateStep = 2;
                    tCalibrate.reset();
                }
                else
                {
                    // Calibrate right
                    pulse = 1;
                    calibrateStepsLeft--;
                }
            }
        }
        else if (calibrateStep == 2)
        {
            if (tCalibrate.poll())
            {
                if (calibrateStepsLeft == 0)
                {
                    // Complete calibration
                    setState(NORMAL);
                }
                else
                {
                    // Calibrate left
                    pulse = -1;
                    calibrateStepsLeft--;
                }
            }
        }
    };
    void updateNormal()
    {
        float tol = 0.05;
        float diff = targetSteer - currentSteer;
        if (diff > tol)
            pulse = 1;
        if (diff < -tol)
            pulse = -1;
    };

public:
    float currentSteer = 0;
    float targetSteer = 0;

    setup()
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
            calibrateStep = 0;
        }
        else if (state == NORMAL)
        {
        }
    };
    void update()
    {
        updatePulse();
        if (tPot.poll())
            readPot();
        if (state == CALIBRATE)
            updateCalibrate();
        else if (state == NORMAL && tNormal.poll())
            updateNormal();
    };
    void debug()
    {
        Serial.print(state);
        Serial.print("\t");
        Serial.print(pulse);
        Serial.print("\t");
        Serial.print(pulseState);
        Serial.print("\t");
        Serial.println(currentSteer);
    };
};