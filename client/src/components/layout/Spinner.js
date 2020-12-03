import React , { Fragment } from 'react';
import spinner from './spinner.gif'

export default () => (
  <Fragment>
    <img 
      src={spinner}
      style={{width:'100px' , margin: '400px auto' , display: 'block'}}
      alt='Loading...'
    />
  </Fragment>
);