
# Online-Chess
A simple real time 2-player chess web application created with Phaser, React, Typescript, Bootstrap, ASP.NET Core SignalR and Identity, and SQLite. Uses .NET 9 and React 18.
You can view a demo [here](https://online-chess.xyz) hosted on AWS EC2.

<p align="center">
    <img src="https://raw.githubusercontent.com/nashie1004/online-chess/refs/heads/master/online-chess.client/public/live-preview.gif" width="480" height="219" style="object-fit: cover;" alt="preview-img" />
</p>

## Installation (Local)
1. Run the web app:
```bash
cd online-chess.client 
npm run dev # Should be running on https://localhost:5000/

# new terminal
cd online-chess.Server
dotnet watch # Should be running on https://localhost:44332/
```

## Installation (Deployment)
1. Update the `/online-chess.client/.env.production` file:
```
VITE_API_URL={{your-server}}
```
2. Update the `/online-chess.Server/appsettings.json` AllowedOrigins value:
```
"AllowedOrigins": "{{your-server}}"
```
3. Publish and start:
```bash
dotnet publish --runtime linux-x64 --self-contained false # depends on your OS
dotnet online-chess.Server.dll
```

## Credits
All [board](https://github.com/lichess-org/lila/blob/master/public/images/board/), [piece](https://github.com/lichess-org/lila/blob/master/public/piece/), and [sound](https://github.com/lichess-org/lila/blob/master/public/sound/) assets came from [Lichess'](https://github.com/lichess-org/lila) Github repository. Custom asset(s) and logo(s) were created using [Piskel](https://www.piskelapp.com/) and [SVGRepo](https://www.svgrepo.com/svg/509810/chess-board).

## Remaining Todos (By Priority)
- [ ] auto renew SSL
- [ ] add profile image -- encryption
- [ ] bug on offer draw
- [ ] fifty move rule check
- [ ] show proper chess move notation
- [ ] proper elo
- [ ] 3 fold repetition
- [ ] queen side castling bug
- [ ] responsive ui / resizeable board [Phaser](https://phaser.io/examples/v3.85.0/scalemanager/view/manually-resize)
- [ ] some framer motion?, more sounds and some phaser effects
- [ ] use redis
- [ ] fix types
- [ ] emoji to chatbox
- [ ] google oauth
- [ ] optimize other functions using nested loop, pass piece coordinates instead
- [ ] lazy load 
- [ ] lack of material resulting in a draw
