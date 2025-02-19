# (In Progress) Online-Chess
A simple real time 2-player chess web application created with Phaser, React, Typescript, Bootstrap, ASP.NET Core SignalR and Identity, and SQLite. Uses .NET 9 and React 18.
You can view a demo [here](https://github.com/nashie1004/online-chess).

## Installation

Run the following commands:
```
Update-Database -Context MainDbContext
Update-Database -Context UserIdentityDbContext
```
or
```
dotnet ef database update --context MainDbContext
dotnet ef database update --context UserIdentityDbContext
```
This should create a directory named `/SQLiteDB` where our SQLite Database resides.

Then
```
cd .\online-chess.client\
npm run dev
```
and open a new terminal and finally
```
cd .\online-chess.Server\
dotnet watch
```
after that, the web application should now be running.

## Credits
All [board](https://github.com/lichess-org/lila/blob/master/public/images/board/), [pieces](https://github.com/lichess-org/lila/blob/master/public/piece/), and [sound](https://github.com/lichess-org/lila/blob/master/public/sound/) assets are sourced from [Lichess](https://github.com/lichess-org/lila) Github repo. Custom assets were created using [Piskel](https://www.piskelapp.com/).

## TODO Essential (Game) In Order as of 2/9/2025

1. display move turn, check, checkmate, stalemate
2. bug on if king in check - cause of issue move() is called twice/ on isCheck()
3. en passant bug
4. disconnect or leave logic + sync all state
5. long castling bug
6. promotion pawn check if king pin
7. multiple games in a row without rebuilding

## Others
1. fifty move rule
2. show proper chess move notation
3. 3 fold repetition
4. responsive ui
5. some framer motion?, more sounds and some phaser effects
6. bug - if both player exited and a timer is running, cancel timer?
7. bug - timer not found on resignation and draw
8. use redis
9. add board coordinates
10. add profile image
11. fix types

### SQLite
```
cd /online-chess.Server/SQLiteDB
C:/Users/Nash/Downloads/sqlite-tools-win-x64-3480000/sqlite3.exe app.db
```