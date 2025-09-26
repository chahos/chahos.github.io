import { useState } from "react";
import type { ImageSource } from "../../type";

type Props = {
  index: number;
  image: ImageSource;
  isLike: boolean;
  isUnlike: boolean;
  onLike: () => void;
  onUnlike: () => void;
};

export function ImageItem({ index, image, isLike, isUnlike, onLike, onUnlike }: Props) {
  const [focus, setFocus] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (["wrapper", "pseudo"].includes((e.currentTarget as any).dataset.el)) {
      setFocus((prev) => !prev);
    }
  };

  return (
    <div data-el="wrapper" className="gap-y-2 relative group" onClick={handleClick}>
      <img className="w-full" src={image.link} alt={image.name} />
      <p className="text-gray-700 text-sm text-center">{image.name}</p>
      <span className="absolute top-0 left-0 bg-gray-500/50 px-2 py-1 text-sm text-yellow-300">{index}</span>
      <div
        data-el="pseudo"
        className={`absolute z-10 inset-0 bg-gray-500/30 group-hover:flex items-center justify-center gap-2 flex-col ${focus ? "flex" : "hidden"}`}
      >
        <button
          className={`h-6 px-3 rounded-xs ${isLike ? "bg-green-500 active:bg-green-800" : "bg-gray-500 active:bg-gray-800"}`}
          onClick={onLike}
        >
          {isLike ? "Liked" : "Like"}
        </button>
        <button
          className={`h-6 px-3 rounded-xs ${isUnlike ? "bg-red-500 active:bg-red-800" : "bg-gray-500 active:bg-gray-800"}`}
          onClick={onUnlike}
        >
          {isUnlike ? "Disliked" : "Dislike"}
        </button>
      </div>
    </div>
  );
}
