#ifndef RR_TIMING
#define RR_TIMING

#include <Arduino.h>
enum TimingType
{
    MILLIS,
    MICROS,
};

class Timing
{
private:
    unsigned long lastUpdate;
    unsigned long duration;
    TimingType type;
    unsigned long getNow()
    {
        if (type == MILLIS)
        {
            return lastUpdate = millis();
        }
        else if (type == MICROS)
        {
            return lastUpdate = micros();
        }
    };

public:
    Timing(TimingType timingType, unsigned long timingDuration)
    {
        duration = timingDuration;
        type = timingType;
        reset();
    };
    void reset()
    {
        lastUpdate = getNow();
    };
    bool poll()
    {
        unsigned long now = getNow();
        bool result = (now - lastUpdate) >= duration;
        if (result)
            reset();
        return result;
    }
};

#endif