import React, { useEffect } from 'react';
import Card from './Card.jsx';
import { checkClickAll }  from './script.js';
import { FaSearch } from 'react-icons/fa';
import { FaReddit } from "react-icons/fa6";
import { VscLoading } from "react-icons/vsc";

const App = () => {
    const [data,setData] = React.useState([[[],[],[],[[],[]],[]]]);
    const [query,setQuery] = React.useState('');
    const [option,setOptionSub] = React.useState('all');
    const [showCard,setCard] = React.useState(false);
    const [optionBuySell, setOptionBuySell] = React.useState('buy');
    const [showLoader,setShowLoader] = React.useState(false);

  useEffect(() => {
    async function fetchData(){
        const result = await checkClickAll(option,query);
        setData(result || []);
    }
    fetchData();
    }, [option,query]);

    const handleSearch = async(event) => {
        if (event.key === 'Enter' || event.type === 'click'){
            const searchQuery = document.getElementById('search').value;
            setShowLoader(true);
            setCard(false);
            setQuery(searchQuery);

            await new Promise((resolve) => setTimeout(resolve,1000));

            setShowLoader(false);
            setCard(true);
        }
    };

    const filterData = (data,optionBuySell) => {
        const filteredData = data.filter((element) => {
            if ((element[6] === 'BUYING' || element[6] === 'CLOSED' || element[6] === 'Buying') && optionBuySell === 'buy'){
                console.log(`FILTERING ELEMENT: ${element}`)
                return false;
            }else if ((element[6] === 'SELLING'|| element[6] === 'CLOSED' || element[6] === 'Selling' || element[6] === 'Artisan') && optionBuySell === 'sell'){
                console.log(`FILTERING ELEMENT: ${element}`)
                return false;
            }
            return true;
        });
        console.log('Filtered Data: ', filteredData);
        return filteredData;
    };

    const subreddits = ["hardwareswap", "gameswap", "SteamGameSwap","mechmarket","MouseMarket","WatchExchange"];

    return (
        <div className="searchPage">
            <div className="searchContainer">
                <h1 className="searchTitle">R-Mart&nbsp;<FaReddit/></h1>
                <input className="searchInput" type="text" id="search" name="input" size="auto" placeholder="Search items..." onKeyDown={handleSearch}/>
                <button className="searchButton" id="searchButton" onClick={handleSearch}><FaSearch/></button>
            </div>

            <hr className="searchBreak"></hr>
            <h2 className="searchResultsTitle">Search Results</h2>

            <div className = "chooseSub">
                <select className="subredditsList" name="subreddits" id="subreddits" onChange={(e) => setOptionSub(e.target.value)}>
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
        </div>
    );
};

export default App;