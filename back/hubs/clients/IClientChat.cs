using System.Threading.Tasks;
using back.entities;

namespace back.hubs.clients
{
    public interface IChatClient
    {
        public Task ReceiveMessage(ChatMessage message);
    }
}