import { createSlice } from '@reduxjs/toolkit' 
//  createSlice is a function that accepts an initial state, an object full of reducer functions, and a "slice name", and automatically generates action creators and action types that correspond to the reducers and state.

const initialState = {
  name:'',
  avatar:''
}


export const activateSlice = createSlice({
  name: 'activate',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;

    },
    
    setAvatar: (state, action) =>{
       state.avatar = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setName, setAvatar } = activateSlice.actions;

export default activateSlice.reducer;


// Redux Toolkit allows us to write "mutating" logic in reducers. It
// doesn't actually mutate the state because it uses the Immer library,
// which detects changes to a "draft state" and produces a brand new
// immutable state based off those changes