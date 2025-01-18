import CommasNeeded from '../posts/commas-needed.mdx';
import NoCommasNeeded from '../posts/no-commas-needed.mdx';
import Nav from './components/nav';
import './App.css';
import { Route, Switch } from 'wouter';

export default function App() {
  return (
    <div className="app">
      <Nav />

      <Switch>
        <Route path="/">Welcome to my blog!</Route>
        <Route path="/commas-needed">
          <main data-testid="main-post-spacers">
            <CommasNeeded />
          </main>
        </Route>
        <Route path="/no-commas-needed">
          <main data-testid="main-post-no-spacers">
            <NoCommasNeeded />
          </main>
        </Route>

        <Route>404: Whoops! The requested page could not be found.</Route>
      </Switch>
    </div>
  );
}
