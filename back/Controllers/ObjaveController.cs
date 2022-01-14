
using back.entities;
using backend.dtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using StackExchange.Redis;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.Linq;
using back.hubs;
using Microsoft.AspNetCore.SignalR;
using back.hubs.clients;

namespace back
{
	
    [Route("api/[controller]")]
    [ApiController]
    public class ObjaveController:ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IWebHostEnvironment _hostEnvironment;
		 private readonly IHubContext<ChatHub,IChatClient> _chatHub;
		 private readonly IUserConnections _connections;
        public ObjaveController(IConnectionMultiplexer redis,IWebHostEnvironment env, IHubContext<ChatHub,IChatClient> chatHub,IUserConnections connections)
        {
            this._redis = redis;
            this. _hostEnvironment=env;
		    _chatHub = chatHub;
            _connections = connections;

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
            await SetUserOnline(idSub);
            string usernamePubSetKey = $"user:{idPub}:followers";
            string usernameSubSetKey = $"user:{idSub}:following";
            await db.SetAddAsync(usernamePubSetKey, idSub);
            await db.SetAddAsync(usernameSubSetKey, idPub);
			
			 Notification newNotification = new Notification();
            newNotification.Date =DateTime.Now.ToString("MM/dd/yyyy HH:mm");
            newNotification.ObjectId = usernameSub;
            newNotification.Text = $"Korisnik: {usernameSub} vas je zapratio!";
            newNotification.Type = "pracenje";
			string notificationKey=$"user:{idPub}:notifications";
            await db.ListLeftPushAsync(notificationKey, JsonConvert.SerializeObject(newNotification));
            await db.StringIncrementAsync($"user:{idPub}:unreadNots");
			
			string connectionId = _connections.getConnectionId(usernamePub);
            if (connectionId!="")
            await _chatHub.Clients.Client(connectionId).ReceiveNotification(newNotification);

            return Ok();


        }
		[Route("unsubscribe")]
		[HttpGet]
		public async Task<IActionResult> Unsubscribe(string usernamePub,string usernameSub)
		{
			  var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync($"username:{usernamePub}") == false || await db.KeyExistsAsync($"username:{usernameSub}") == false)
            {
                return BadRequest("Some usernames are non-existing");
            }
            int idPub = (int)await db.StringGetAsync($"username:{usernamePub}");
            int idSub = (int)await db.StringGetAsync($"username:{usernameSub}");
            await SetUserOnline(idSub);
            string usernamePubSetKey = $"user:{idPub}:followers";
            string usernameSubSetKey = $"user:{idSub}:following";
			
			  await db.SetRemoveAsync(usernamePubSetKey, idSub);
            await db.SetRemoveAsync(usernameSubSetKey, idPub);
			
