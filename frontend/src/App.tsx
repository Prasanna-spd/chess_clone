import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Landing from "./screens/Landing";
import Game from "./screens/Game";

function App() {
  // const [count, setCount] = useState(0)

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing/>
    },
    {
      path: "/game",
      element: <Game/>
    },
  ]);

  return (
    <>
    <div className="h-screen bg-slate-950">
      <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
