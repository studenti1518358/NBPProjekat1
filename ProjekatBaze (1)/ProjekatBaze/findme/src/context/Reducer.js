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
        case 'SET_FRIEND':
             return{
                 ...state,
                 friend:action.payload
             }
        case 'SET_FRIEND_SRC':
            return{
                ...state,
                friendSrc:action.payload
            }
            case 'SET_FRIEND_ONLINE':
                return{
                    ...state,
                    friendOnline:action.payload
                }
                case 'SET_FRIEND_LAST_SEEN':
                    return{
                        ...state,
                        friendLastSeen:action.payload
                    }
      
        default:
            return state;
    }
    
};

export default Reducer;