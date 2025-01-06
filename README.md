# Online-Chess

## Description
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
dotnet ef database update MainDbContext
dotnet ef database update UserIdentityDbContext
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

### Chess Logic
~~1. king pins after move function~~
2. stalemate detection - if the piece value suffice

### Chess Game
1. rotate board
2. gameplay is okay on single player
3. phaser and react state is in sync
4. show notation on chessboard 
5. cleanup
6. promotion picker

### Pages / UI
~~1. home / dashboard ~~
2. lobby 
3. play - timer progress bar  
~~4. login~~
~~5. register~~
~~6. logout~~
7. profile

### C#
1. backend - authentication
2. backend - signal move state

### UI Possible Templates
1. https://www.chesssquire.com/chess-vs-computer.html