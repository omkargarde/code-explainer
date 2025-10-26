import { Link } from '@tanstack/react-router'
import User from './User'

export default function Navbar() {
  return (
    <nav className="mb-6 flex w-full max-w-4xl items-center justify-between">
      <ul className="flex items-center justify-between">
        <li>
          <h1 className="text-2xl font-bold">
            <Link to="/">Code Explainer</Link>
          </h1>
        </li>
        <li>
          <Link to="/">Code entry</Link>
        </li>
        <li>
          <User />
        </li>
      </ul>
    </nav>
  )
}
