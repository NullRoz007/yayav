
#!/bin/bash
# linpmem build & install
git clone https://github.com/Velocidex/Linpmem.git
cd Linpmem
make

sudo rmmod ./linpem.ko
sudo insmod ./linpmem.ko

sudo rm /dev/linpmem | 0
sudo mknod /dev/linpmem c 42 0

sudo -R :users /dev/linpmem

cd ../

# YARA-FORGE Setup

YARA_FORGE_DIR="./yara-forge"
YARA_FORGE_GIT="https://github.com/YARAHQ/yara-forge/"

VIRTUAL_ENV_PATH="./venv/yf-env"

# Check if Python 3 is installed
if ! command -v python3 >/dev/null 2>&1; then
    echo "Error: Python 3 is not installed on this system." >&2
    exit 1
fi

if [ ! -d "$YARA_FORGE_DIR" ] 
then
    git clone --recurse-submodules -j8 $YARA_FORGE_GIT    
    cd $YARA_FORGE_DIR
    
    python -m venv $VIRTUAL_ENV_PATH
    source "$VIRTUAL_ENV_PATH/bin/activate"
    pip install -r ./requirements.txt
    python3 yara-forge.py

    mkdir $HOME/.local/share/yara-forge-rules/
    cp -r yara-forge/packages/* $HOME/.local/share/yara-forge-rule
fi