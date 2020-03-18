import React from "react";
import { Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";


const BaseRouter = () => (
  <div>
    <Route exact path="/" component={Home}/>{" "}
    <Route exact path="/login/" component={Login}/>{" "}    
    <Route exact path="/signup/" component={Signup}/>{" "}
  </div>
);

export default BaseRouter;