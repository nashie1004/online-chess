# (In Progress) Online-Chess
A simple real time 2-player chess web application created with Phaser, React, Typescript, Bootstrap, ASP.NET Core SignalR and Identity, and SQLite. Uses .NET 9 and React 18.
You can view a demo [here](https://github.com/nashie1004/online-chess).

## ACTUAL TODOS
1. reconnect to existing game should be smooth, handle side effects
2. display move turn, check, checkmate, stalemate

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


### SQLite
```
cd /online-chess.Server/SQLiteDB
C:/Users/Nash/Downloads/sqlite-tools-win-x64-3480000/sqlite3.exe app.db
```

## ALL TODOS Essential In Order 
1. display move turn, check, checkmate, stalemate
2. bug on if king in check - cause of issue move() is called twice/ on isCheck()
3. en passant bug
4. disconnect or leave logic + sync all state
5. long castling bug
6. promotion pawn check if king pin
7. multiple games in a row without rebuilding
8. fifty move rule
9. show proper chess move notation
10. 3 fold repetition
11. responsive ui
12. some framer motion?, more sounds and some phaser effects
13. bug - if both player exited and a timer is running, cancel timer?
14. bug - timer not found on resignation and draw
15. use redis
16. add board coordinates
17. add profile image
18. fix types
19. clean code