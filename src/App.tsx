import { useAppSelector } from "./app/hooks";

function App() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">
        MovieMax
      </h1>

      <p className="mt-4">
        {user ? `Logged in as ${user.name}` : "Not logged in"}
      </p>
    </div>
  );
}

export default App;