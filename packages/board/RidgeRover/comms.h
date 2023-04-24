#include <Arduino.h>

#define COMMS_FLOAT_BYTE_COUNT 26 // a to z
#define COMMS_FLOAT_ZERO_BYTE 48  // 0
#define COMMS_FLOAT_NEG_BYTE 97   // "a"
#define COMMS_FLOAT_POS_BYTE 65   // "A"

enum CommType
{
    MOVE,
    IGNORE,
};

class Comms
{
private:
public:
    int buffer[16];
    int bufferLength = 0;
    void push(int byte)
    {
        buffer[bufferLength] = byte;
    };
    void flush()
    {
        bufferLength = 0;
    };
    void setup()
    {
        Serial.begin(115200);
        Serial.println("START");
    };
    float parseRangeFloat(int byte)
    {
        if (byte == COMMS_FLOAT_ZERO_BYTE) // "0"
            return 0.0;
        if (byte >= COMMS_FLOAT_NEG_BYTE && byte < COMMS_FLOAT_NEG_BYTE + COMMS_FLOAT_BYTE_COUNT)
            return -((float)byte - (float)COMMS_FLOAT_NEG_BYTE + 1) / (float)COMMS_FLOAT_BYTE_COUNT;
        if (byte >= COMMS_FLOAT_POS_BYTE && byte < COMMS_FLOAT_POS_BYTE + COMMS_FLOAT_BYTE_COUNT)
            return ((float)byte - (float)COMMS_FLOAT_POS_BYTE + 1) / (float)COMMS_FLOAT_BYTE_COUNT;
        return 0.0;
    };
    void update()
    {
        if (Serial.available() > 0)
        {
            int byte = Serial.read();
            push(byte);
        }
    };
    CommType getType()
    {
        if (bufferLength == 0)
            return IGNORE;

        int byte = buffer[0];
        if (byte == 126) // ~
            return MOVE;

        return IGNORE;
    };
};