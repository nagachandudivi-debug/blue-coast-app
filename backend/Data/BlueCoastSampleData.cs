using backend.Models;

namespace backend.Data;

/// <summary>
/// In-memory sample menu for Blue Coast Burrito (Mt Juliet, TN).
/// Category and item ids are stable for cart / API clients.
/// </summary>
public static class BlueCoastSampleData
{
    public static readonly List<Category> Categories =
    [
        new Category { Id = 1, Name = "Signature Burritos" },
        new Category { Id = 2, Name = "Street Tacos" },
        new Category { Id = 3, Name = "Burrito Bowls" },
        new Category { Id = 4, Name = "Drinks & Frescas" },
    ];

    public static readonly List<MenuItem> MenuItems =
    [
        new MenuItem
        {
            Id = 1,
            Name = "The Blue Coast Classic",
            Description =
                "Our flagship burrito—choice of protein, cilantro-lime rice, black beans, cheese, and house salsa in a warm flour tortilla.",
            Price = 12.99m,
            ImageUrl =
                "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
            CategoryId = 1,
        },
        new MenuItem
        {
            Id = 2,
            Name = "Double Stack Carne Burrito",
            Description =
                "Marinated steak, guacamole, charred peppers, rice, beans, and crema—rolled bold and satisfying.",
            Price = 14.50m,
            ImageUrl =
                "https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=800&q=80",
            CategoryId = 1,
        },
        new MenuItem
        {
            Id = 3,
            Name = "Baja Veggie Burrito",
            Description =
                "Grilled fajita vegetables, guacamole, whole beans, pico de gallo, and chipotle crema.",
            Price = 11.50m,
            ImageUrl =
                "https://images.unsplash.com/photo-1566740933430-b5e70e27fc53?auto=format&fit=crop&w=800&q=80",
            CategoryId = 1,
        },
        new MenuItem
        {
            Id = 4,
            Name = "Crispy Baja Fish Tacos (3)",
            Description =
                "Beer-battered white fish, cabbage slaw, chipotle crema, and fresh lime on corn tortillas.",
            Price = 11.99m,
            ImageUrl =
                "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
            CategoryId = 2,
        },
        new MenuItem
        {
            Id = 5,
            Name = "Smoky Barbacoa Tacos (3)",
            Description =
                "Slow-cooked beef, onion, cilantro, salsa roja, and a squeeze of lime.",
            Price = 12.50m,
            ImageUrl =
                "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80",
            CategoryId = 2,
        },
        new MenuItem
        {
            Id = 6,
            Name = "Citrus Pollo Street Tacos (3)",
            Description =
                "Citrus-marinated chicken, pickled onion, cotija, crema, and cilantro.",
            Price = 10.99m,
            ImageUrl =
                "https://images.unsplash.com/photo-1565299585323-38174c0c5e70?auto=format&fit=crop&w=800&q=80",
            CategoryId = 2,
        },
        new MenuItem
        {
            Id = 7,
            Name = "Big Blue Burrito Bowl",
            Description =
                "Everything you love in a burrito, served bowl-style with greens or rice as the base.",
            Price = 13.25m,
            ImageUrl =
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
            CategoryId = 3,
        },
        new MenuItem
        {
            Id = 8,
            Name = "Cilantro-Lime Pollo Bowl",
            Description =
                "Grilled chicken, cilantro-lime rice, black beans, corn salsa, and avocado.",
            Price = 12.75m,
            ImageUrl =
                "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
            CategoryId = 3,
        },
        new MenuItem
        {
            Id = 9,
            Name = "Ensenada Shrimp Bowl",
            Description =
                "Seasoned shrimp, Mexican rice, black beans, cucumber, cabbage, and creamy chipotle drizzle.",
            Price = 15.99m,
            ImageUrl =
                "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
            CategoryId = 3,
        },
        new MenuItem
        {
            Id = 10,
            Name = "House Horchata",
            Description = "Cinnamon rice milk, chilled and lightly sweet.",
            Price = 3.50m,
            ImageUrl =
                "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
            CategoryId = 4,
        },
        new MenuItem
        {
            Id = 11,
            Name = "Sandía Agua Fresca",
            Description = "Fresh watermelon agua fresca—light, cool, and made in-house.",
            Price = 4.25m,
            ImageUrl =
                "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
            CategoryId = 4,
        },
        new MenuItem
        {
            Id = 12,
            Name = "Mexican Coke",
            Description = "Classic cane-sugar cola in a glass bottle.",
            Price = 3.25m,
            ImageUrl =
                "https://images.unsplash.com/photo-1622483767028-3f66f296a5a6?auto=format&fit=crop&w=800&q=80",
            CategoryId = 4,
        },
    ];
}
