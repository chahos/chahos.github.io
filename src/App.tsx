import { useState } from "react";
import { ImageRoot } from "./pages/image";

function App() {
  const [screen, setScreen] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("screen");
  });
  const [itemCount] = useState<number>(() => {
    const params = new URLSearchParams(window.location.search);
    const count = params.get("c");
    if (count) {
      return Number.parseInt(count);
    }
    return 12;
  });
  const [ignoreDislike] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    const noDislike = params.get("ndl");
    return !!noDislike;
  });
  const [likeOnly] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    const lol = params.get("lol");
    return !!lol;
  });

  const changeUrl = (s: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("screen", s);
    window.history.replaceState({}, "", "?" + params.toString());
    setScreen(s);
  };

  if (screen === "image") {
    return <ImageRoot itemCount={itemCount} ignoreDislike={ignoreDislike} likeOnly={likeOnly} />;
  }

  return (
    <div className="h-screen flex items-center justify-center gap-4 flex-col">
      <button className="h-10 px-4 rounded-md bg-blue-500 active:bg-blue-900" onClick={() => changeUrl("image")}>
        Image
      </button>
      <button className="h-10 px-4 rounded-md bg-blue-500 active:bg-blue-900" onClick={() => changeUrl("video")}>
        Video
      </button>
    </div>
  );
}

export default App;
