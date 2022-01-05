const Reducer = (state, action) => {
    console.log(state);
    console.log(action);
    console.log('pokrenuto');
    console.log('stanje:');
    console.log(state);
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload
            };
      
        default:
            return state;
    }
    
};

export default Reducer;