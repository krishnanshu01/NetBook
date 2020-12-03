import React , {Fragment, useState} from 'react'
import {Link , Redirect} from 'react-router-dom'
import {connect } from 'react-redux' //we use this to connect the alert
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({ setAlert , register , isAuthenticated}) => {
    const [formData , setFormData] = useState({
        name : '',
        email : '',
        password : '',
        password2 : ''
    });

    const {name , email , password , password2} = formData;
    // onchange is going to change all the propertis of each and every form filed
    // sbko update krne ke liye use krenge onchange
  
    const onChange = e => setFormData({...formData,[e.target.name]:e.target.value})

    //we dont use action in form we use onSubmit
    const onSubmit = async e =>{
        e.preventDefault();
        if(password !== password2){
            setAlert('Password do not match','danger');
        }else{
            //one way to add date in the database
        //     const newUser = {
        //         name,
        //         email,
        //         password
        //     }
        //  try{
        //     const config = {
        //         headers: {
        //             'Content-Type':'application/json'
        //         }
        //     }
        //     const body = JSON.stringify(newUser);

        //     const res = await axios.post('/api/users' , body , config);
        //     console.log(res.data);
        //   }catch(err){
        //       console.log(err.repsonse.data)
        //   }
        register({name , email , password});
        }
    }


    if(isAuthenticated){
      return <Redirect to="/dashboard" />
    }


    return (
       <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" value={name}
          onChange = {e => onChange(e)}
           />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email}
          onChange = {e => onChange(e)} />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
          onChange = {e => onChange(e)}    //last line ke liye hi ye comment connect
          // ke andr do arguements aayenge 
          //ek toh state and second is an object or action which you want to use
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
       </Fragment>
    );
};
Register.propTypes = {
  setAlert: PropTypes.func.isRequired ,
  register: PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool
};

const mapStateToProps = state =>({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps , {setAlert , register} )(Register);