import { mutation } from "./_generated/server";

const MOCK_REVIEWS = [
  // Product 1: Nike Air Max 90
  { productId: 1, userName: "Alex M.", userEmail: "alex@example.com", rating: 5, comment: "Fit perfectly right out of the box. The cushioning is surprisingly good for an all-day shoe." },
  { productId: 1, userName: "Priya S.", userEmail: "priya@example.com", rating: 5, comment: "Got the white pair. They go with literally everything. My third pair of Air Max 90s now." },
  { productId: 1, userName: "James K.", userEmail: "james@example.com", rating: 4, comment: "Solid shoe. Runs slightly narrow — I'd go half size up if you have wide feet." },
  { productId: 1, userName: "Nina L.", userEmail: "nina@example.com", rating: 5, comment: "The colorway in person is even better than the photos. Super comfortable for walking around the city." },
  { productId: 1, userName: "Marco D.", userEmail: "marco@example.com", rating: 4, comment: "Good quality, fast shipping. Sole is a bit stiff at first but breaks in nicely after a week." },

  // Product 2: Adidas Ultraboost
  { productId: 2, userName: "Sarah W.", userEmail: "sarah@example.com", rating: 5, comment: "Hands down the most comfortable running shoe I've ever owned. Did a half marathon in these." },
  { productId: 2, userName: "Ravi P.", userEmail: "ravi@example.com", rating: 5, comment: "The Boost midsole is unreal. I'm on my feet 12 hours a day and these save my knees." },
  { productId: 2, userName: "Emma T.", userEmail: "emma@example.com", rating: 4, comment: "Great shoe but the knit upper picks up dirt easily. Keep them clean and they're 10/10." },
  { productId: 2, userName: "Chris B.", userEmail: "chris@example.com", rating: 5, comment: "Ultraboost lives up to the hype. Went from Nike and I'm not looking back." },

  // Product 3: New Balance 550
  { productId: 3, userName: "Jordan F.", userEmail: "jordan@example.com", rating: 5, comment: "Clean retro look. I get compliments every time I wear these. The leather quality is impressive for the price." },
  { productId: 3, userName: "Mia R.", userEmail: "mia@example.com", rating: 5, comment: "Perfect everyday sneaker. Not too chunky, not too slim. Just right." },
  { productId: 3, userName: "Aditya G.", userEmail: "aditya@example.com", rating: 4, comment: "Took about a week to break in but once they did, they're incredibly comfortable." },
  { productId: 3, userName: "Kate H.", userEmail: "kate@example.com", rating: 5, comment: "The 550 is what every lifestyle shoe should be — simple, well-built, and versatile." },
  { productId: 3, userName: "Leo N.", userEmail: "leo@example.com", rating: 5, comment: "Finally a shoe that looks as good with jeans as it does with shorts. Bought two pairs." },

  // Product 4: Nike Dunk Low
  { productId: 4, userName: "Tyler J.", userEmail: "tyler@example.com", rating: 5, comment: "The Dunk Low never misses. Leather is buttery soft and the fit is spot on." },
  { productId: 4, userName: "Sana A.", userEmail: "sana@example.com", rating: 4, comment: "Gorgeous shoe. My only complaint is I wish there were more colorways available." },
  { productId: 4, userName: "Devon L.", userEmail: "devon@example.com", rating: 4, comment: "Good for casual wear but not great for long walks. Still love the way they look." },
  { productId: 4, userName: "Olivia C.", userEmail: "olivia@example.com", rating: 5, comment: "Classic silhouette. Wore these to a wedding (smart casual) and got nothing but compliments." },

  // Product 5: Adidas Yeezy Boost
  { productId: 5, userName: "Marcus W.", userEmail: "marcus@example.com", rating: 5, comment: "The primeknit upper hugs your foot in the best way. Most unique shoe I own." },
  { productId: 5, userName: "Ananya K.", userEmail: "ananya@example.com", rating: 4, comment: "Comfortable and eye-catching. Price is steep but you definitely feel the quality." },
  { productId: 5, userName: "Jason R.", userEmail: "jason@example.com", rating: 4, comment: "Sizing is tricky — go half size up. Once you get the right fit, they're incredible." },
  { productId: 5, userName: "Zoe M.", userEmail: "zoe@example.com", rating: 5, comment: "Worth every penny. The Boost sole makes them way more comfortable than they look." },

  // Product 6: New Balance 990v5
  { productId: 6, userName: "David H.", userEmail: "david@example.com", rating: 5, comment: "The dad shoe that actually performs. I run in these, walk in these, do everything in these." },
  { productId: 6, userName: "Lakshmi V.", userEmail: "lakshmi@example.com", rating: 5, comment: "Best running shoe I've tried from NB. The support is incredible for my flat feet." },
  { productId: 6, userName: "Ryan C.", userEmail: "ryan@example.com", rating: 5, comment: "Made in USA quality is noticeable. Stitching and materials are top tier." },
  { productId: 6, userName: "Amy T.", userEmail: "amy@example.com", rating: 4, comment: "A bit heavy compared to other runners but the cushioning and support make up for it." },
  { productId: 6, userName: "Sam B.", userEmail: "sam@example.com", rating: 5, comment: "Third pair of 990s. They last forever and just keep getting more comfortable." },
];

export const seedReviews = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if reviews already exist
    const existing = await ctx.db.query("reviews").first();
    if (existing) {
      return { status: "Reviews already seeded", count: 0 };
    }

    let count = 0;
    for (const review of MOCK_REVIEWS) {
      await ctx.db.insert("reviews", {
        ...review,
        createdAt: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // random date within last 30 days
      });
      count++;
    }
    return { status: "Seeded successfully", count };
  },
});
