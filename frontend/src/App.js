import { BrowserRouter, Switch, Route } from 'react-router-dom'; // Importation de BrowserRouter, Switch, Route permettant de faire afficher des URL dynamiques et de sélectionner un component pour le faire afficher sur le navigateur lorsque l'utilisateur se rend sur l'URL spécifique définie
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';
import Header from './components/Header';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import HeaderConnected from './components/HeaderConnected';

let token = localStorage.getItem('token') // Importation du token de l'utilisateur contenu dans son localStorage
function App() {

  if (token) // Si le token est valide, le client a accès aux routes suivantes
    return (

      <BrowserRouter>
        <HeaderConnected />
        <Switch>
          <Route path="/" exact component={Home} />

          <Route path="/connexion" exact component={Login} />
          <Route path="/inscription" exact component={Signup} />
          <Route path="/mon-compte" exact component={Account} />
        </Switch>

        <Footer />
      </BrowserRouter>
    )
  else // Si le token n'est pas valide, alors le client a accès aux routes suivantes
    return (

      <BrowserRouter>
        <Header />

        <Switch>
          <Route path="/" exact component={Home} />

          <Route path="/connexion" exact component={Login} />
          <Route path="/inscription" exact component={Signup} />
          <Route path="/mon-compte" exact component={Account} />
        </Switch>

        <Footer />
      </BrowserRouter>
    )
}

export default App;