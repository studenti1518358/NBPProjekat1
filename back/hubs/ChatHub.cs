using System.Collections.Generic;
using System.Threading.Tasks;
using back.entities;
using back.hubs.clients;
using Microsoft.AspNetCore.SignalR;

namespace back.hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        private readonly IUserConnections _connections;

        public ChatHub(IUserConnections connections)
        {
            _connections = connections;
        }

        public override Task OnConnectedAsync()
        {
           
          
            _connections.setUserConnection(this.Context.ConnectionId,this.Context.GetHttpContext().Request.Query["username"]);
            return base.OnConnectedAsync();
        }
        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }
       /* public async Task SendMessage(ChatMessage message,string username)
        {
            string connectionId = connections[username];
            await Clients.User(connectionId).Receive(message);
        }*/
    }
}