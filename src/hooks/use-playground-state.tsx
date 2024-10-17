import { createContext, useContext, useReducer, ReactNode } from 'react';

type State = {
  isConnected: boolean;
  isConnecting: boolean;
  isChatOpen: boolean;
  messages: string[];
};

type Action =
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_CHAT_OPEN'; payload: boolean }
  | { type: 'ADD_MESSAGE'; payload: string };

const initialState: State = {
  isConnected: false,
  isConnecting: false,
  isChatOpen: false,
  messages: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };
    case 'SET_CHAT_OPEN':
      return { ...state, isChatOpen: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
}

const PlaygroundContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export function PlaygroundProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PlaygroundContext.Provider value={{ state, dispatch }}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export function usePlaygroundState() {
  const context = useContext(PlaygroundContext);
  if (context === undefined) {
    throw new Error('usePlaygroundState must be used within a PlaygroundProvider');
  }
  return context;
}
