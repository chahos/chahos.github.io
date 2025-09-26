import { useCallbackRef, useLocalStorage } from "@mantine/hooks";
import imageSource from "../../data/image-source.json";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ImageSource } from "../../type";
import { ImageItem } from "./ImageItem";

type Props = {
  itemCount: number;
  ignoreDislike: boolean;
  likeOnly: boolean;
};

const IMAGES = imageSource.data as ImageSource[];

export function ImageRoot({ itemCount, ignoreDislike, likeOnly }: Props) {
  const [lastId, setLastId] = useLocalStorage<number | null>({
    key: "image-last-id",
    defaultValue: null,
    getInitialValueInEffect: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [fromTo, setFromTo] = useState(() => getStateFromLastId(lastId, itemCount, ignoreDislike, likeOnly));
  const [updateMap, setUpdateMap] = useState<Record<number, { like: boolean; dislike: boolean }>>({});
  const [extractString, setExtractString] = useState("");

  const images = useMemo(() => {
    const temp = IMAGES.slice(fromTo.from, fromTo.to);
    if (ignoreDislike) {
      return temp.filter((i) => !i.unlike);
    }
    if (likeOnly) {
      return temp.filter((i) => !!i.like);
    }
    return temp;
  }, [fromTo.from, fromTo.to, ignoreDislike, likeOnly]);

  const handlePrev = () => {
    let to = fromTo.from;
    if (to <= 0) {
      to = IMAGES.length - 1;
    }
    let from = to;
    let count = 0;
    for (; from >= 0; from--) {
      if ((ignoreDislike && IMAGES[from].unlike) || (likeOnly && !IMAGES[from].like)) {
        continue;
      }
      count++;
      if (count >= itemCount) {
        break;
      }
    }
    setFromTo({ from: from - 1, to });
  };

  const handleNext = () => {
    let from = fromTo.to;
    if (from >= IMAGES.length) {
      from = 0;
    }
    let to = from;
    let count = 0;
    for (; to < IMAGES.length; to++) {
      if ((ignoreDislike && IMAGES[to].unlike) || (likeOnly && !IMAGES[to].like)) {
        continue;
      }
      count++;
      if (count >= itemCount) {
        break;
      }
    }
    setFromTo({ from, to: to + 1 });
  };

  const handlePrevCallback = useCallbackRef(handlePrev);
  const handleNextCallback = useCallbackRef(handleNext);

  const handleSetFrom = () => {
    const index = Number.parseInt(inputRef.current?.value ?? "");
    if (Number.isNaN(index)) {
      return;
    }
    const fromIndex = Math.min(Math.max(0, index), IMAGES.length - 1);
    const temp = getStateFromLastId(IMAGES[fromIndex].id, itemCount, ignoreDislike, likeOnly);
    setFromTo(temp);
    setLastId(IMAGES[temp.to].id);
  };

  useEffect(() => {
    const lastImage = images.length ? images[images.length - 1] : null;
    if (lastImage && (!lastId || lastImage.id > lastId)) {
      setLastId(lastImage.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromTo.to]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevCallback();
      } else if (event.key === "ArrowRight") {
        handleNextCallback();
      }
    };

    // Attach listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNextCallback, handlePrevCallback]);

  const handleUpdateLike = (isLike: boolean, key: number) => {
    const tmp = { ...updateMap };
    const status = tmp[key];
    if (isLike) {
      if (status?.like) {
        tmp[key] = { like: false, dislike: false };
      } else {
        tmp[key] = { like: true, dislike: false };
      }
    } else {
      if (status?.dislike) {
        tmp[key] = { like: false, dislike: false };
      } else {
        tmp[key] = { like: false, dislike: true };
      }
    }
    setUpdateMap(tmp);
  };

  const handleExtractUpdates = () => {
    const lastImage = images.length ? images[images.length - 1] : null;
    if (lastImage) {
      setLastId(lastImage.id);
    }
    const str = Object.entries(updateMap)
      .map(([id, value]) => {
        return `${id}|${value.like ? "1" : "0"}|${value.dislike ? "1" : "0"}`;
      })
      .join("\n");
    setExtractString(str);
    void navigator.clipboard.writeText(str);
  };

  return (
    <div className="min-h-screen p-4 space-y-4 relative text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative">
        {images.map((i, idx) => (
          <ImageItem
            key={i.link}
            index={fromTo.from + idx}
            image={i}
            isLike={updateMap[i.id]?.like || !!i.like}
            isUnlike={updateMap[i.id]?.dislike || !!i.unlike}
            onLike={() => handleUpdateLike(true, i.id)}
            onUnlike={() => handleUpdateLike(false, i.id)}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button className="h-6 px-3 rounded-xs bg-sky-500 active:bg-sky-800" onClick={handlePrev}>
          Prev
        </button>
        <div className="max-w-56">
          <input className="block min-w-0 w-full text-sm bg-gray-800 text-white px-2 py-1 rounded-md" ref={inputRef} />
          <button className="w-full h-6 px-3 rounded-xs bg-sky-500 active:bg-sky-800 mt-1" onClick={handleSetFrom}>
            Set From
          </button>
        </div>
        <button className="h-6 px-3 rounded-xs bg-sky-500 active:bg-sky-800" onClick={handleNext}>
          Next
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 flex-col">
        <button className="h-6 px-3 rounded-xs bg-indigo-500 active:bg-indigo-800" onClick={handleExtractUpdates}>
          Extract Updates
        </button>
        {!!extractString && (
          <>
            <button
              className="h-6 px-3 rounded-xs bg-green-500 active:bg-green-800"
              onClick={() => void navigator.clipboard.writeText(extractString)}
            >
              Copy
            </button>
            <textarea className="p-2 bg-gray-800 text-white min-w-60" value={extractString} readOnly />
          </>
        )}
      </div>
    </div>
  );
}

function getStateFromLastId(
  lastId: number | null,
  itemCount: number,
  ignoreDislike: boolean,
  likeOnly: boolean
): { from: number; to: number } {
  const _last = lastId || 0;
  let lastIndex = IMAGES.findIndex((i) => i.id === _last);
  if (lastIndex === -1) {
    lastIndex = 0;
  }
  let count = 0;
  let i = lastIndex;
  for (; i < IMAGES.length; i++) {
    if ((ignoreDislike && IMAGES[i].unlike) || (likeOnly && !IMAGES[i].like)) {
      continue;
    }
    count++;
    if (count >= itemCount) {
      break;
    }
  }
  return {
    from: lastIndex,
    to: i + 1,
  };
}
