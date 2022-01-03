
using backend.dtos;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace back
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObjaveController:ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        public ObjaveController(IConnectionMultiplexer redis)
        {
            this._redis = redis;

        }
        [Route("subscribe")]
        [HttpGet]
        public async Task<IActionResult> SubscribeToUser(string usernamePub,string usernameSub)
        {
            var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync($"username:{usernamePub}") == false || await db.KeyExistsAsync($"username:{usernameSub}") == false)
            {
                return BadRequest("Some usernames are non-existing");
            }
            int idPub = (int)await db.StringGetAsync($"username:{usernamePub}");
            int idSub = (int)await db.StringGetAsync($"username:{usernameSub}");
            string usernamePubSetKey = $"user:{idPub}:followers";
            string usernameSubSetKey = $"user:{idSub}:following";
            await db.SetAddAsync(usernamePubSetKey, idSub);
            await db.SetAddAsync(usernameSubSetKey, idPub);

            return Ok();


        }

        [Route("objavi")]
        [HttpPost]
        public async Task<IActionResult> Objavi([FromBody] ObjavaDto objava)
        {
            var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync($"username:{objava.Author}") == false)
            {
                return BadRequest("Author username is non-existing");
            }

            long objavaId = await db.StringIncrementAsync("totalObjave");
            int authorId = (int)await db.StringGetAsync($"username:{objava.Author}");
            string userObjaveKey = $"user:{authorId}:objave";
            await db.ListLeftPushAsync(userObjaveKey, objavaId);
            string objavaKey = $"objava:{objavaId}";
            await db.HashSetAsync(objavaKey, new HashEntry[]
            {
                new HashEntry("id",objavaId),
                new HashEntry("author",objava.Author),
                new HashEntry("date",objava.Date),
                new HashEntry("tekst",objava.Text)
            });
         var followers=await db.SetMembersAsync($"author:{authorId}:followers");
          foreach (RedisValue follower in followers)
            {
                long followerId = (long)follower;
                string followerWallKey = $"user:{followerId}:wall";
                await db.ListLeftPushAsync(followerWallKey, objavaId);
            }
            return Ok(objavaId);
        }
      

    }
}
