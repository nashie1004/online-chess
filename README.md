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

## TODO Essential (Game) In Order as of 2/9/2025 9:35PM
1. promotion picker - DOING
2. display move turn, check, checkmate, stalemate
3. bug on if king in check
4. en passant bug
5. disconnect or leave logic

## Others
1. fifty move rule
2. show proper chess move notation
3. 3 fold repetition
5. responsive ui
6. bug - toaster
7. bug - table reload/refresh
8. some framer motion?, more sounds and some phaser effects
10. bug - if both player exited and a timer is running, cancel timer?
11. bug - timer not found on resignation and draw

### SQLite
```
cd /online-chess.Server/SQLiteDB
C:/Users/Nash/Downloads/sqlite-tools-win-x64-3480000/sqlite3.exe app.db
```