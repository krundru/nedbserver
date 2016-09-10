#***********************************************************
# Run nedb server.
#***********************************************************

export NODE_ENV=production

mkdir -p $PWD/logs
mkdir -p $PWD/database

forever stop nedbserver
forever start --uid nedbserver \
	--minUptime=5000 \
	--spinSleepTime=5000 \
	-l $PWD/logs/server.log \
	-a $PWD/lib/server.js --port=9000 --dir=$PWD/database/

echo 		
echo "*************************************************"
echo "*     nedb server is listening at 9000          *"
echo "*************************************************"