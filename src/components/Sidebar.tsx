import { Home } from 'lucide-react'

export default function Sidebar() {
  return (
    <section className="h-full w-1/12 bg-blue-400 flex flex-col items-center p-4">
      <h2></h2>
      <ul>
        <li className="bg-blue-300 p-2 rounded-full">
          <a href="">
            <Home className="text-white bg-blue-300 w-10 h-10" />
          </a>
        </li>
      </ul>
    </section>
  )
}
