const Express = require('express');
const WebSocket = require('ws');
const crypto = require('crypto');

const fetch = require('node-fetch');
const appPackage = require('./package.json');

(async() => {
  const response = await fetch("https://raw.githubusercontent.com/AxonDevelopmentLab/AppsDetails/main/axsc.json");
  const data = await response.json();
  const version = data['server-version'];
  if (version !== appPackage.version) setInterval(() => {
      console.log('\n[!] You are running an outdated AXSC-Intermediary version.\nUpdate to the most recent version on "https://github.com/akkui/AXSC-Intermediary/".\n')
  }, 1000);
})()

const APP = Express();
APP.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

APP.get('/', (req, res) => { res.status(200).json({ status: 200 }); });

const ExpressServer = APP.listen(8080, () => console.log(`AXSC Intermediary server sucessfully started!`));
const Server = new WebSocket.Server({ server: ExpressServer });

let cache = {
  rooms: {},
  temp_users: {}
};

const colorCodes = ["\x1b[0m", "\x1b[31m", "\x1b[32m", "\x1b[33m", "\x1b[34m", "\x1b[35m", "\x1b[36m", "\x1b[37m", "\x1b[91m", "\x1b[92m", "\x1b[93m", "\x1b[94m", "\x1b[95m", "\x1b[96m", "\x1b[97m"];

const commands = {
  "join": (WS, USERHASH, ARGS) => {
    const ID = ARGS.id;
    const HASH = ARGS.hash;
    const NICKNAME = crypto.randomBytes(8).toString('hex');
    const COLOR = colorCodes[Math.floor(Math.random() * colorCodes.length)]
    let SEC_IV = undefined;
    
    const tryGetRoom = cache.rooms[ID];
    if (!tryGetRoom) {
      WS.send(JSON.stringify({ status: "log", message: " \x1b[92m├── \x1b[97mNão foi possivel localizar a sala, criando-a..."}));
      SEC_IV = crypto.randomBytes(16).toString('hex');
      cache.rooms[ID] = { hash: HASH, iv: SEC_IV, users: {} };
      cache.rooms[ID].users[`${USERHASH}`] = { nickname: NICKNAME, ws: WS, color: COLOR };
      WS.send(JSON.stringify({ status: "log", message: " \x1b[92m├── \x1b[97mA sala foi criada com sucesso, estabelecendo conexão..."}));
    } else {
      const getRoomHash = tryGetRoom.hash;
      if (HASH !== getRoomHash) return WS.send(JSON.stringify({ status: 'badCredentials' }));
      SEC_IV = tryGetRoom.iv;
      tryGetRoom.users[`${USERHASH}`] = { nickname: NICKNAME, ws: WS, color: COLOR };
    }
    
    cache.temp_users[`${USERHASH}`] = ID;
    return WS.send(JSON.stringify({ status: 'connected', sec_iv: SEC_IV, nickname: NICKNAME, color: COLOR }));
  },
  "message": (WS, USERHASH, Data) => {
    const ID = Data.channel;
    const MESSAGE = Data.content;
    const ROOM = cache.rooms[ID];
    if (!ROOM) return WS.send(JSON.stringify({ status: 400 }));
    
    const getUserLIST = Object.keys(ROOM.users);
    if (!getUserLIST.includes(USERHASH)) return WS.send(JSON.stringify({ status: 400 }));
    
    const getSender = ROOM.users[USERHASH]
    for (const User of getUserLIST) {
      if (User === USERHASH) continue;
      const getUser = ROOM.users[User];
      getUser.ws.send(JSON.stringify({ message: { sender: getSender.nickname, content: MESSAGE, color: getSender.color } }))
    }
  }
};

const commandsArray = Object.keys(commands);
Server.on('connection', (ws) => {
    const userHash = crypto.createHash('sha256').update(JSON.stringify(ws)).digest('hex');
  
    ws.on('message', (message) => {
      try {
        const Data = JSON.parse(message);
        
        if (!commandsArray.includes(Data.service)) return ws.send(JSON.stringify({ status: 400 }));
        if (!Data[`${Data.service}`]) return ws.send(JSON.stringify({ status: 400 }));
        
        return commands[Data.service](ws, userHash, Data[`${Data.service}`]);
      } catch (err) { return ws.send(JSON.stringify({ status: 400 })); };
    });
  
    ws.on('close', () => {
      const getUserRoomID = cache.temp_users[`${userHash}`];
      if (!getUserRoomID) return;
      delete cache.temp_users[`${userHash}`];
      
      const getRoom = cache.rooms[getUserRoomID];
      if (!getRoom) return;
      delete getRoom.users[`${userHash}`];
    });
});
