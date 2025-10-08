// redux is type of store where we can access components any time
import {configureStore} from "@reduxjs/toolkit";
// here authReducer is just a name which is exported from auth.js file
// we can name it anything we want
import AuthReducer from './auth';
import cartReducer from './cart'
const store= configureStore({
    reducer:{
        auth: AuthReducer,
        cart: cartReducer,
    },
    
})
    export default store;