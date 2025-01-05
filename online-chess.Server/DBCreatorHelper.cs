namespace online_chess.Server
{
    public class DBCreatorHelper
    {
        public static string CreateSQLiteDB(string folderName = "SQLiteDB")
        {
            var folder = folderName;
            var path = Path.Combine(Directory.GetCurrentDirectory(), folder);

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            return Path.Combine(path, "app.db");
        }

    }
}
