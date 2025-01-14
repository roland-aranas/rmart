

function Card({data,index}){

    let mediaSrc = data[index][3][0]
    const mediaType = data[index][3][1]
    let mediaElement;
    
    try{

        if(data[index][7] === 'Watchexchange'){
            mediaSrc = data[index][8];
            mediaElement = (
                <img className="image" src={mediaSrc}></img>
            );
        }else if (mediaType === 'video/mp4'){
                mediaElement = (
                    <video className="video" muted autoPlay loop>
                        <source src={mediaSrc}></source>
                    </video>
                )
            }else if (mediaType === 'image/png' || mediaType === 'image/jpeg'){
                mediaElement = (
                    <img className="image" src={mediaSrc}></img>
                );
            }else{
                mediaElement = (
                    <p></p>
                );
            }
            }catch(error){
                mediaElement = (
                    <p>Error loading media</p>
                );
            }

        const currentTime = Math.floor(new Date().getTime()/1000.0);
        const newDate = data[index][4]
        const minutes = Math.abs(Math.floor((newDate-currentTime)/60));
        const hours = Math.abs(Math.floor((newDate-currentTime)/3600));
        const days = Math.abs(Math.floor((newDate-currentTime)/86400));
        let time = 0;

        if (minutes > 60 && minutes < 1440){
            time = (hours-1) + '\t hours ago';
        }else if (minutes > 1440){
            time = (days-1) + '\t days ago';
        }else{
            time = (minutes-1) + '\t minutes ago';
        }

    return(
        <div className="card [perspective:200px]">
            {mediaElement}
            <h2 className="Title"><a href={data[index][1]} target="_blank" rel="noopener noreferrer">{data[index][0]}</a></h2>
            <p className="subredditCard">&nbsp;{data[index][2]}&nbsp;</p>
            <p className="postTime">{time}</p>
            <p className="price">{data[index][5]}</p>
        </div>
    );
}

export default Card;