			return Ok();
			
		}
		[Route("getFollowers/{username}")]
		[HttpGet]
		public async Task<IActionResult> GetFollowers(string username)
		{
			 var db = _redis.GetDatabase();
			 if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                return BadRequest(" username is non-existing");
            }
			 List<Tuple<string,string>> pratioci=new List<Tuple<string,string>>();
			  int id = (int)await db.StringGetAsync($"username:{username}");
			var followers=await db.SetMembersAsync($"user:{id}:followers");
          foreach (RedisValue follower in followers)
            {
                long followerId = (long)follower;
                string followerUsername = await db.HashGetAsync($"user:{followerId}", "username");
				string slika=await db.HashGetAsync($"user:{followerId}", "ProfilnaSrc");
				pratioci.Add(Tuple.Create(followerUsername,slika));
            }
            return Ok(pratioci);
			 
		}
		
		[Route("getFollowing/{username}")]
		[HttpGet]
		public async Task<IActionResult> GetFollowing(string username)
		{
			 var db = _redis.GetDatabase();
			 if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                return BadRequest("username is non-existing");
            }
			 List<Tuple<string,string>> pratioci=new List<Tuple<string,string>>();
			  int id = (int)await db.StringGetAsync($"username:{username}");
			var followers=await db.SetMembersAsync($"user:{id}:following");
          foreach (RedisValue follower in followers)
            {
                long followerId = (long)follower;
                string followerUsername = await db.HashGetAsync($"user:{followerId}", "username");
				string slika=await db.HashGetAsync($"user:{followerId}", "ProfilnaSrc");
				pratioci.Add(Tuple.Create(followerUsername,slika));
            }
            return Ok(pratioci);
			 
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
            await SetUserOnline(authorId);
            string userObjaveKey = $"user:{authorId}:objave";
            await db.ListLeftPushAsync(userObjaveKey, objavaId);
            string objavaKey = $"objava:{objavaId}";
            string datum= DateTime.Now.ToString("MM/dd/yyyy");
			 string authorSrc = await db.HashGetAsync($"user:{authorId}", "ProfilnaSrc");
            
            await db.HashSetAsync(objavaKey, new HashEntry[]
            {
                new HashEntry("id",objavaId),
                new HashEntry("author",authorId),
                new HashEntry("date", datum),
                new HashEntry("tekst",objava.Text),
                new HashEntry("slikaSrc",objava.Slika),
				 new HashEntry("authorUsername",objava.Author),
				 new HashEntry("authorSrc",authorSrc)
				
            });
         var followers=await db.SetMembersAsync($"user:{authorId}:followers");
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

            if (await db.KeyExistsAsync($"username:{komentar.AutorUsername}") == false || await db.KeyExistsAsync($"objava:{komentar.ObjavaId}")==false)
            {
                return BadRequest("Author username or objavaId is non-existing");
            }

            long komentarId = await db.StringIncrementAsync("totalKomentari");
            string komentariKey = $"objava:{komentar.ObjavaId}:komentari";
            await db.ListRightPushAsync(komentariKey, komentarId);
            string komentarKey = $"komentar:{komentarId}";
            long autorId = (long)await db.StringGetAsync($"username:{komentar.AutorUsername}");
            await SetUserOnline(autorId);
			
            string autorSrc = await db.HashGetAsync($"user:{autorId}", "ProfilnaSrc");
            await db.HashSetAsync(komentarKey, new HashEntry[]
            {
                new HashEntry("text",komentar.Text),
                new HashEntry("date",komentar.Date),
                new HashEntry("autorId",autorId),
                new HashEntry("authorUsername",komentar.AutorUsername),
                 new HashEntry("authorSrc",autorSrc),
                new HashEntry("objavaId",komentar.ObjavaId)
            });

            long objavaAuthorId = (long)await db.HashGetAsync($"objava:{komentar.ObjavaId}", "author");
			string authorUsername=await db.HashGetAsync($"user:{objavaAuthorId}","username");
            //long objavaAuthorId = (long)await db.StringGetAsync(objavaAutor);
            string notificationKey = $"user:{objavaAuthorId}:notifications";

            Notification newNotification = new Notification();
            newNotification.Date = komentar.Date;
            newNotification.ObjectId = komentar.ObjavaId.ToString();
            newNotification.Text = $"Korisnik: {komentar.AutorUsername} je komentarisao vasu objavu";
            newNotification.Type = "komentar";
            await db.ListLeftPushAsync(notificationKey, JsonConvert.SerializeObject(newNotification));
			 await db.StringIncrementAsync($"user:{objavaAuthorId}:unreadNots");
			
			string connectionId = _connections.getConnectionId(authorUsername);
            if (connectionId!="")
            await _chatHub.Clients.Client(connectionId).ReceiveNotification(newNotification);

            return Ok(komentarId);
        }
          
      [Route("lajkujObjavu")]
      [HttpPost]
      public async Task<IActionResult> LajkujObjavu(long objavaId,[FromBody]Like lajk)
        {
            var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"username:{lajk.Username}") == false)
            {
                return BadRequest(" username is non-existing");
            }

            string objavaLajkoviKey = $"objava:{objavaId}:lajkovi";
            long userId= (long)await db.StringGetAsync($"username:{lajk.Username}");
            await SetUserOnline(userId);
            
            await db.ListLeftPushAsync(objavaLajkoviKey, JsonConvert.SerializeObject(lajk));

            long objavaAutorId = (long)await db.HashGetAsync($"objava:{objavaId}", "author");
			string objavaAutorUsername=await db.HashGetAsync($"user:{objavaAutorId}","username");

            string notificationKey = $"user:{objavaAutorId}:notifications";

            Notification newNotification = new Notification();
            newNotification.Date = DateTime.Now.ToString("MM/dd/yyyy HH:mm");
            newNotification.ObjectId =objavaId.ToString();
            newNotification.Text = $"Korisnik: {lajk.Username} je lajkovao vasu objavu";
            newNotification.Type = "lajk";
            await db.ListLeftPushAsync(notificationKey, JsonConvert.SerializeObject(newNotification));
			 await db.StringIncrementAsync($"user:{objavaAutorId}:unreadNots");
			
			string connectionId = _connections.getConnectionId(objavaAutorUsername);
            if (connectionId!="")
            await _chatHub.Clients.Client(connectionId).ReceiveNotification(newNotification);

            return Ok();

        }
         [HttpPost]
        [Route("lajkujKomentar")]
        public async Task<IActionResult> Lajkujkomentar(long komentarId,[FromBody] Like lajk)
        {
            var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"username:{lajk.Username}") == false)
            {
                return BadRequest(" username is non-existing");
            }

            string komentarLajkoviKey = $"komentar:{komentarId}:lajkovi";
            long userId = (long)await db.StringGetAsync(lajk.Username);
            await SetUserOnline(userId);
            await db.ListLeftPushAsync(komentarLajkoviKey, JsonConvert.SerializeObject(lajk));
            long autorKomentaraId = (long)await db.HashGetAsync($"komentar:{komentarId}", "autorId");
			string autorKomentaraUsername=await db.HashGetAsync($"user:{autorKomentaraId}","username");
            long objavaId = (long)await db.HashGetAsync($"komentar:{komentarId}", "objavaId");
            //long objavaAutorId = (long)await db.HashGetAsync($"objava:{objavaId}", "author");

            string notificationKey = $"user:{autorKomentaraId}:notifications";

            Notification newNotification = new Notification();
            newNotification.Date = DateTime.Now.ToString("MM/dd/yyyy HH:mm");
            newNotification.ObjectId = objavaId.ToString();
            newNotification.Text = $"Korisnik: {lajk.Username} je lajkovao vas komentar";
            newNotification.Type = "lajk";
            await db.ListLeftPushAsync(notificationKey, JsonConvert.SerializeObject(newNotification));
			 await db.StringIncrementAsync($"user:{autorKomentaraId}:unreadNots");
			
				string connectionId = _connections.getConnectionId(autorKomentaraUsername);
            if (connectionId!="")
            await _chatHub.Clients.Client(connectionId).ReceiveNotification(newNotification);

            return Ok();

        }

        [HttpGet]
        [Route("getZid/{username}")]
        public async Task<IActionResult> GetZid(string username)
        {
            var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                return BadRequest(" username is non-existing");
            }
            long userId = (long)await db.StringGetAsync($"username:{username}");
            var objaveIds = await db.ListRangeAsync($"user:{userId}:wall", 0, -1);
            List<Objava> objave = new List<Objava>();
            foreach(var objavaId in objaveIds)
            {
                objave.Add(await GetObjava((long)objavaId));
            }
            return Ok(objave);
        }
		
		[HttpGet]
		[Route("getNotifications/{username}")]
		public async Task<IActionResult> GetNotifikacije(string username)
		{
			 var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                return BadRequest(" username is non-existing");
            }
			 long userId = (long)await db.StringGetAsync($"username:{username}");
			string notificationKey = $"user:{userId}:notifications";
            var notifikacije = await db.ListRangeAsync(notificationKey, 0, -1);
            List<Notification> messages = new List<Notification>();
            foreach(var notification in notifikacije)
            {
                Notification notifikacija = JsonConvert.DeserializeObject<Notification>(notification);
                messages.Add(notifikacija);
            }
            return Ok(messages);
		}

        [HttpGet]
        [Route("getObjave/{username}")]
        public async Task<IActionResult> GetObjave(string username)
        {
            var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                return BadRequest(" username is non-existing");
            }
            long userId = (long)await db.StringGetAsync($"username:{username}");
            var objaveIds = await db.ListRangeAsync($"user:{userId}:objave", 0, -1);
            List<Objava> objave = new List<Objava>();
            foreach (var objavaId in objaveIds)
            {
                objave.Add(await GetObjava((long)objavaId));
            }
            return Ok(objave);
        }



        private async Task<Objava> GetObjava(long objavaId)
        {
            Objava objava = new Objava();
            var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"objava:{objavaId}") == false)
            {
                throw new Exception("objava id is non-existing");
            }
            string objavaKey = $"objava:{objavaId}";
            //
            objava.AuthorId =(long) await db.HashGetAsync(objavaKey, "author");
            objava.AuthorUsername= await db.HashGetAsync(objavaKey, "authorUsername");
            objava.Date = await db.HashGetAsync(objavaKey, "date");
            objava.Text = await db.HashGetAsync(objavaKey, "tekst");
            objava.AutorSrc= await db.HashGetAsync(objavaKey, "authorSrc");
            objava.Id = objavaId;
            objava.SlikaSrc= await db.HashGetAsync(objavaKey, "slikaSrc");

            var komentariIds = await db.ListRangeAsync($"objava:{objavaId}:komentari", 0, -1);
            List<Comment> komentari = new List<Comment>();
            foreach (var komentarId in komentariIds)
            {
                Comment newKomentar = new Comment();
                newKomentar.Date = await db.HashGetAsync($"komentar:{komentarId}", "date");
                newKomentar.Text = await db.HashGetAsync($"komentar:{komentarId}", "text");
                newKomentar.ObjavaId = (long)await db.HashGetAsync($"komentar:{komentarId}", "objavaId");
                newKomentar.AuthorId= (long)await db.HashGetAsync($"komentar:{komentarId}", "autorId");
                newKomentar.Id =(long) komentarId;
                newKomentar.AuthorUsername= await db.HashGetAsync($"komentar:{komentarId}", "authorUsername");
                newKomentar.AutorSrc= await db.HashGetAsync($"komentar:{komentarId}", "authorSrc");
                var likes = (await db.ListRangeAsync($"komentar:{komentarId}:lajkovi", 0, -1)).ToStringArray();
                Like[] Lajkovi = new Like[likes.Length];
                int index = 0;
                foreach(var like in likes)
                {
                    Lajkovi[index++] = JsonConvert.DeserializeObject<Like>(like);

                }
                newKomentar.Likes = Lajkovi;
                komentari.Add(newKomentar);

            }
            objava.Comments = komentari;
            var lajkovi = await db.ListRangeAsync($"objava:{objavaId}:lajkovi", 0, -1);
            objava.Likes = lajkovi.ToStringArray().Select(x=>JsonConvert.DeserializeObject<Like>(x)).ToArray();
            return objava;


        }

        [Route("IzmeniSliku/{korIme}")]
        [HttpPut]
        public async Task<IActionResult> IzmeniSliku(string korIme,[FromForm]IFormFile profilnaFIle)
        {
           
            var db = _redis.GetDatabase();
            User user= (User) await this.GetUsergetUserByUserName(korIme);
            
            int userId=(int) await db.StringGetAsync($"username:{user.Username}");
            string key = $"user:{userId}";
            if(user==null)
            {
                return BadRequest();
            }
            else
            {
              
                var slikaPom= await SacuvajSliku(profilnaFIle);
                string profilna=String.Format("{0}://{1}{2}/Images/{3}",Request.Scheme,Request.Host,Request.PathBase,slikaPom);
                await db.HashSetAsync(key,new HashEntry[]{
                new HashEntry("ProfilnaSrc", profilna),
              });
                
               return Ok();

            }
           
           
        }

        [NonAction]
        public async Task<string> SacuvajSliku(IFormFile slika)
        {
            string imeSlike= new String (Path.GetFileNameWithoutExtension(slika.FileName).Take(10).ToArray()).Replace(' ','-');
            
            imeSlike=imeSlike+DateTime.Now.ToString("yymmssfff")+Path.GetExtension(slika.FileName);
            var slikaPath= Path.Combine(_hostEnvironment.ContentRootPath,"Images",imeSlike);
            using (var fileStream=new FileStream(slikaPath,FileMode.Create))
            {
                await slika.CopyToAsync(fileStream);
            }
            return imeSlike;

        }

        [Route("IzmeniNaslovnuSliku/{korIme}")]
        [HttpPut]
        public async Task<IActionResult> IzmeniNaslovnuSliku(string korIme,[FromForm]IFormFile naslovnaFIle)
        {
           
            var db = _redis.GetDatabase();
            User user= (User) await this.GetUsergetUserByUserName(korIme);
            
            int userId=(int) await db.StringGetAsync($"username:{user.Username}");
            string key = $"user:{userId}";
            if(user==null)
            {
                return BadRequest();
            }
            else
            {
              
                var slikaPom= await SacuvajSliku(naslovnaFIle);
                string naslovna=String.Format("{0}://{1}{2}/Images/{3}",Request.Scheme,Request.Host,Request.PathBase,slikaPom);
                await db.HashSetAsync(key,new HashEntry[]{
                  new HashEntry("NaslovnaSrc", naslovna),
              });
             
                
               return Ok();

            }  
        }
        [Route("DodajNovuSliku/{korIme}")]
        [HttpPut]
        public async Task<IActionResult> DodajNovuSliku(string korIme,[FromForm]IFormFile slikaFile)
        {
           
            var db = _redis.GetDatabase();
            User user= (User) await this.GetUsergetUserByUserName(korIme);
            int userId=(int) await db.StringGetAsync($"username:{user.Username}");
            string key = $"user:{userId}";
            string keySlike= $"user:{userId}:slike";
           if(user==null)
            {
                return BadRequest();
            }
            else
            {
               
                var slikaPom= await SacuvajSliku(slikaFile);
                string slika=String.Format("{0}://{1}{2}/Images/{3}",Request.Scheme,Request.Host,Request.PathBase,slikaPom);
                await db.ListLeftPushAsync(keySlike,slika);
                
               return Ok(slika);

            }  
        }
        [HttpGet]
        [Route("PreuzmiSlike/{username}")]
        public async Task<List<string>> PreuzmiSlike(string username)
        {

                var db = _redis.GetDatabase();
                int userId=(int) await db.StringGetAsync($"username:{username}");
                string keySlike=$"user:{userId}:slike";
                User user=new User();
                user.Fotografije=((await db.ListRangeAsync(keySlike, 0,-1)).ToStringArray()).ToList();
                return user.Fotografije;
            
           
        }

            

       
        [HttpGet]
        [Route("getUserByUserName/{username}")]
        public async Task<User> GetUsergetUserByUserName(string username)
        {

                var db = _redis.GetDatabase();
               
                int userId=(int) await db.StringGetAsync($"username:{username}");
                 string keySlike= $"user:{userId}:slike";
                string key = $"user:{userId}";
                User user=new User();
                user.Id = userId;
                user.Username = await db.HashGetAsync(key, "username");
                user.Password= await db.HashGetAsync(key, "password");
                user.isOnline= (bool)await db.HashGetAsync(key, "isOnline");
                user.Email=await db.HashGetAsync(key, "username");
                user.ProfilnaSrc=await db.HashGetAsync(key, "ProfilnaSrc");
                user.NaslovnaSrc=await db.HashGetAsync(key, "NaslovnaSrc");
                user.Fotografije=((await db.ListRangeAsync(keySlike, 0,-1)).ToStringArray()).ToList();
                return user;
            
           
        }
		
		[HttpGet]
		[Route("getUnread/{username}")]
		public async Task<IActionResult> GetUnreadNotifications(string username)
		{
			
			    var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                return BadRequest(" username is non-existing");
            }
            long userId = (long)await db.StringGetAsync($"username:{username}");
			long number=(long)await db.StringGetAsync($"user:{userId}:unreadNots");
			return Ok(number);
		}
		
		[HttpGet]
		[Route("oznaciNotifikacijeKaoProcitane/{username}")]
		public async Task<IActionResult> ReadAllNots(string username)
		{
			    var db = _redis.GetDatabase();
            if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                return BadRequest(" username is non-existing");
            }
            long userId = (long)await db.StringGetAsync($"username:{username}");
            await SetUserOnline(userId);
			await db.StringSetAsync($"user:{userId}:unreadNots","0");
			return Ok();
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
