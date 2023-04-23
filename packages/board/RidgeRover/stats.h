#ifndef RR_STATS
#define RR_STATS

#include <Arduino.h>

#define MAX_HISTORY 100

class FloatRollingWindow
{
public:
    float values[MAX_HISTORY];
    int length = 0;

    void push(float value)
    {
        if (length < MAX_HISTORY)
        {
            values[length] = value;
            length++;
        }
        else
        {
            for (int i = 1; i < MAX_HISTORY; i++)
                values[i - 1] = values[i];
            values[length - 1] = value;
        }
    };

    void reset()
    {
        length = 0;
    };

    float getSum()
    {
        float sum = 0.0;
        for (int i = 0; i < length; i++)
            sum += values[i];
        return sum;
    };

    float getAverage()
    {
        if (length == 0)
            return 0.0;
        if (length == 0)
            return values[0];
        return getSum() / (float)length;
    };

    float getAverageChange()
    {
        if (length <= 1)
            return 0.0;
        float sum = 0.0;
        for (int i = 1; i < length; i++)
            sum += values[i] - values[i - 1];
        return sum / ((float)length - 1.0);
    };
};

#endif