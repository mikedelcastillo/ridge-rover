#include <Arduino.h>
#include "timing.h"

#define PIN_IR_OUT A1
#define WHEEL_ENCODER_BUFFER 20
#define WHEEL_ENCODER_RESOLUTION 2
#define WHEEL_ENCODER_RESOLUTION_MS 1000 / WHEEL_ENCODER_RESOLUTION
#define WHEEL_ENCODER_SAMPLING_DURATION_MS WHEEL_ENCODER_RESOLUTION_MS / WHEEL_ENCODER_BUFFER

class WheelEncoder {
    private:
        int count = 0;
        int counts[WHEEL_ENCODER_BUFFER];
        int length = 0;

        bool prevState = false;
        bool currState = false;
        Timing tState{TIMING_MILLIS, WHEEL_ENCODER_SAMPLING_DURATION_MS};

        void push(){
            if(length < WHEEL_ENCODER_BUFFER){
                counts[length] = count;
                length++;
            } else {
                for(int i = 1; i < WHEEL_ENCODER_BUFFER; i++)
                    counts[i - 1] = counts[i];
                counts[length - 1] = count;
            }
        };
    public:
        int getTps(){
            if(length == 0) return count * WHEEL_ENCODER_RESOLUTION;

            int sum = 0;
            for(int i = 0; i < length; i++)
                sum += counts[i];

            return sum * WHEEL_ENCODER_RESOLUTION;
        };
        void setup(){
            pinMode(PIN_IR_OUT, INPUT);
        };

        void update(){
            if(tState.poll()){
                push();
                count = 0;
            }

            prevState = currState;
            currState = digitalRead(PIN_IR_OUT) == 1 ? true : false;
            if(prevState == false && currState == true){
                count++;
            }
        };


};