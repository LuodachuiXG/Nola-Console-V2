import { useState } from "react";
import { Button } from "./components/ui/button";
import { Calendar } from "./components/ui/calendar";

function App() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <>
      <div className="w-screen h-screen flex gap-2">
        Hello
        <Button>Hello</Button>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border"
        />
      </div>
    </>
  );
}

export default App;
