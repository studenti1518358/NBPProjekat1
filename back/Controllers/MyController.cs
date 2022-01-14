using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using backend.dtos;
using BCrypt.Net;
using back.entities;
using Newtonsoft.Json;
using System.Collections.Generic;
using back.hubs;
using Microsoft.AspNetCore.SignalR;
using back.hubs.clients;

namespace back
{
    [Route("api/[controller]")]
    [ApiController]
    public class MyController:ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IHubContext<ChatHub,IChatClient> _chatHub;
        private readonly IUserConnections _connections;

        public MyController(IConnectionMultiplexer redis, IHubContext<ChatHub,IChatClient> chatHub,IUserConnections connections)
        {
            this._redis = redis;
            _chatHub = chatHub;
            _connections = connections;

        }

       

        [Route("register")]
        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] UserDto user)
        {
            string usernameKey = $"username:{user.Username}";
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
            var db = _redis.GetDatabase();
            if(await db.KeyExistsAsync(usernameKey))
            {
                return BadRequest("Username already exists");
            }
            var nextId = await db.StringIncrementAsync("total_users");
            string userKey = $"user:{nextId}";
            await db.StringSetAsync(usernameKey, nextId);
            await db.HashSetAsync(userKey, new HashEntry[]
            {
                new HashEntry("username",user.Username),
                new HashEntry("password",hashedPassword)
            });
            User newUser=new entities.User();
            newUser.Id = nextId;
            newUser.isOnline = true;
            newUser.Username = user.Username;
            newUser.Password = hashedPassword;


            return Ok(newUser);


        }
        [HttpPost]
        [Route("sendMessage")]
        public async Task<IActionResult> SendMessage([FromBody]ChatMessage message)
        {

            var db = _redis.GetDatabase();
          
           if(await db.KeyExistsAsync($"username:{message.UsernameTo}")==false || await db.KeyExistsAsync($"username:{message.UsernameFrom}")==false)
            {
                return BadRequest("Some usernames are non-existing");
            }

           
            int idTo =(int) await db.StringGetAsync($"username:{message.UsernameTo}");
            int idFrom = (int)await db.StringGetAsync($"username:{message.UsernameFrom}");
            await SetUserOnline(idFrom);
            int id1 = idTo < idFrom ? idTo : idFrom;
            int id2=idTo>idFrom?idTo: idFrom;
            string roomId = $"room:{id1}:{id2}";

            if(await db.KeyExistsAsync(roomId)==false)
            {
                await db.SetAddAsync($"user:{id1}:rooms", roomId);
                await db.SetAddAsync($"user:{id2}:rooms", roomId);
            }

            await db.ListLeftPushAsync(roomId,JsonConvert.SerializeObject(message));
            // await _chatHub.Clients.User(message.UsernameFrom)
			MessageDto mess=new MessageDto();
			mess.UsernameFrom=message.UsernameFrom;
			mess.UsernameTo=message.UsernameTo;
			mess.Date=message.Date;
			mess.Message=message.Message;
			mess.SlikaSrc=await db.HashGetAsync($"user:{idFrom}","ProfilnaSrc");
            mess.FriendLastSeen = await db.HashGetAsync($"user:{idFrom}", "lastSeen");
            if (await db.KeyExistsAsync($"user:{idFrom}:online"))
                mess.IsFriendOnline = true;
            else mess.IsFriendOnline = false;
            string connectionId = _connections.getConnectionId(message.UsernameTo);
            if (connectionId!="")
            await _chatHub.Clients.Client(connectionId).ReceiveMessage(mess);
            //await _chatHub.Clients.All.ReceiveMessage(message);
           //_chatHub.SendMessage
            return Ok(connectionId);

        }
        [HttpGet]
        [Route("getLatestMessages")]
        public async Task<ActionResult<List<ChatMessage>>> GetLatestMessages(string user)
        {
            var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync($"username:{user}") == false)
            {
                return BadRequest("This username is non-existing");
            }
            int userId = (int)await db.StringGetAsync($"username:{user}");
            string userRooms = $"user:{userId}:rooms";
            var rooms = await db.SetMembersAsync(userRooms);
            List<MessageDto> messages = new List<MessageDto>();
            foreach(var roomId in rooms)
            {
                var message = await db.ListRangeAsync((string)roomId, 0, 0);
                MessageDto mess = JsonConvert.DeserializeObject<MessageDto>(message[0]);
				string friend=mess.UsernameTo==user?mess.UsernameFrom:mess.UsernameTo;
				long friendId=(long)await db.StringGetAsync($"username:{friend}");
				mess.SlikaSrc=await db.HashGetAsync($"user:{friendId}","ProfilnaSrc");
                mess.FriendLastSeen = await db.HashGetAsync($"user:{friendId}", "lastSeen");
                if (await db.KeyExistsAsync($"user:{friendId}:online"))
                    mess.IsFriendOnline = true;
                else mess.IsFriendOnline = false;
                messages.Add(mess);
            }
            return Ok(messages);
        }
        [HttpGet]
        [Route("getConversation")]
        public async Task<ActionResult<List<ChatMessage>>> GetConversation(string user1,string user2)
        {

            var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync($"username:{user1}") == false || await db.KeyExistsAsync($"username:{user2}") == false)
            {
                return BadRequest("Some usernames are non-existing");
            }

            int id1 = (int)await db.StringGetAsync($"username:{user1}");
            int id2 = (int)await db.StringGetAsync($"username:{user2}");
            int idFirst = id1 < id2 ? id1 : id2;
            int idSecond = id1 > id2 ? id1 : id2;
            string roomKey = $"room:{idFirst}:{idSecond}";
            var poruke = await db.ListRangeAsync(roomKey, 0, -1);
            List<ChatMessage> messages = new List<ChatMessage>();
            foreach(var poruka in poruke)
            {
                ChatMessage message = JsonConvert.DeserializeObject<ChatMessage>(poruka);
                messages.Add(message);
            }
            return Ok(messages);


        }
        private async Task SetUserOnline(long userId)
        {
            var db = _redis.GetDatabase();
            await db.StringSetAsync($"user:{userId}:online", "true");
            await db.KeyExpireAsync($"user:{userId}:online", TimeSpan.FromMinutes(10));
            await db.HashSetAsync($"user:{userId}", new HashEntry[]
            {
                new HashEntry("lastSeen",DateTime.Now.ToString("MM/dd/yyyy HH:mm"))
            });
        }
    }
}
