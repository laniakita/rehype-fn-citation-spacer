import { Link } from 'wouter';
import './nav.css';

export default function Nav() {
  return (
    <nav className="Nav">
      <ul>
        <Link to="/" data-testid="blog">
          Blog
        </Link>
        <Link to="/commas-needed" data-testid="post-with-commas">
          Post with Commas
        </Link>
        <Link to="/no-commas-needed" data-testid="post-without-commas">
          Post without Commas
        </Link>
      </ul>
    </nav>
  );
}
