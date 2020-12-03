import {SET_ALERT , REMOVE_ALERT} from '../actions/types'
const initialState = [];//making initialstate empty
// this state is basically alert state
export default function(state = initialState , action){
  const { type , payload } = action;
  switch (type) {
      case SET_ALERT:
          return [...state , payload];  // always try to send data as payload
  
      case REMOVE_ALERT:
          return state.filter(alert => alert.id !== payload)

      default:
        return state;

        //every reducer we create has default case in it..
       // so all these are reducer
       //it does not return when alert matched to the data of payload
  }
}