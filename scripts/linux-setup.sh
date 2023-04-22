apt update -y
apt upgrade -y
apt install -y build-essential gdb

# Install node via tj/n
curl -fsSL https://raw.githubusercontent.com/tj/n/master/bin/n | bash -s 18
npm install -g n pm2 yarn