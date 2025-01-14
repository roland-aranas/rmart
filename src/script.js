const clientId = process.env.REACT_APP_IMGUR_CLIENT_ID;

const subreddits = [
    "AVexchange",
    "Gear4Sale",
    "Knife_Swap",
    "Legomarket",
    "MouseMarket",
    "Pen_Swap",
    "SteamGameSwap",
    "WatchExchange",
    "appleswap",
    "gameswap",
    "hardwareswap",
    "letstradepedals",
    "mechmarket",
    "pkmntcgtrades",
    "snackexchange",
    "sneakermarket"
];

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
    let url;
    if (subreddit !== "all" && query === '') {
        url = `https://api.reddit.com/r/${subreddit}/new.json`;
    } else {
        url = `https://api.reddit.com/r/${subreddit}/search.json?q=${query}&restrict_sr=true&sort=new&limit=10`;
    }
    const response = await fetch(url)

    const data = await response.json();

    // Extract titles and return them as an array
    return await Promise.all(data.data.children.map(async post => {
        const imageUrl = await extractImg(post.data.selftext);
        const price = extractPrice(post.data.selftext)
        return [
            post.data.title, //0
            post.data.url, //1
            post.data.subreddit_name_prefixed, //2
            imageUrl, //3
            post.data.created, //4
            price, //5
            post.data.link_flair_text, //6
            post.data.subreddit, //7
            post.data.thumbnail //8
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
                    'Authorization':`Client-ID ${clientId}`
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
    const priceFormat = body.match(/\$\d{1,3}(,\d{3})*(\.\d{2})?/g);

    if (priceFormat){
        return priceFormat.join(', ');
    }

}