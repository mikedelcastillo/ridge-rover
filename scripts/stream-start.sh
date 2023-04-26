#!/bin/sh
cd ./mjpg-streamer/mjpg-streamer-experimental
./mjpg_streamer -o "output_http.so -w ./www" -i "input_uvc.so -r VGA -f 30 -y"