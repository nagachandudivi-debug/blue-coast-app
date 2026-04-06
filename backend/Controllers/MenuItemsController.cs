using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/menuitems")]
public class MenuItemsController : ControllerBase
{
    /// <summary>GET /api/menuitems — all menu items.</summary>
    [HttpGet]
    public ActionResult<IEnumerable<MenuItem>> GetMenuItems()
    {
        return Ok(BlueCoastSampleData.MenuItems);
    }

    /// <summary>GET /api/menuitems/category/{categoryId} — items in one category.</summary>
    [HttpGet("category/{categoryId:int}")]
    public ActionResult<IEnumerable<MenuItem>> GetByCategory(int categoryId)
    {
        var items = BlueCoastSampleData.MenuItems
            .Where(m => m.CategoryId == categoryId)
            .ToList();

        if (items.Count == 0 && BlueCoastSampleData.Categories.All(c => c.Id != categoryId))
        {
            return NotFound($"No category with id {categoryId}.");
        }

        return Ok(items);
    }
}
