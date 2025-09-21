import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
    name:"global",
    initialState:{
        toggle:true,
    },
    reducers:{
        setToggle:(state,action)=>{
            state.toggle = action.payload
        },
    }
})

export const {setToggle} = globalSlice.actions;
export default globalSlice.reducer;