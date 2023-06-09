#include <Arduino.h>

#define COMMS_FLOAT_BYTE_COUNT 26 // a to z
#define COMMS_FLOAT_ZERO_BYTE 48  // 0
#define COMMS_FLOAT_NEG_BYTE 97   // "a"
#define COMMS_FLOAT_POS_BYTE 65   // "A"

enum CommType
{
    BYTE_MOVE,
    BYTE_CALIBRATE,
    BYTE_IGNORE,
};

class Comms
{
private:
public:
    int buffer[4];
    int bufferLength = 0;
    void push(int byte)
    {
        buffer[bufferLength] = byte;
        bufferLength++;
    };
    void flush()
    {
        bufferLength = 0;
    };
    void setup()
    {
        Serial.begin(115200);
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
    char encodeFloatRange(float data){
        float range = max(-1.0, min(1.0, data));
        int sign = range / abs(range);
        int index = round(abs(range) * COMMS_FLOAT_BYTE_COUNT);
        if(index != 0){
            int offset = sign > 0 ? COMMS_FLOAT_POS_BYTE : COMMS_FLOAT_NEG_BYTE;
            return offset + index - 1;
        }
        return COMMS_FLOAT_ZERO_BYTE;
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
            return BYTE_IGNORE;

        int byte = buffer[0];
        if (byte == 126) // ~
            return BYTE_MOVE;
        if (byte == 33) // !
            return BYTE_CALIBRATE;

        return BYTE_IGNORE;
    };
    bool is(CommType type)
    {
        return type == getType();
    };
    bool is(CommType type, int length)
    {
        return type == getType() && bufferLength == length;
    };
    void debug()
    {
        if (bufferLength > 0)
        {
            for (int i = 0; i < bufferLength; i++)
            {
                Serial.print(buffer[i]);
                Serial.print("\t");
            }
            Serial.print("\n");
        }
    };
};