import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function App() {

  return (
    <>
      <Button asChild variant="outline">
        <Link to="/chat">Chat</Link>
      </Button>
      <Button asChild variant="outline" className="m-2">
        <Link to="/login">Login</Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/logout">Logout</Link>
      </Button>
    </>
  );
}

export default App;
