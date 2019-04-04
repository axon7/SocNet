import React, { Component } from 'react'

class Login extends Component {
  constructor(){
    super();
    this.state={
      email: '',
      password: ''
    }
  }

  onChange = (e) =>{
    //in brackets because it dynamically changes
    this.setState({ [e.target.name] : e.target.value})
  }

  onSubmit = (e)=>{
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    console.log(user);

  }





  render() {
    return (
      <div>
        <div className="login">
            <div className="container">
              <div className="row">
                <div className="col-md-8 m-auto">
                  <h1 className="display-4 text-center">Log In</h1>
                  <p className="lead text-center">Sign in to your DevConnector account</p>
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <input 
                        type="email" 
                        className="form-control form-control-lg" 
                        placeholder="Email Address" 
                        name="email"
                        onChange={this.onChange}  
                        value={this.state.email} />
                    </div>
                    <div className="form-group">
                      <input 
                        type="password" 
                        className="form-control form-control-lg" 
                        placeholder="Password" 
                        name="password"
                        onChange={this.onChange}  
                        value={this.state.password} />
                    </div>
                    <input type="submit" className="btn btn-info btn-block mt-4" />
                  </form>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default Login;
