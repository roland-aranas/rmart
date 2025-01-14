import './whyCard.css'

function WhyCards({className,title,paragraph, icon,iconName}){

    return(
        <div className={`whyCard ${className}`}>
            <svg className={iconName}>{icon}</svg>
            <div className="whyTitle">
                <h2>{title}</h2>
            </div>
            <div className="whyParagraph">
                <p>{paragraph}</p>
            </div>
        </div>
    )
}

export default WhyCards;