import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "./constants";

const wrapper = {
  display: "flex"
};

let style = {
  minWidth: "250px",
  height: "100vh",
  backgroundColor: "lightgrey",
};


export default class SideNav extends React.Component {
    render() {
        return (
            <div style={wrapper}>
                <nav style={style}>
                    <div className="ml-2 text-black">
                        <h3>Chats:</h3>
                    </div>
                        <h4 className="ml-3">
                            {this.props.currentChannel !== "general" ? (
                            <Link to={ROUTES.generalChannel}>General Chat</Link>) : ("General Chat")}
                        </h4>
                        <h4 className="ml-3">
                        {this.props.currentChannel !== "random" ? (
                        <Link to={ROUTES.randomChannel}>Random Chat</Link>) : ( "Random Chat")}
                        </h4>
                    
                </nav>
            </div>
        );
    }
}
