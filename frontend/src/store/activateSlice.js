import { createSlice } from '@reduxjs/toolkit' 

const initialState = {
  name:'',
  avatar:'',
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

export const { setName, setAvatar } = activateSlice.actions;

export default activateSlice.reducer;


// Redux Toolkit allows us to write "mutating" logic in reducers. It
// doesn't actually mutate the state because it uses the Immer library,
// which detects changes to a "draft state" and produces a brand new
// immutable state based off those changes