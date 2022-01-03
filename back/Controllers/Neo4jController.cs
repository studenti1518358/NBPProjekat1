using backend.dtos;
using Microsoft.AspNetCore.Mvc;
using Neo4j.Driver;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
//samo proba za neo4j,nista znacajno
namespace back
{

    [Route("api/[controller]")]
    [ApiController]
    public class Neo4jController:ControllerBase
    {
        private readonly IDriver _driver;

        public Neo4jController()
        {
            _driver = GraphDatabase.Driver("bolt://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserDto user)
        {
            var statementText = new StringBuilder();
            statementText.Append("CREATE (user:User {username: $username,password:$password})");
            var statementParameters = new Dictionary<string, object>
        {
            {"username", user.Username },
            {"password",user.Password }
        };
            var session = this._driver.AsyncSession();
            var result = await session.WriteTransactionAsync(tx => tx.RunAsync(statementText.ToString(), statementParameters));
            return Ok("New user successfully added to database");
        }

    }
}