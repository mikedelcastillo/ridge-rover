#include <Arduino.h>

#define COMMS_FLOAT_BYTE_COUNT 16 // a to p
#define COMMS_FLOAT_NEG_BYTE 97 // "a"
#define COMMS_FLOAT_POS_BYTE 65 // "A"

class Comms
{
private:
public:
    void setup()
    {
        Serial.begin(115200);
        Serial.println("START");
    };
    float parseRangeFloat(int byte)
    {
        if (byte == 48)
            // "0"
            return 0.0;
        if (byte >= COMMS_FLOAT_NEG_BYTE && byte < COMMS_FLOAT_NEG_BYTE + COMMS_FLOAT_BYTE_COUNT)
            return -((float)byte - (float)COMMS_FLOAT_NEG_BYTE + 1) / (float)COMMS_FLOAT_BYTE_COUNT;
        if (byte >= COMMS_FLOAT_POS_BYTE && byte < COMMS_FLOAT_POS_BYTE + COMMS_FLOAT_BYTE_COUNT)
            return ((float)byte - (float)COMMS_FLOAT_POS_BYTE + 1) / (float)COMMS_FLOAT_BYTE_COUNT;
        return 0.0;
    };
    void update()
    {
    }
};