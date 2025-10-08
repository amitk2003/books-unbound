import {createSlice} from  '@reduxjs/toolkit';
const authSlice =createSlice({
    name:"auth",
    initialState:{isLoggedIn:false,role:"user"},
    reducers:{
        login(state){
            state.isLoggedIn=true;
        },
        logout(state){
            state.isLoggedIn=false;
        },
        changeRole(state,action){
           const role=action.payload;
            state.role=role;
        },
    }


})
export const authActions= authSlice.actions;
export default authSlice.reducer;
// This code defines a Redux slice for authentication, including actions for logging in, logging out, and changing the user role. The initial state indicates that the user is not logged in and has a default role of "user". The slice is created using `createSlice` from Redux Toolkit, which simplifies the process of creating actions and reducers. The actions can be dispatched to update the authentication state in the application.