import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
    name:"global",
    initialState:{
        toggle:true,
        open:false,
    },
    reducers:{
        setToggle:(state,action)=>{
            state.toggle = action.payload
        },
        setOpen:(state,action)=>{
            state.open = action.payload
        }
    }
})

export const {setToggle,setOpen} = globalSlice.actions;
export default globalSlice.reducer;