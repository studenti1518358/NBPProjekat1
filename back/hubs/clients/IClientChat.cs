using System.Threading.Tasks;
using backend.dtos;
using back.entities;

namespace back.hubs.clients
{
    public interface IChatClient
    {
        public Task ReceiveMessage(MessageDto message);
		public Task ReceiveNotification(Notification notification);
    }
}