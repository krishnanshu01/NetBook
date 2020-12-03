import React , {Fragment, useState} from 'react'
import {Link, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import  PropTypes  from 'prop-types';
import {login} from '../../actions/auth';
const Login = ({ login , isAuthenticated}) => {
    const [formData , setFormData] = useState({
        email : '',
        password : ''
    });

    const { email , password } = formData;
    // onchange is going to change all the propertis of each and every form filed
    // sbko update krne ke liye use krenge onchange
    // we use target name to target each value which is present in name in form 
    const onChange = e => setFormData({...formData,[e.target.name]:e.target.value})

    //we dont use action in form we use onSubmit
    const onSubmit = async e =>{
        e.preventDefault();
        
        login(email ,password)
        
    }
    //Redirect if logged in
    if(isAuthenticated){
      return <Redirect to="/dashboard" />
    }

    return (
       <Fragment>
            <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign in to Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email}
          onChange = {e => onChange(e)} />
          
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
          onChange = {e => onChange(e)} 
          />
        </div>
        
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Already have an account? <Link to ="/register">Sign Up</Link>
      </p>
       </Fragment>
    )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state =>({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps , {login})(Login);