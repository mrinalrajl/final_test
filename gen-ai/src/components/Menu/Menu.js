import React from "react"; 

import {
    Link
  } from "react-router-dom";

function Menu() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/reports">Reports</Link></li>
                <li><Link to="/summary">Summary</Link></li> 
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </nav>
    );
}

export default Menu;