# Online-Chess
A simple real time 2-player chess web application created with Phaser, React, Typescript, Bootstrap, ASP.NET Core SignalR and Identity, and SQLite. Uses .NET 9 and React 18.
You can view a demo [here](http://ec2-3-106-228-168.ap-southeast-2.compute.amazonaws.com:5000/home).

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
- [ ] setup NGINX and ASP.NET Core
- [ ] add SSL for https
- [ ] follow NGINX/deployment best practices

### Features
- [ ] multiple tabs opened
- [ ] draw request modal no popup
- [ ] castling bug (if already castled) incorrect coordinates on reconnect? - DOING
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
- [ ] add profile image -- encryption
- [ ] optimize other functions using nested loop, pass piece coordinates instead

## Miscellaneous Commands
```
-- SQLite
cd /online-chess.Server/SQLiteDB/
C:/Users/Nash/Downloads/sqlite-tools-win-x64-3480000/sqlite3.exe app.db
.mode column
.headers on
.tables

-- linux dotnet
dotnet --version
export PATH=$PATH:~/dotnet

```