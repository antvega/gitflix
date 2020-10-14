import React from 'react';
import '../styling/Header.css';

function Header(props){
    return (
        <div className="container">
            <h1 className="title">{props.title}</h1>
        </div>
        
    )
}

export default Header;