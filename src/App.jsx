import React, { useEffect } from 'react';
import Card from './Card.jsx';
import { checkClickAll }  from './script.js';
import { FaSearch } from 'react-icons/fa';
import { FaReddit } from "react-icons/fa6";
import { ReactComponent as Truck } from "./icons/shipping-fast.svg";
import { ReactComponent as Paypal } from "./icons/paypal.svg";
import { ReactComponent as Shield } from "./icons/shield.svg";
import WhyCards from './whyCards.jsx';

const App = () => {
    const [data,setData] = React.useState([[[],[],[],[[],[]],[]]]);
    const [query,setQuery] = React.useState('');
    const [option,setOptionSub] = React.useState('all');
    const [showCard,setCard] = React.useState(false);
    const [optionBuySell, setOptionBuySell] = React.useState('buy');
    const [showLoader,setShowLoader] = React.useState(false);
    const [showSearch,setShowSearch] = React.useState(false);
    const [showWelcome,setShowWelcome] = React.useState(true);
    const [showDisclaimer, setShowDisclaimer] = React.useState(true);
    const [showError, setShowError] = React.useState(false);

  useEffect(() => {
    async function fetchData(){
        try{
            const result = await checkClickAll(option,query);
            if (result.length === 0){
                setShowError(true);
            }else{
                setData(result || []);
                setShowError(false);
            }
        }catch (error){
            console.error('Fetch error:', error);
            setShowError(true);
        }
    }
        fetchData();
        }, [option,query]);


    const handleSearch = async(event) => {
        if (event.key === 'Enter' || event.type === 'click'){
            let searchQuery = document.getElementById('search').value;
            if (searchQuery === ''){
                searchQuery = document.getElementById('titleInput').value;
            }
            setShowLoader(true);
            setCard(false);
            setQuery(searchQuery);
            setShowSearch(true);
            setShowWelcome(false);
            setShowDisclaimer(false);

            await new Promise((resolve) => setTimeout(resolve,2000));

            setShowLoader(false);
            setShowDisclaimer(true);
            setCard(true);
        }
    };

    const handleCategorySearch = async (subreddit) => {
        setShowLoader(true);
        setCard(false);
        setOptionSub(subreddit);
        setShowSearch(true);
        setShowWelcome(false);
    
        await new Promise((resolve) => setTimeout(resolve, 1000));
    
        let sub = document.getElementById('subredditsSelect');
        sub.value = subreddit;
        setShowLoader(false);
        setCard(true);
    };

    const filterData = (data,optionBuySell) => {
        const filteredData = data.filter((element) => {
            if ((element[6] === 'BUYING' || element[6] === 'CLOSED' || element[6] === 'Buying' || element[6] === 'WTB' || element[0].includes('WTB')  || element[6] === 'WTB-OPEN') && optionBuySell === 'buy'){
                return false;
            }else if ((element[6] === 'SELLING'|| element[6] === 'CLOSED' || element[6] === 'Selling' || element[6] === 'Artisan' || element[6] === 'WTS' || element[0].includes('WTB') || element[6] === 'WTS-OPEN') && optionBuySell === 'sell'){
                return false;
            } else if(element[4] === null || element[4] === undefined){
                return false;
            }else{
            return true;
            }
        });
        console.log('Filtered Data: ', sortData(filteredData));
        return filteredData;
    };

    const totopFunction = () => {
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        });
    };

    const sortData = (filteredData) => {
        let sortedData = filteredData.sort((a,b) => b[4]-a[4])
        return sortedData;
    };
    

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

    return (

        <div className="searchPage">
            <div className="searchContainer">
                <h1 className="searchTitle"><a href="https://roland-aranas.github.io/rmart/">R-Mart&nbsp;<FaReddit/></a></h1>
                <input className="searchInput" type="text" id="search" name="input" placeholder="Search items..." onKeyDown={handleSearch}/>
                <button className="searchButton" id="searchButton" onClick={handleSearch}><FaSearch/></button>
            </div>



            <hr className="searchBreak"></hr>

            {showSearch &&
                <div className = "chooseSub">
                    <h2 className="searchResultsTitle">Search Results</h2>
                    <select className="subredditsList" name="subreddits" id="subredditsSelect" onChange={(e) => setOptionSub(e.target.value)}>
                        <option value="all">all subreddits</option>
                        {subreddits.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                    <select name="buySell" id="buySell" onChange={(e) => setOptionBuySell(e.target.value)}>
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                            <option value="buy&sell">Buy/Sell</option>
                        </select>
                </div>
            }
            
            {showWelcome &&
                <div className="welcomeSection">
                    <div className="titleBox">
                        <h1 className="welcome">Welcome to Reddit Mart</h1>
                        <h2 style={{color:'#eeeeee',textAlign:'center', position:'relative'}}>Discover unique items from reddit marketplace communities</h2>
                        <input className="titleInput" id='titleInput' placeholder="What are you looking for?" onKeyDown={handleSearch}></input>
                        <button className="titleSearchButton" onClick={handleSearch}><FaSearch/>&nbsp;Search</button>
                    </div>
                    <div className="popularCategories">
                        <h1 className="popularTitle">Popular Items</h1>
                        <div className="popularCategoriesContainer">
                            <button onClick={() => handleCategorySearch('appleswap')}>Apple Electronics</button>
                            <button onClick={() => handleCategorySearch('AVexchange')}>Headphones</button>
                            <button onClick={() => handleCategorySearch('gameswap')}>Video Games</button>
                            <button onClick={() => handleCategorySearch('hardwareswap')}>Electronics</button>
                            <button onClick={() => handleCategorySearch('mechmarket')}>Keyboards</button>
                            <button onClick={() => handleCategorySearch('MouseMarket')}>Mice</button>
                            <button onClick={() => handleCategorySearch('sneakermarket')}>Sneakers</button>
                            <button onClick={() => handleCategorySearch('SteamGameSwap')}>Steam Games</button>
                            <button onClick={() => handleCategorySearch('WatchExchange')}>Watches</button>
                            <button onClick={() => handleCategorySearch('Pen_Swap')}>Pens</button>
                            <button onClick={() => handleCategorySearch('letstradepedals')}>Guitar Pedals</button>
                            <button onClick={() => handleCategorySearch('Gear4Sale')}>Music Instruments and Gear</button>
                            <button onClick={() => handleCategorySearch('pkmntcgtrades')}>Pokemon Cards</button>
                            <button onClick={() => handleCategorySearch('snackexchange')}>Snacks & Foods</button>
                            <button onClick={() => handleCategorySearch('Knife_Swap')}>Knives</button>
                        </div>
                    </div>
                    <div className="why">
                        <h1 className="whyTitleMain">Why Choose Reddit Mart?</h1>
                        <div className="whyContainer">
                            <WhyCards className="whyDirect" title="Direct From Redditors" paragraph="Buy directly from Reddit users in various communities, ensuring unique and diverse offerings." icon={<Truck/>} iconName='Truck'></WhyCards>
                            <WhyCards className="whyDirect" title="Secure Transactions" paragraph="Communities ensure safe and secure transactions between buyers and sellers through paypal." icon={<Paypal/>} iconName='payPal'></WhyCards>
                            <WhyCards className="whyDirect" title="Community Verified" paragraph="Buy directly from Reddit users in various communities, ensuring unique and diverse offerings." icon={<Shield/>} iconName='Shield'></WhyCards>
                        </div>
                    </div>
                    <div className="ready">
                        <h1 className="readyTitle">Ready to start shopping?</h1>
                        <p className="readyParagraph">Join thousands of Redditors buying and selling unique items every day.</p>
                        <button className="readyButton" onClick={totopFunction}>Start Browsing</button>
                    </div>
                </div>
            }

             <div class="wrapper">
                {showLoader && (
	                <div class="spanned">
		                <div class="coffee_cup"></div>
	                </div>
                )}
            </div>

            <p id="output"></p>
            {showCard && (
                <div className="flex-container">
                    {filterData(data,optionBuySell).map((item, index) => (
                        item && (
                            <div key={index} className="flex-item">
                                <Card data={filterData(data,optionBuySell)} index={index} optionBuySell={optionBuySell}></Card>
                            </div>
                            )
                        ))};
                    </div>
                )}
                            {showError && 
                <div className="errorPage">
                    <h2 className="errorHeader">The page is being rate limited or there is an error. Please reload and try again later :(</h2>
                </div>
            }
                {showDisclaimer &&
                    <div className="disclaimer">
                        <p>© 2023 Reddit Mart. All rights reserved.</p>
                        <p>Reddit Mart is not affiliated with Reddit Inc.</p>
                        <p>For inquiries, please contact rmart.contact1@gmail.com</p>
                    </div>
                }
        </div>
    );
};

export default App;