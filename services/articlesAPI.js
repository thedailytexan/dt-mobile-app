const BASE_URL = "https://thedailytexan.com/wp-json/wp/v2";

export async function searchArticles({
  query = "",
  categoryId = null,
  order = "desc",
  page = 1,
  perPage = 20,
}) {
  try {
    let url = `${BASE_URL}/posts?_embed=1&orderby=date&order=${order}&per_page=${perPage}&page=${page}`;

    if (query) {
      url += `&search=${encodeURIComponent(query)}`;
    }
    if (categoryId) {
      url += `&categories=${categoryId}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }

    const data = await response.json();

    return data.map((post) => {
      let authorName = "Unknown Author";
      let categoryName = "";

      if (post._embedded && post._embedded["wp:term"]) {
        for (const terms of post._embedded["wp:term"]) {
          const staffTerm = terms.find((t) => t.taxonomy === "staff_name");
          if (staffTerm) authorName = staffTerm.name;

          const categoryTerm = terms.find((t) => t.taxonomy === "category");
          if (categoryTerm && !categoryName) categoryName = categoryTerm.name;
        }
      }

      const dateObj = new Date(post.date);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const metaText = [authorName, categoryName, formattedDate]
        .filter(Boolean)
        .join(" | ");

      return {
        id: post.id,
        title: post.title?.rendered ?? "",
        excerpt: post.excerpt?.rendered ?? "",
        mediaId: post.featured_media ?? 0,
        metaText,
      };
    });

  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}