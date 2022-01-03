namespace back.hubs
{
    public interface IUserConnections

    {

        public string getConnectionId(string username);


        public void setUserConnection(string connection, string username);
       


    }
}