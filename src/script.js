const subreddits = ["hardwareswap", "gameswap", "SteamGameSwap","mechmarket","MouseMarket","WatchExchange"];

export async function checkClickAll(option,query){
    if (option === "all"){
        const data = await Promise.all(subreddits.map((subreddit) => fetchTitles(subreddit,query)));
        return data.flat();
    }else{
        const data = await fetchTitles(option,query)
        return data;
    }
}

async function fetchTitles(subreddit, query) {
    const url = `http://api.reddit.com/r/${subreddit}/search.json?q=${query}&restrict_sr=true&sort=new&flair_name=SELLING`;
    const response = await fetch(url)

    const data = await response.json();

    // Extract titles and return them as an array
    return await Promise.all(data.data.children.map(async post => {
        const imageUrl = await extractImg(post.data.selftext);
        const price = extractPrice(post.data.selftext)
        return [
            post.data.title,
            post.data.url,
            post.data.subreddit_name_prefixed,
            imageUrl,
            post.data.created,
            price,
            post.data.link_flair_text,
            post.data.subreddit,
            post.data.thumbnail
        ]}));
}

async function extractImg(body){
    const linkFormat = body.match(/https:\/\/imgur\.com\/(?:a\/)?[a-zA-Z0-9_-]+/);

    if (linkFormat){
        const imgurPost = linkFormat[0].split('/').pop();
        const imgurPostId = imgurPost.split('-').pop()
        try{
            const response = await fetch(`https://api.imgur.com/3/album/${imgurPostId}`, {
                headers:{
                    'Authorization':'Client-ID de677a381b7f9fb'
                }
            });
            const data = await response.json();
            if (data.success && data.data.images.length > 0){
                return [data.data.images[0].link,data.data.images[0].type]
            }
        } catch (error) {
            console.error('Error',error)
            return ["Error","Error"];
        }
    }
    return ["Error","Error"]
}

function extractPrice(body){
    const priceFormat = body.match(/\$\d+(\.\d{2})?/g);

    if (priceFormat){
        return priceFormat.join(', ');
    }

}