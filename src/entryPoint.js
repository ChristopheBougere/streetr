import { KeepAwake, registerRootComponent } from 'expo';
import App from './App';

if (__DEV__) { // eslint-disable-line no-undef
  KeepAwake.activate();
}

registerRootComponent(App);
