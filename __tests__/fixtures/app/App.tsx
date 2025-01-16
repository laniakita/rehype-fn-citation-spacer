import CommasNeeded from '../posts/commas-needed.mdx';
import NoCommasNeeded from '../posts/no-commas-needed.mdx';
import Nav from './components/nav';
import './App.css';
import { Switch, Route } from 'wouter';



export default function App() {
  return (
    <div className='app'>
      <Nav />

      <Switch>
        <Route path="/">Welcome to my blog!</Route>
        <Route path="/commas-needed">
          <main>
            <CommasNeeded />
          </main>
        </Route>
        <Route path="/no-commas-needed">
          <main>
            <NoCommasNeeded />
          </main>
        </Route>

        <Route>404: Whoops! The requested page could not be found.</Route>
      </Switch>

    </div>
  );
}
