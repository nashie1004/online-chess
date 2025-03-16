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

### Deployment
- [ ] add SSL for https
- [ ] setup NGINX reverse proxy to server
- [ ] link namecheap and ec2

#### Linux Deployment (not yet finished)
1. install dotnet sdk and runtime + environment variables
2. build the project, transfer the files with scp or git
2. install nginx and update .conf file
3. add .service file (systemctl) (with proper permission)
4. setup aws ec2 inbound

### Features
- [ ] multiple tabs opened
- [ ] castling bug (if already castled) incorrect coordinates on reconnect? - DOING
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