# Online-Chess
A simple real time 2-player chess web application created with Phaser, React, Typescript, Bootstrap, ASP.NET Core SignalR and Identity, and SQLite. Uses .NET 9 and React 18.
You can view a demo [here](https://online-chess.xyz).

## Installation (Local)

1. Update the `appsettings.json` AllowedOrigins value:
```
"AllowedOrigins": "https://localhost:5000"
```
2. Run the web app:
```
cd online-chess.client
npm run dev

cd online-chess.Server
dotnet watch
```

## Installation (Deployment)

1. Update the `.env.production` file:
```
VITE_API_URL=http://{{your-server}}:5000
```
2. Update the `appsettings.json` AllowedOrigins value:
```
"AllowedOrigins": "http://{{your-server}}:5000"
```
4. Publish and start:
```
dotnet publish --self-contained false
dotnet online-chess.Server.dll
```

## Credits
All [board](https://github.com/lichess-org/lila/blob/master/public/images/board/), [pieces](https://github.com/lichess-org/lila/blob/master/public/piece/), and [sound](https://github.com/lichess-org/lila/blob/master/public/sound/) assets are sourced from [Lichess](https://github.com/lichess-org/lila) Github repo. Custom asset(s) and logo(s) were created using [Piskel](https://www.piskelapp.com/) and [SVGRepo](https://www.svgrepo.com/svg/509810/chess-board).

## Remaining Todos

#### Linux Deployment
1. install nginx, dotnet sdk + runtime, node, npm, nvm, git and then set env variables
2. build the project, transfer the files from windows to linux ec2
3. update nginx.conf file to handle http, https, web socket
4. setup .service (systemctl) 1 for nginx, 1 for asp.net core dll (with proper permission)
5. setup aws ec2 inbound
6. add SSL for https

### Features
- [x] simple elo count
- [ ] simple google analytics?
- [ ] multiple tabs opened
- [ ] no password limitation
- [ ] check limit vm access (aws, .json, .env)

- [ ] add profile image -- encryption
- [ ] fix datetime

- [ ] bug on first move, both e4, d5 pawns move
- [ ] fifty move rule check
- [ ] show proper chess move notation
- [ ] elo
- [ ] 3 fold repetition
- [ ] responsive ui / resizeable board [Phaser](https://phaser.io/examples/v3.85.0/scalemanager/view/manually-resize)
- [ ] some framer motion?, more sounds and some phaser effects
- [ ] use redis
- [ ] fix types
- [ ] clean code
- [ ] emoji
- [ ] google oauth
- [ ] optimize other functions using nested loop, pass piece coordinates instead

## Miscellaneous Commands
```
-- SQLite
:path/sqlite3.exe /online-chess.Server/SQLiteDB/app.db
.mode column
.headers on
.tables

-- linux dotnet
export PATH=$PATH:~/dotnet
dotnet --version

-- windows to linux file transfer
scp -r -i /path/key-pair-name.pem /path/my-file.txt ec2-user@instance-public-dns-name:path/

```