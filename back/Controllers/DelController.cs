using back.entities;
using backend.dtos;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;

using Newtonsoft.Json;

using System;
using StackExchange.Redis;

namespace back
{

    [Route("api/[controller]")]
    [ApiController]
    public class DelController : ControllerBase
    {
        private readonly IDriver _driver;


        private readonly IConnectionMultiplexer _redis;


        public DelController(IConnectionMultiplexer redis)
        {
            _driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _redis = redis;




        }

        [HttpDelete]
        [Route("deletePhoto/{username}")]
        public async Task<IActionResult> DeletePhoto(string username, [FromBody]string src)
        {
            var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                return BadRequest(" username is non-existing");
            }

            int userId = (int)await db.StringGetAsync($"username:{username}");
            string slikeKey = $"user:{userId}:slike";
            await db.ListRemoveAsync(slikeKey, src,1);
            return Ok();
        }

        


        private async Task DeleteComment(long commentId,ITransaction db)
        {
           // var db = _redis.GetDatabase();
            string komentarKey = $"komentar:{commentId}";
            if (!await db.KeyExistsAsync(komentarKey))
                throw new Exception("Komentar ne postoji");

            long objavaId = (long)await db.HashGetAsync(komentarKey, "objavaId");
            //uklanjanje komentara
            await db.HashDeleteAsync(komentarKey, new RedisValue[]
            {
                "text",
                "date",
                "autorId",
                "authorUsername",
                 "authorSrc",
                 "objavaId"
            });
            //uklanjanje komentara iz objave
            string komentariKey = $"objava:{objavaId}:komentari";
            await db.ListRemoveAsync(komentariKey, commentId);
            //brisanje lajkova komentara
            string lajkoviKey = $"komentar:{commentId}:lajkovi";
            await db.ListTrimAsync(lajkoviKey, 99, 0);




        }

        [HttpDelete]
        [Route("deleteUser/{username}")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            try
            {
                bool rez=await DeleteUserFromRedis(username);
                if (!rez)
                    return BadRequest();
                await DeleteUserFromNeo4j(username);
                return Ok();

            }
            catch(Exception e)
            {
                return BadRequest();
            }
        }

        private async Task DeleteUserFromNeo4j(string username)
        {
            //brisanje korisnika iz neo4j baze
            var statementText = new StringBuilder();
            statementText.Append($"MATCH (n:User {{username:$username}}) DETACH DELETE n");
            var statementParameters = new Dictionary<string, object>
        {
            {"username", username }


        };
            var session = this._driver.AsyncSession();
            var result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
        }

        private async Task<bool> DeleteUserFromRedis(string username)
        {
            var db = _redis.GetDatabase();
            var transaction = db.CreateTransaction();

            if (await transaction.KeyExistsAsync($"username:{username}") == false)
            {
                throw new Exception(" usernam is non-existing");
            }

            int userId = (int)await db.StringGetAsync($"username:{username}");
            await DeleteObjaveKorisnika(username,transaction);
            await DeleteUserConversations(username,transaction);
            await DeleteNotifications(username,transaction);
            await DeleteUserPhotos(username, transaction);
            var followers = await transaction.SetMembersAsync($"user:{userId}:followers");
            var following = await transaction.SetMembersAsync($"user:{userId}:following");
            foreach(var follower in followers)
            {
                string followerId = (string)follower;
                await transaction.SetRemoveAsync($"user:{followerId}:following",userId);
            }
            foreach (var follow in following)
            {
                string followId = (string)follow;
                await transaction.SetRemoveAsync($"user:{followId}:followers", userId);
            }
            await transaction.HashDeleteAsync($"user:{userId}", new RedisValue[]
            {
                "username",
                "password",
                "email",
                "lastSeen",
                "ProfilnaSrc",
                "naslovnaSrc"
            });
            await transaction.KeyDeleteAsync($"username:{username}");
            var rez=await transaction.ExecuteAsync();
            return rez;
        }
        private async Task DeleteObjaveKorisnika(string username,ITransaction db)
        {
            //var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                throw new Exception(" usernam is non-existing");
            }

