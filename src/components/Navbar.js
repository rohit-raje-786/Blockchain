import React, { Component } from 'react';


class Navbar extends Component {

 
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://rohit-patil.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
          Rohit's Blockchain MarketPlace
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <strong className="text-white" >ACC Add:</strong><small className="text-white"><span id="account">{this.props.account}</span></small>
            </li>
          </ul>
        </nav>
       
      </div>
    );
  }
}

export default Navbar;
