# Online-Chess
A simple real time 2-player chess web application created with Phaser, React, Typescript, Bootstrap, ASP.NET Core SignalR and Identity, and SQLite. Uses .NET 9 and React 18.
You can view a demo [here](https://online-chess.xyz) hosted on AWS EC2.

## Installation (Local)

1. Update the `appsettings.json` AllowedOrigins value:
```
"AllowedOrigins": "https://localhost:5000"
```
2. Run the web app:
```
cd online-chess.client 
npm run dev # Should be running on https://localhost:5000/

cd online-chess.Server
dotnet watch # Should be running on https://localhost:44332/
```

## Installation (Deployment)

1. Update the `.env.production` file:
```
VITE_API_URL={{your-server}}
```
2. Update the `appsettings.json` AllowedOrigins value:
```
"AllowedOrigins": "{{your-server}}"
```
3. Publish and start:
```
dotnet publish --self-contained false
dotnet online-chess.Server.dll
```

## Credits
All [board](https://github.com/lichess-org/lila/blob/master/public/images/board/), [piece](https://github.com/lichess-org/lila/blob/master/public/piece/), and [sound](https://github.com/lichess-org/lila/blob/master/public/sound/) assets are came from [Lichess'](https://github.com/lichess-org/lila) Github repository. Custom asset(s) and logo(s) were created using [Piskel](https://www.piskelapp.com/) and [SVGRepo](https://www.svgrepo.com/svg/509810/chess-board).

## Remaining Todos
- [x] simple elo count
- [ ] simple google analytics?
- [ ] multiple tabs opened

- [ ] auto renew SSL
- [ ] add profile image -- encryption
- [ ] fix datetime
- [ ] bug on first move e4 and d5

- [ ] fifty move rule check
- [ ] show proper chess move notation
- [ ] proper elo
- [ ] 3 fold repetition
- [ ] responsive ui / resizeable board [Phaser](https://phaser.io/examples/v3.85.0/scalemanager/view/manually-resize)
- [ ] some framer motion?, more sounds and some phaser effects
- [ ] use redis
- [ ] fix types
- [ ] clean code
- [ ] emoji
- [ ] google oauth
- [ ] optimize other functions using nested loop, pass piece coordinates instead
- [ ] lazy load
