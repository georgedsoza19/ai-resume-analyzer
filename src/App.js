import React from "react";
import Dashboard from "./Dashboard";
import Productlist  from "./Productlist";
import Createproduct from "./Createproduct";
import {Link,Route, BrowserRouter as Router} from "react-rauter-dom"








function App(){
  return(
    <div>
      <Router>
        <Link to="dashboard"></Link>
        <Link to="productlist"></Link>
        <Link to="createproduct"></Link>
        
        <Route path="/dashboard">Dashboard</Route>
        <Route path="/dashboard">Createproduct</Route>
        <Route path="/dashboard">Productlist</Route>

        </Router>


    </div>
  );
}
export default App;