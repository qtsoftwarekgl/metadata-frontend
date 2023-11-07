import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';
import Auth from './Auth';
import LoginDedicated from '../Pages/Standalone/LoginDedicated';
import Application from './Application';
import ThemeWrapper, { AppContext } from './ThemeWrapper';
import { getAuthToken, unsetLocalStorage } from '../../utils/helpers';
import API from '../../config/axiosConfig';
import * as URL from '../../lib/apiUrls';
import { IDLE_TIMOUT_INTERVAL } from '../../lib/constants';
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.idleTimer = null;
    this.onIdle = this._onIdle.bind(this);
  }

  _onIdle() { // eslint-disable-line
    if (typeof window !== 'undefined') {
      if (getAuthToken()) {
        API.post(URL.LOG_OUT_USER);
        unsetLocalStorage();
        window.location.href = '/login';
      }
    }
  }

  render() {
    return (
      <ThemeWrapper>
        <IdleTimer
          ref={ref => { this.idleTimer = ref; }}
          onActive={() => {}}
          onIdle={this.onIdle}
          onAction={() => {}}
          debounce={250}
          timeout={IDLE_TIMOUT_INTERVAL}
        />
        <AppContext.Consumer>
          {(changeMode) => (
            <Switch>
              <Route
                path="/"
                exact
                render={() => (getAuthToken() ? <Redirect to="/metadata/acknowlegement-list" /> : <Redirect to="/login" />)}
                // render={() => <Redirect to="/metadata/acknowlegement-list" />}
              />
              <Route
                path="/login"
                exact
                render={() => (getAuthToken() ? <Redirect to="/metadata/acknowlegement-list" /> : <LoginDedicated />)}
                // render={() => <LoginDedicated />}
              />
              <Route
                path="/"
                render={(props) => (getAuthToken() ? <Application {...props} changeMode={changeMode} /> : <Redirect to="/login" />)}
                // render={(props) => (<Application {...props} changeMode={changeMode} />)}
              />
              <Route component={Auth} />
            </Switch>
          )}
        </AppContext.Consumer>
      </ThemeWrapper>
    );
  }
}

export default App;
