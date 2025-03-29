<p align="center">
    <img src="https://raw.githubusercontent.com/nashie1004/online-chess/refs/heads/master/online-chess.client/public/live-preview-800.png"  style="object-fit: cover !important" alt="preview-img" />
</p>

# Online-Chess
A simple real time 2-player chess web application created with Phaser, React, Typescript, Bootstrap, ASP.NET Core SignalR and Identity, and SQLite. Other services used are NGINX, AWS EC2, and AWS S3. Uses .NET 9 and React 18.
You can view a demo [here](https://online-chess.xyz).

## Installation (Local)
1. Update the `UseNGINX`, `UseS3` and AWS credentials on `/online-chess.Server/appsettings.json` depending on your preference. Set the `UseS3` to false if you want to use the local file storage service or true if you want to use S3.
```json
"AllowedOrigins": "https://localhost:5000", 
"UseNGINX": false,
"UseS3": false,
"AWS": {
    "AccessKeyId": "your-value",
    "SecretAccessKey": "your-value",
    "Region": "ap-southeast-2",
    "S3": {
        "BucketName": "your-value"
    }
}
```
2. Run the web app:
```bash
cd online-chess.client 
npm run dev # Should be running on https://localhost:5000/

# new terminal
cd online-chess.Server
dotnet watch # Should be running on https://localhost:44332/
```

## Installation (Deployment)
1. Update the `AllowedOrigins`, `UseNGINX`, `UseS3` and AWS credentials on `/online-chess.Server/appsettings.json` depending on your preference:
```json
"AllowedOrigins": "https://localhost:5000"
"UseNGINX": true,
"UseS3": true,
"AWS": {
    "AccessKeyId": "your-value",
    "SecretAccessKey": "your-value",
    "Region": "ap-southeast-2",
    "S3": {
        "BucketName": "your-value"
    }
}
```
2. Update the `/online-chess.client/.env.production` file:
```
VITE_API_URL={{your-server}}
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
- [ ] en passant original square not movable by other piece
