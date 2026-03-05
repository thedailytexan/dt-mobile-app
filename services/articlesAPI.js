const BASE_URL = "https://thedailytexan.com/wp-json/wp/v2";

export async function searchArticles({
  query = "",
  categoryId = null,
  order = "desc",
  page = 1,
  perPage = 20,
}) {
  try {
    let url = `${BASE_URL}/posts?_embed&orderby=date&order=${order}&per_page=${perPage}&page=${page}`;

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

    // transform wordpress response into clean format
    return data.map(post => ({
      id: post.id,
      title: post.title?.rendered ?? "",
      excerpt: post.excerpt?.rendered ?? "",
      content: post.content?.rendered ?? "",
      date: post.date,
      imageUrl:
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
      categories: post.categories ?? [],
    }));

  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}