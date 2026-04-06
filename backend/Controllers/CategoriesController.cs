using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    /// <summary>GET /api/categories — all menu categories.</summary>
    [HttpGet]
    public ActionResult<IEnumerable<Category>> GetCategories()
    {
        return Ok(BlueCoastSampleData.Categories);
    }
}
