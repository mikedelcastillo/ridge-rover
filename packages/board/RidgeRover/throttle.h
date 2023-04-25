#include <Arduino.h>
#include "timing.h"

#define PIN_RPWM 5
#define PIN_LPWM 6
#define PIN_LEN 7
#define PIN_REN 8
#define THRESHOLD 0.1

#define MAX_PWM_VALUE 255

class Throttle
{
public:
    float targetThrottle = 0;

    void setup()
    {
        pinMode(PIN_RPWM, OUTPUT);
        pinMode(PIN_LPWM, OUTPUT);
        pinMode(PIN_LEN, OUTPUT);
        pinMode(PIN_REN, OUTPUT);
    };

    void update()
    {
        if (targetThrottle > -THRESHOLD && targetThrottle < THRESHOLD)
        {
            digitalWrite(PIN_RPWM, LOW);
            digitalWrite(PIN_LPWM, LOW);
            digitalWrite(PIN_LEN, LOW);
            digitalWrite(PIN_REN, LOW);
            return;
        }
        
        digitalWrite(PIN_REN, HIGH);
        digitalWrite(PIN_LEN, HIGH);

        int power = abs(targetThrottle) * MAX_PWM_VALUE;

        if (power > 0)
        {
            analogWrite(PIN_RPWM, power);
            digitalWrite(PIN_LPWM, LOW);
        }
        if (power < 0)
        {
            analogWrite(PIN_RPWM, LOW);
            digitalWrite(PIN_LPWM, power);
        }
    };
};