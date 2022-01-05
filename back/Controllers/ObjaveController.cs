
using back.entities;
using backend.dtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using StackExchange.Redis;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System;

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
                new HashEntry("author",authorId),
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

        [Route("komentarisi")]
        [HttpPost]
        public async Task<IActionResult> KomentarisiObjavu([FromBody] KomentarDto komentar)
        {
            var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync($"username:{komentar.AutorUsername}") == false || await db.KeyExistsAsync($"objava:{komentar.ObjavaId}"))
            {
                return BadRequest("Author username or objavaId is non-existing");
            }

            long komentarId = await db.StringIncrementAsync("totalKomentari");
            string komentariKey = $"objava:{komentar.ObjavaId}:komentari";
            await db.ListLeftPushAsync(komentariKey, komentarId);
            string komentarKey = $"komentar:{komentarId}";
            long autorId = (long)await db.StringGetAsync(komentar.AutorUsername);
            await db.HashSetAsync(komentarKey, new HashEntry[]
            {
                new HashEntry("text",komentar.Text),
                new HashEntry("date",komentar.Date),
                new HashEntry("autorId",autorId),
                new HashEntry("objavaId",komentar.ObjavaId)
            });

            long objavaAuthorId = (long)await db.HashGetAsync($"objava:{komentar.ObjavaId}", "author");
            //long objavaAuthorId = (long)await db.StringGetAsync(objavaAutor);
            string notificationKey = $"user:{objavaAuthorId}:notifications";

            Notification newNotification = new Notification();
            newNotification.Date = komentar.Date;
            newNotification.ObjectId = komentar.ObjavaId;
            newNotification.Text = $"Korisnik: {komentar.AutorUsername} je komentarisao vasu objavu";
            newNotification.Type = "komentar";
            await db.ListLeftPushAsync(notificationKey, JsonConvert.SerializeObject(newNotification));

            return Ok(komentarId);
        }
      [Route("lajkujObjavu")]
      [HttpGet]
      public async Task<IActionResult> LajkujObjavu(long objavaId,string username)
        {
            var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                return BadRequest(" username is non-existing");
            }

            string objavaLajkoviKey = $"objava:{objavaId}:lajkovi";
            long userId= (long)await db.StringGetAsync(username);
            await db.ListLeftPushAsync(objavaLajkoviKey, userId);

            long objavaAutorId = (long)await db.HashGetAsync($"objava:{objavaId}", "author");

            string notificationKey = $"user:{objavaAutorId}:notifications";

            Notification newNotification = new Notification();
            newNotification.Date = DateTime.Now.Ticks;
            newNotification.ObjectId =objavaId;
            newNotification.Text = $"Korisnik: {username} je lajkovao vasu objavu";
            newNotification.Type = "lajk";
            await db.ListLeftPushAsync(notificationKey, JsonConvert.SerializeObject(newNotification));

            return Ok();

        }

        [Route("lajkujKomentar")]
        [HttpGet]
        public async Task<IActionResult> Lajkujkomentar(long komentarId, string username)
        {
            var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                return BadRequest(" username is non-existing");
            }

            string komentarLajkoviKey = $"komentar:{komentarId}:lajkovi";
            long userId = (long)await db.StringGetAsync(username);
            await db.ListLeftPushAsync(komentarLajkoviKey, userId);
            long autorKomentaraId = (long)await db.HashGetAsync($"komentar:{komentarId}", "autorId");
            long objavaId = (long)await db.HashGetAsync($"komentar:{komentarId}", "objavaId");
            //long objavaAutorId = (long)await db.HashGetAsync($"objava:{objavaId}", "author");

            string notificationKey = $"user:{autorKomentaraId}:notifications";

            Notification newNotification = new Notification();
            newNotification.Date = DateTime.Now.Ticks;
            newNotification.ObjectId = objavaId;
            newNotification.Text = $"Korisnik: {username} je lajkovao vas komentar";
            newNotification.Type = "lajk";
            await db.ListLeftPushAsync(notificationKey, JsonConvert.SerializeObject(newNotification));

            return Ok();

        }

        [HttpGet]
        [Route("getObjava")]
        public async Task<IActionResult> GetObjava(long objavaId)
        {
            Objava objava = new Objava();
            var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"objava:{objavaId}") == false)
            {
                return BadRequest("objava id is non-existing");
            }
            string objavaKey = $"objava:{objavaId}";
            //
            objava.Author = await db.HashGetAsync(objavaKey, "author");
            objava.Date =(double) await db.HashGetAsync(objavaKey, "date");
            objava.Text = await db.HashGetAsync(objavaKey, "text");

            var komentariIds = await db.ListRangeAsync($"objava:{objavaId}:komentari", 0, -1);
            List<Comment> komentari = new List<Comment>();
            foreach (var komentarId in komentariIds)
            {
                Comment newKomentar = new Comment();
                newKomentar.Date = (long)await db.HashGetAsync($"komentar:{komentarId}", "date");
                newKomentar.Text = await db.HashGetAsync($"komentar:{komentarId}", "text");
                newKomentar.ObjavaId = (long)await db.HashGetAsync($"komentar:{komentarId}", "objavaId");
                newKomentar.AuthorId= (long)await db.HashGetAsync($"komentar:{komentarId}", "autorId");
                newKomentar.Id =(long) komentarId;
                var likes = await db.ListRangeAsync($"komentar:{komentarId}:lajkovi", 0, -1);
                newKomentar.LikesIds = likes.ToStringArray();
                komentari.Add(newKomentar);

            }
            objava.Comments = komentari;
            var lajkovi = await db.ListRangeAsync($"objava:{objavaId}:lajkovi", 0, -1);
            objava.LikesIds = lajkovi.ToStringArray();
            return Ok(objava);


        }

    }
}
