import React, { useEffect } from 'react';
import Card from './Card.jsx';
import { checkClickAll }  from './script.js';

const App = () => {
    const [data,setData] = React.useState([[[],[],[],[[],[]],[]]]);
    const [query,setQuery] = React.useState('');
    const [option,setOptionSub] = React.useState('all');
    const [showCard,setCard] = React.useState(false);
    const [optionBuySell, setOptionBuySell] = React.useState('sell');

  useEffect(() => {
    async function fetchData(){
        const result = await checkClickAll(option,query);
        setData(result || []);
    }
    fetchData();
    }, [option,query]);

    const handleSearch = () => {
        const searchQuery = document.getElementById('search').value;
        setCard(true);
        setQuery(searchQuery);
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
        <div>
            <p className="titleInfo">Reddit-mart displays newest posts first</p>
            <div className = "textBox">
                <label htmlFor="search">What item are you looking for: </label>
                <input type="text" id="search" name="input" size="auto"/>
                <button id="searchButton" onClick={handleSearch}>Submit</button>
                <select name="buySell" id="buySell" onChange={(e) => setOptionBuySell(e.target.value)}>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                    <option value="buy&sell">Buy/Sell</option>
                </select>
            </div>

            <div className = "chooseSub">
                <select name="subreddits" id="subreddits" onChange={(e) => setOptionSub(e.target.value)}>
                    <option value="all">all</option>
                    {subreddits.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>
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
                )};
        </div>
    );
};

export default App;