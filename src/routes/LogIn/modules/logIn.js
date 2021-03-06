import AWSCognitoManager from '../../../AWSCognitoManager';

// ------------------------------------
// Action Types
// ------------------------------------
export const SET_USERNAME = 'SET_USERNAME';
export const SET_PASSWORD = 'SET_PASSWORD';
export const TRY_LOG_IN = 'TRY_LOG_IN';
export const ON_LOG_IN_RESPONSE = 'ON_LOG_IN_RESPONSE';

export const LogInStates = {
  WRITING_INFO: 'WRITING_INFO',
  WAITING_RESPONSE: 'WAITING_RESPONSE',
  ON_RESPONSE: 'ON_RESPONSE',
};

// ------------------------------------
// Actions
// ------------------------------------
export const setUsername = (value = '') => ({
  type: SET_USERNAME,
  payload: value,
});

export const setPassword = (value = '') => ({
  type: SET_PASSWORD,
  payload: value,
});

export const tryLogIn = () => (dispatch, getState) => new Promise(() => {
  dispatch({
    type: TRY_LOG_IN,
  });

  const {
    username,
    password,
  } = getState().logIn;

  AWSCognitoManager.logIn(username, password)
  .then(() => dispatch({
    type: ON_LOG_IN_RESPONSE,
    isSuccess: true,
  }))
  .catch(error => dispatch({
    type: ON_LOG_IN_RESPONSE,
    isSuccess: false,
    error,
  }));
});

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [SET_USERNAME]: (state, action) => ({ ...state, username: action.payload }),
  [SET_PASSWORD]: (state, action) => ({ ...state, password: action.payload }),
  [TRY_LOG_IN]: state => ({
    ...state,
    currentState: LogInStates.WAITING_RESPONSE,
  }),
  [ON_LOG_IN_RESPONSE]: (state, action) => ({
    ...state,
    currentState: LogInStates.ON_RESPONSE,
    isSuccess: action.isSuccess,
    error: action.error,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  username: '',
  password: '',
  currentState: LogInStates.WRITING_INFO,
  isSuccess: false,
  error: null,
};
export default function logInReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
