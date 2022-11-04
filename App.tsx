import React from 'react';
import Routes from './Routes';

import Amplify from 'aws-amplify';
import config from './config.json';

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

Amplify.configure({
  Auth: {
    mandatorySignId: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
});

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ffffff',
      main: '#eeeeee',
      dark: '#fafafa',
      contrastText: '#bdbdbd',
    },
    secondary: {
      light: '#ffad42',
      main: '#f57c00',
      dark: '#bb4d00',
      contrastText: '#bdbdbd',
    },
  },
});
class App extends React.Component<any, any> {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    );
  }
}

export default App;
