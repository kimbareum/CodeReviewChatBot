import React, { useReducer } from 'react';
import UpdateContext from './UpdateContext';

// 초기 상태 정의
const initialState = {
  sideBarState: 0,
  chatListState: 0,
  chatButtonState: 0,
};

// 리듀서 함수 정의
const UpdateReducer = (state, action) => {
  switch (action.type) {
    case 'SideBarUpdate':
      return {
        ...state,
        sideBarState: state.sideBarState + 1,
      };
    case 'ChatListUpdate':
      return {
        ...state,
        chatListState: state.chatListState + 1,
      };
    default:
      return state;
  }
};

// AuthProvider 컴포넌트
const UpdateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UpdateReducer, initialState);

  const updateSideBar = () => {
    dispatch({ type: 'SideBarUpdate' });
  };

  const updateChatList = () => {
    dispatch({ type: 'ChatListUpdate' });
  };


  return (
    <UpdateContext.Provider value={{ ...state, updateSideBar, updateChatList }}>
      {children}
    </UpdateContext.Provider>
  );
};

export default UpdateProvider;