import React from "react";
import { MDBJumbotron, MDBBtn, MDBContainer, MDBCardTitle} from "mdbreact";
import './Jumbotron.css'

const JumbotronLogout = (props) => {
    return (
      <MDBContainer className='jumbocontain'>
            <MDBJumbotron className="jumboimg animated bounceInDown" style={{ backgroundImage: `url(https://i.ytimg.com/vi/Gg_9Cc3NKK8/maxresdefault.jpg)` }}>
                  <MDBCardTitle className="jumbotitle">LXP</MDBCardTitle>
  
                  <p className="jumbotext"></p>
                  <MDBBtn className="btn-grad center" href={props.href}  onClick={props.logout}> Logout </MDBBtn>
            </MDBJumbotron>
      </MDBContainer>
    )
  }

  export default JumbotronLogout;