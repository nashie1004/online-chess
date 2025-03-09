# Online-Chess
A simple real time 2-player chess web application created with Phaser, React, Typescript, Bootstrap, ASP.NET Core SignalR and Identity, and SQLite. Uses .NET 9 and React 18.
You can view a demo [here](https://github.com/nashie1004/online-chess).

## Installation

Update the .env.development file in `./online-chess.client` by pointing it to our server:
```
VITE_API_URL=https://localhost:44332
```

Run the following commands on `./online-chess.Server`:
```
Update-Database -Context MainDbContext
Update-Database -Context UserIdentityDbContext
```
or
```
dotnet ef database update --context MainDbContext
dotnet ef database update --context UserIdentityDbContext
```
This should create a directory named `./SQLiteDB` where our SQLite Database resides.

Then
```
cd ./online-chess.client/
npm run dev
```
and open a new terminal and finally
```
cd ./online-chess.Server/
dotnet watch
```
after that, the web application should now be running.

## Credits
All [board](https://github.com/lichess-org/lila/blob/master/public/images/board/), [pieces](https://github.com/lichess-org/lila/blob/master/public/piece/), and [sound](https://github.com/lichess-org/lila/blob/master/public/sound/) assets are sourced from [Lichess](https://github.com/lichess-org/lila) Github repo. Custom asset(s) and logo(s) were created using [Piskel](https://www.piskelapp.com/) and [SVGRepo](https://www.svgrepo.com/svg/509810/chess-board).

## SQLite
```
cd /online-chess.Server/SQLiteDB/
C:/Users/Nash/Downloads/sqlite-tools-win-x64-3480000/sqlite3.exe app.db
.mode column
.headers on
.tables
```

## MVP (BUGS)
1. en passant - reconnect false and true
2. castling bug incorrect coordinates?
3. if user disconnected and game timer is up, dont show resume notif
4. double check pawn promote
5. after game over, cleanup (btns disabled, unable to move, show game over on game outcome component)
6. handle incorrect/non existing gameroomkey on play page

## MVP (FEATURES)
1. add profile image -- (game history table, encryption?)

## DEPLOYMENT
1. expose ports with a simple html file
2. transfer files and setup NGINX React
3. transfer files and setup NGINX Server
4. add SSL for https

## OTHER (FEATURES)
1. fifty move rule
2. show proper chess move notation
5. elo
3. 3 fold repetition
4. responsive ui / resizeable board
5. some framer motion?, more sounds and some phaser effects
6. use redis
9. fix types
10. clean code
11. emoji
12. google oauth

## MAIN TODOS
1. handle disconnect / leave logic
2. game is properly saved on resign or draw
3. no main chess move bugs