            int userId = (int)await db.StringGetAsync($"username:{username}");
            var objaveIds = await db.ListRangeAsync($"user:{userId}:objave", 0, -1);
            foreach(var objavaId in objaveIds)
            {
                await DeleteObjava((long)objavaId,db);
            }
        }

        private async Task DeleteObjava(long objavaId, ITransaction db)
        {
            //var db = _redis.GetDatabase();
            string objavaKey = $"objava:{objavaId}";
            if (!await db.KeyExistsAsync(objavaKey))
                throw new Exception("Objava ne postoji");

            long autorId = (long)await db.HashGetAsync(objavaKey, "author");
            //brisanje objave
            await db.HashDeleteAsync(objavaKey, new RedisValue[]
           {
               "id",
               "author",
               "date",
               "text",
               "slikaSrc",
               "authorUsername",
               "authorSrc"
                
           });
            //brisanje komentara objave
            var commentsId = await db.ListRangeAsync($"objava:{objavaId}:komentari", 0, -1);
            foreach(var commId in commentsId)
            {
                long comentId = (long)commId;
                await DeleteComment(comentId,db);
            }
            //brisanje lajkova objave
            string lajkoviKey = $"objava:{objavaId}:lajkovi";
            await db.ListTrimAsync(lajkoviKey, 99, 0);
            //brisanje id-ja objave iz liste objava autora
            await db.ListRemoveAsync($"user:{autorId}:objave", objavaId);
            //brisanje objave sa zidova pratioca autora
            var pratioci = await db.SetMembersAsync($"user:{autorId}:followers");
            foreach(var pratilacId in pratioci)
            {
                await db.ListRemoveAsync($"user:{pratilacId}:wall", objavaId);
            }
        }
        private async Task DeleteUserConversations(string username,ITransaction db)
        {
           // var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                throw new Exception(" usernam is non-existing");
            }

            int userId = (int)await db.StringGetAsync($"username:{username}");
           
            var roomsIds = await db.ListRangeAsync($"user:{userId}:rooms", 0, -1);
            foreach (var roomId in roomsIds)
            {
                await db.ListTrimAsync((string)roomId, 99, 0);
                string room = (string)roomId;
                string id1 = room.Substring(room.IndexOf(':'), room.LastIndexOf(':')-room.IndexOf(':'));
                string id2 = room.Substring(room.LastIndexOf(':'));
                await db.SetRemoveAsync($"user:{id1}:rooms", room);
                await db.SetRemoveAsync($"user:{id2}:rooms", room);

            }

        }
        private async Task DeleteConversation(string user1,string user2,ITransaction db)
        {
           // var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync($"username:{user1}") == false || await db.KeyExistsAsync($"username:{user2}") == false)
            {
                throw new Exception("Some usernames are non-existing");
            }

            int id1 = (int)await db.StringGetAsync($"username:{user1}");
            int id2 = (int)await db.StringGetAsync($"username:{user2}");
            int idFirst = id1 < id2 ? id1 : id2;
            int idSecond = id1 > id2 ? id1 : id2;
            string roomKey = $"room:{idFirst}:{idSecond}";
            await db.ListTrimAsync(roomKey, 99, 0);//kada je startIndex>endIndex brise se cela lista
            await db.SetRemoveAsync($"user:{id1}:rooms", roomKey);
            await db.SetRemoveAsync($"user:{id2}:rooms", roomKey);
        }

        private async Task DeleteNotifications(string username,ITransaction db)
        {
            //var db = _redis.GetDatabase();

            if (await db.KeyExistsAsync($"username:{username}") == false )
            {
                throw new Exception(" usernam is non-existing");
            }

            int userId = (int)await db.StringGetAsync($"username:{username}");
            string notifikactionsKey = $"user:{userId}:notifications";
            await db.ListTrimAsync(notifikactionsKey, 99, 0);
        }

        private async Task DeleteUserPhotos(string username,ITransaction db)
        {

           

            if (await db.KeyExistsAsync($"username:{username}") == false)
            {
                throw new Exception(" username is non-existing");
            }

            int userId = (int)await db.StringGetAsync($"username:{username}");
            string slikeKey = $"user:{userId}:slike";
            await db.ListTrimAsync(slikeKey, 99, 0);
        }

       
    }
}