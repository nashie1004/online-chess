# Online-Chess
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

## Assets 
- https://github.com/lichess-org/lila/blob/master/public/piece/alpha/
- https://github.com/lichess-org/lila/blob/master/public/images/board/wood4.jpg
- https://www.piskelapp.com/

## Todo
1. play page game state (pieces coords, whose turn is it, timer)
2. disconnect/leave logic
4. refactor/clean react and signalr logic
~~5. profile edit~~
7. promotion picker
8. show notation on chessboard 
9. beautify UI
10. fifty move rule and/or 3 fold repetition
### Refactor issues:
11. queenside castling
12. pawn promotion

### UI Possible Templates
1. https://www.chesssquire.com/chess-vs-computer.html