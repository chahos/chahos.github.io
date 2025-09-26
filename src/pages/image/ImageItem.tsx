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
  return (
    <div className="gap-y-2 relative self-start">
      <img className="w-full" src={image.link} alt={image.name} />
      <p className="text-gray-700 text-sm text-center">{image.name}</p>
      <span className="absolute top-0 left-0 bg-gray-500/50 px-2 py-1 text-sm text-yellow-300">{index}</span>
      <div className="absolute z-10 left-0 bottom-5 bg-gray-500/70 flex items-center justify-center gap-2 flex-col p-2 rounded-tr-md">
        <button
          className={`h-8 px-3 rounded-xs ${isLike ? "bg-green-500 active:bg-green-800" : "bg-gray-500 active:bg-gray-800"}`}
          onClick={onLike}
        >
          L
        </button>
        <button
          className={`h-8 px-3 rounded-xs ${isUnlike ? "bg-red-500 active:bg-red-800" : "bg-gray-500 active:bg-gray-800"}`}
          onClick={onUnlike}
        >
          D
        </button>
      </div>
    </div>
  );
}
