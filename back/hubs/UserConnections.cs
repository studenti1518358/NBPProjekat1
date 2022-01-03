using System.Collections.Generic;

namespace back.hubs
{
    public class UserConnections:IUserConnections

    {
        private Dictionary<string, string> connections = new Dictionary<string, string>();

        public string getConnectionId(string username)
        {
            if (connections.ContainsKey(username))
                return connections[username];
            else return "";
        }

        public void setUserConnection(string connection,string username)
        {
            if (!connections.ContainsKey(username))
                connections.Add(username, connection);
            else connections[username] = connection;
        }


    }
}