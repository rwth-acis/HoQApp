import Vue from 'vue'
import { createOidcAuth, SignInType, LogLevel } from 'vue-oidc-client/vue2'

const loco = window.location
const appRootUrl = `${loco.protocol}//${loco.host}${process.env.BASE_URL}`

var mainOidc = createOidcAuth(
  'main',
  SignInType.Popup,
  appRootUrl,
  {
    authority: 'https://api.learning-layers.eu/o/oauth2/',
    client_id: 'bd080f23-433c-417e-b21a-b9a96846c9d9',
    client_secret: 'S5sWvLKF2QZEcHfsq0Ap8lC9L-TX06JG8mLbez1aQgz71QSizJO1MI96Boy3tJ7zPwcDPZeigqMI60leKIXL2A',
    response_type: 'code',
    scope: 'openid email profile',
    // test use
    prompt: 'login',
    login_hint: 'bob'
  },
  console,
  LogLevel.Debug
)
Vue.prototype.$oidc = mainOidc
export default mainOidc
