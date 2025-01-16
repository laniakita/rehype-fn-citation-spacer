import { Link } from "wouter";
import "./nav.css";

export default function Nav() {
  return (
    <nav className="Nav">
      <ul>
        <Link to="/">Blog</Link>
        <Link to="/commas-needed">Post with Commas</Link>
        <Link to="/no-commas-needed">Post without Commas</Link>
      </ul>
    </nav>
  );
}
