namespace online_chess.Server
{
    public class DBCreatorHelper
    {
        public static string CreateSQLiteDB(string folderName = "SQLiteDB")
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            return Path.Combine(path, "app.db");
        }

    }
}
