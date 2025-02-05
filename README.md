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

## Assets 
- https://github.com/lichess-org/lila/blob/master/public/piece/alpha/
- https://github.com/lichess-org/lila/blob/master/public/images/board/wood4.jpg
- https://www.piskelapp.com/

## TODO Essential (Game)
1. timer - DOING
2. promotion picker - DOING
3. disconnect or leave logic
4. en passant bug
5. display move turn, check, checkmate, stalemate
6. bug on if king in check

## Others
1. fifty move rule
2. show proper chess move notation
3. 3 fold repetition
4. user piece and board ui preference
5. responsive ui
6. toaster
7. table reload/refresh
8. some framer motion?

### SQLite
```
cd /online-chess.Server/SQLiteDB
C:/Users/Nash/Downloads/sqlite-tools-win-x64-3480000/sqlite3.exe app.db
```