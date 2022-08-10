import React from 'react';


const style = {
    borderRadius: '30px !important',
}

function Card(props) {

    return (
                    <div style={style} className={`card ${props.size} hoverable ${props.color} ${props.customClass}`}>
                        <div className="card-content white-text">
                            <span className="card-title">{props.title}</span>
                            {props.children}
                            <p></p>
                        </div>
                        <div className="card-action">
                            {props.action}   
                            <br/>
                            <br/>
                            {props.bottomLink}
                            </div>
                    </div>
    )
}


export default Card;