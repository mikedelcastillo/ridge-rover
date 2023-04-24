#include <Arduino.h>
#include "timing.h"

#define PIN_STEER_ENA 11
#define PIN_STEER_DIR 12
#define PIN_STEER_PUL 13
#define PIN_STEER_POT A0

#define STEER_MICROSTEPS 2;
#define STEER_CALIBRATE_STEPS 50 * STEER_MICROSTEPS;
#define STEER_CALIBRATE_DELAY 50;
#define STEER_TOLERANCE 0.075 // 1/16*1.2

#define STEER_ENABLE LOW
#define STEER_DISABLE HIGH
#define STEER_LEFT HIGH
#define STEER_RIGHT LOW

enum SteeringState
{
    STEER_CALIBRATE = 'C',
    STEER_NORMAL = 'N',
};

enum SteeringPulseState
{
    STEER_IDLE,
    STEER_RESTING,
    STEER_PULSING,
};

class Steering
{

private:
    float potMinValue;
    float potMaxValue;
    float potRawValue;
    float potValue;
    Timing tPot{TIMING_MILLIS, 5};
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

    int pulse = 0;
    SteeringPulseState pulseState = STEER_IDLE;
    Timing tPulse{TIMING_MICROS, 50};
    Timing tRest{TIMING_MILLIS, 5};
    Timing tIdle{TIMING_MILLIS, 2500};

    void updatePulse()
    {
        if (pulseState == STEER_IDLE)
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
                pulseState = STEER_PULSING;
            }
        }
        else if (pulseState == STEER_PULSING)
        {
            if (tPulse.poll())
            {
                digitalWrite(PIN_STEER_PUL, LOW);
                pulseState = STEER_RESTING;
                tRest.reset();
            }
        }
        else if (pulseState == STEER_RESTING)
        {
            if (tRest.poll())
            {
                if (pulse > 0)
                    pulse--;
                if (pulse < 0)
                    pulse++;
                pulseState = STEER_IDLE;
                tIdle.reset();
            }
        }
    };

    int calibrateStep = 0;
    int calibrateStepsLeft = 0;
    Timing tCalibrate{TIMING_MILLIS, 25};
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
                    setState(STEER_NORMAL);
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
        if (pulseState != STEER_IDLE)
            return;
        float diff = targetSteer - currentSteer;
        if (diff > STEER_TOLERANCE)
            pulse = 1;

        if (diff < -STEER_TOLERANCE)
            pulse = -1;
    };

public:
    float currentSteer = 0;
    float targetSteer = 0;

    SteeringState state;

    void setup()
    {
        pinMode(PIN_STEER_POT, INPUT);
        pinMode(PIN_STEER_ENA, OUTPUT);
        pinMode(PIN_STEER_DIR, OUTPUT);
        pinMode(PIN_STEER_PUL, OUTPUT);
        setState(STEER_CALIBRATE);
    };
    void setState(SteeringState targetState)
    {
        state = targetState;
        if (state == STEER_CALIBRATE)
        {
            potMinValue = 1025;
            potMaxValue = -1;
            potRawValue = 0;
            potValue = 0;
            calibrateStep = 0;
        }
        else if (state == STEER_NORMAL)
        {
        }
    };
    void steerTo(float value)
    {
        targetSteer = value;
    };
    void update()
    {
        updatePulse();
        if (tPot.poll())
            readPot();
        if (state == STEER_CALIBRATE)
            updateCalibrate();
        else if (state == STEER_NORMAL)
            updateNormal();
    };
    void debug()
    {
        Serial.print(currentSteer);
        Serial.print("\t");
        Serial.print(targetSteer);
        Serial.print("\t");
        Serial.print(currentSteer);
        Serial.print("\t");
        Serial.println(targetSteer);
    };
};