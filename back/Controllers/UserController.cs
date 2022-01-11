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
    public class UserController:ControllerBase
    {
        private readonly IDriver _driver;
       

        private readonly IConnectionMultiplexer _redis;
        public UserController(IConnectionMultiplexer redis)
        {
            _driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _redis = redis;

          
        }

       

        [HttpGet]
        public async Task<IActionResult> GetUser(string username)
        {
            var db = _redis.GetDatabase();
            //
            ISubscriber subb = _redis.GetSubscriber();
            await subb.SubscribeAsync($"channel:{username}", async (channel, message) =>
            {
                await db.StringSetAsync($"neo4juser:{username}", message);

            });
            //
            if (await db.KeyExistsAsync($"neo4juser:{username}"))
            {
                var user = JsonConvert.DeserializeObject<UserWithRelationships>(await db.StringGetAsync($"neo4juser:{username}"));
              
                return Ok(user);
            }
            else
            {
                var statementText = new StringBuilder();
                statementText.Append($"MATCH (t:Osobina)<-[:TRAZIM]-(n:User)-[:INTERESUJEME | POSEDUJE]->(i:Osobina) WHERE n.username=$username" +
    $" WITH properties(i) as ii,n,properties(t) as tt RETURN {{user:properties(n),osobine:collect(distinct ii),pozeljneOsobine:collect(distinct tt)}}");
                var statementParameters = new Dictionary<string, object>
        {
            {"username", username }


        };
                var session = this._driver.AsyncSession();

                var result = await session.ReadTransactionAsync(async tx =>
                {
                    var result = tx.RunAsync(statementText.ToString(), statementParameters);

                    var rez = await result;
                    var record = await rez.SingleAsync();
                    return JsonConvert.SerializeObject(record[0]);
                    //return record[0];

                });
                Console.WriteLine(result.ToString());
                var user=JsonConvert.DeserializeObject<UserWithRelationships>(result);

                await db.StringSetAsync($"neo4juser:{username}", result);
                ISubscriber sub = _redis.GetSubscriber();
                await sub.SubscribeAsync($"channel:{username}", async (channel, message) =>
                {
                    await db.StringSetAsync($"neo4juser:{username}", message);

                });
                return Ok(user);
                //return Ok(result);
            }
            
        }
		[HttpGet]
		[Route("all users")]
		public async Task<IActionResult> getAllUsers()
		{
			 var statementText = new StringBuilder();
		statementText.Append($"MATCH (n:User) return properties(n)");
        
            var session = this._driver.AsyncSession();

            var result = await session.ReadTransactionAsync(async tx => {
                var result = tx.RunAsync(statementText.ToString());

                var rez = await result;
                var records = await rez.ToListAsync();
                //return JsonConvert.SerializeObject(record[0]);
                return records.Select(x=>JsonConvert.SerializeObject(x[0]));

            });
            Console.WriteLine(result.ToString());
            var users = result.Select(x => JsonConvert.DeserializeObject<Neo4jUser>(x)).ToList();
            var db = _redis.GetDatabase();
            users.ForEach(async user =>
            {
                user.ProfilnaSrc = await db.HashGetAsync($"user:{user.Id}", "ProfilnaSrc");
                Console.WriteLine(user.ProfilnaSrc);
                Console.WriteLine($"user:{user.Id}");
            });
            // return Ok(JsonConvert.DeserializeObject<Neo4jUser>(result));
           // Console.WriteLine()
           users.ForEach(user=> { Console.WriteLine(user.ProfilnaSrc); Console.WriteLine(user.Id); });
            return Ok(users);

		}

        [HttpGet]
        [Route("matches")]
        public async Task<IActionResult> nadjiPartnera(string username)
        {
            var statementText = new StringBuilder();
            statementText.Append($"MATCH (n:User {{username:$username}}) WITH  n  MATCH (n:User)-[:INTERESUJEME | TRAZIM | ZIVIM]->(i)<-[:INTERESUJEME | POSEDUJE | ZIVIM]-(m:User) WHERE m.username<>$username WITH distinct m, count(i) as x RETURN properties(m) ORDER by x desc");
            var statementParameters = new Dictionary<string, object>
        {
            {"username", username }


        };
            var session = this._driver.AsyncSession();

            var result = await session.ReadTransactionAsync(async tx => {
                var result = tx.RunAsync(statementText.ToString(), statementParameters);

                var rez = await result;
                var records = await rez.ToListAsync();
                //return JsonConvert.SerializeObject(record[0]);
                return records.Select(x=>JsonConvert.SerializeObject(x[0]));

            });
            Console.WriteLine(result.ToString());
            var users = result.Select(x => JsonConvert.DeserializeObject<Neo4jUser>(x)).ToList();
            var db = _redis.GetDatabase();
            users.ForEach(async user =>
            {
                user.ProfilnaSrc = await db.HashGetAsync($"user:{user.Id}", "ProfilnaSrc");
                Console.WriteLine(user.ProfilnaSrc);
                Console.WriteLine($"user:{user.Id}");
            });
            // return Ok(JsonConvert.DeserializeObject<Neo4jUser>(result));
           // Console.WriteLine()
           users.ForEach(user=> { Console.WriteLine(user.ProfilnaSrc); Console.WriteLine(user.Id); });
            return Ok(users);


        }

        [HttpPost]
        [Route("updateUser/{username}")]
        public async Task<IActionResult> UpdateUser(string username,UserWithRelationships user)
        {
            var db =  _redis.GetDatabase();
            if (!await db.KeyExistsAsync($"username:{username}"))
                return BadRequest("User doesnt exist");
            try
            {
                await UpdateNeo4jUser(username, user);
                await UpdateRedisUser(user);
                ISubscriber sub = _redis.GetSubscriber();
                string pubKey = $"channel:{username}";
                await sub.PublishAsync(pubKey, JsonConvert.SerializeObject(user));
                return Ok("User successfully updated");

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private async Task<bool> UpdateRedisUser(UserWithRelationships user)
        {
            var db = _redis.GetDatabase();
            string usernameKey = $"username:{user.User.Username}";
            // string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
            if (!await db.KeyExistsAsync(usernameKey))
            {
                throw new Exception("User doesn't exist");
            }
            //var nextId = await db.StringIncrementAsync("total_users");
            string userKey = $"user:{user.User.Id}";
            //await db.StringSetAsync(usernameKey, id);
            await db.HashSetAsync(userKey, new HashEntry[]
            {
                     new HashEntry("username",user.User.Username),
                     new HashEntry("password",user.User.Password),
                     new HashEntry("email",user.User.Email),
                     new HashEntry("isOnline",true)
            });
            return true;
        }

        
        private async Task UpdateNeo4jUser(string username, UserWithRelationships user)
        {

            var statementText = new StringBuilder();
            statementText.Append($"MATCH (n:User {{username:$username}}) DETACH DELETE n");
            var statementParameters = new Dictionary<string, object>
        {
            {"username", username }


        };
            var session = this._driver.AsyncSession();
            var result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));

            statementText = new StringBuilder();
            statementText.Append("CREATE (user:User {username: $username,password:$password,id:$id,email:$email,ime:$ime,prezime:$prezime,godine:$godine,mesto:$mesto,bracniStatus:$bracniStatus,zanimanje:$zanimanje,pol:$pol,godineOd:$godineOd,godineDo:$godineDo,polPartnera:$polPartnera})");
            statementParameters = new Dictionary<string, object>
        {
            {"username", user.User.Username },
            {"password",user.User.Password },
             {"id",user.User.Id },
             {"email",user.User.Email },
                {"ime",user.User.Ime },
                {"prezime",user.User.Prezime },
                {"godine",user.User.Godine },
                {"mesto",user.User.Mesto },
                {"bracniStatus",user.User.BracniStatus },
                {"zanimanje",user.User.Zanimanje },
                {"pol",user.User.Pol},
                {"godineOd",user.User.GodineOd },
                {"godineDo",user.User.GodineDo },
                {"polPartnera",user.User.PolPartnera }

        };
             session = this._driver.AsyncSession();
            result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));

            user.Osobine.ForEach(async osobina =>
            {
               
                    statementText = new StringBuilder();
                    statementText.Append($"MERGE (atribut:Osobina {{name:$name,value:$value}})");
                    statementParameters = new Dictionary<string, object>
                {
                    { "value",osobina.Value },
                    {"name",osobina.Name}
                };
                    session = this._driver.AsyncSession();
                    result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
                string veza = (osobina.Name == "BojaOciju" || osobina.Name == "BojaKose" || osobina.Name == "Visina" || osobina.Name == "Tezina")?"POSEDUJE"   : "INTERESUJEME";
                    statementText = new StringBuilder();
                    statementText.Append($"MATCH (a: User), (b:Osobina) WHERE a.username = $username AND b.value = $value AND b.name=$name CREATE(a) -[r: {veza}]->(b) RETURN type(r)");
                    statementParameters = new Dictionary<string, object>
                {
                    { "username",username },
                    { "value",osobina.Value },
                      {"name",osobina.Name}

                };
                    session = this._driver.AsyncSession();
                    result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
                


            });

            user.PozeljneOsobine.ForEach(async osobina =>
            {

                statementText = new StringBuilder();
                statementText.Append($"MERGE (atribut:Osobina {{name:$name,value:$value}})");
                statementParameters = new Dictionary<string, object>
                {
                    { "value",osobina.Value },
                    {"name",osobina.Name}
                };
                session = this._driver.AsyncSession();
                result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
                //string veza = (osobina.Name == "BojaOciju" || osobina.Name == "BojaKose" || osobina.Name == "Visina" || osobina.Name == "Tezina") ? "POSEDUJE" : "INTERESUJEME";
                statementText = new StringBuilder();
                statementText.Append($"MATCH (a: User), (b:Osobina) WHERE a.username = $username AND b.value = $value AND b.name=$name CREATE(a) -[r: TRAZIM]->(b) RETURN type(r)");
                statementParameters = new Dictionary<string, object>
                {
                    { "username",username },
                    { "value",osobina.Value },
                      {"name",osobina.Name}

                };
                session = this._driver.AsyncSession();
                result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));



            });

          
                statementText = new StringBuilder();
                statementText.Append($"MERGE (atribut:Osobina {{value:$value,name:$name}})");
                statementParameters = new Dictionary<string, object>
                {
                    { "value",user.User.Mesto },
                    {"name","mesto" }

                };
                session = this._driver.AsyncSession();
                result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));

                statementText = new StringBuilder();
                statementText.Append($"MATCH (a: User), (b:Osobina) WHERE a.username = $username AND b.value = $value AND b.name=$name  CREATE(a) -[r: ZIVIM]->(b) RETURN type(r)");
                statementParameters = new Dictionary<string, object>
                {
                    { "username",username },
                    { "value",user.User.Mesto },
                    {"name","mesto"}

                };
                session = this._driver.AsyncSession();
                result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
            


        }


    }
}