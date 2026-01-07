type RatingProps = {
  rating: number;
  onChange: (value: number) => void;
};

function Rating({ onChange, rating }: RatingProps) {
  return (
    <div className="flex justify-between">
      <button
        onClick={() => {
          onChange(1);
        }}
        className="text-3xl"
        type="button"
      >
        {rating >= 1 ? <span>★</span> : <span>☆</span>}
      </button>
      <button
        type="button"
        onClick={() => {
          onChange(2);
        }}
        className="text-3xl"
      >
        {rating >= 2 ? <span>★</span> : <span>☆</span>}
      </button>
      <button
        type="button"
        onClick={() => {
          onChange(3);
        }}
        className="text-3xl"
      >
        {rating >= 3 ? <span>★</span> : <span>☆</span>}
      </button>
      <button
        type="button"
        onClick={() => {
          onChange(4);
        }}
        className="text-3xl"
      >
        {rating >= 4 ? <span>★</span> : <span>☆</span>}
      </button>
      <button
        type="button"
        onClick={() => {
          onChange(5);
        }}
        className="text-3xl"
      >
        {rating >= 5 ? <span>★</span> : <span>☆</span>}
      </button>
      <button
        type="button"
        onClick={() => {
          onChange(6);
        }}
        className="text-3xl"
      >
        {rating >= 6 ? <span>★</span> : <span>☆</span>}
      </button>
      <button
        type="button"
        onClick={() => {
          onChange(7);
        }}
        className="text-3xl"
      >
        {rating >= 7 ? <span>★</span> : <span>☆</span>}
      </button>
      <button
        type="button"
        onClick={() => {
          onChange(8);
        }}
        className="text-3xl"
      >
        {rating >= 8 ? <span>★</span> : <span>☆</span>}
      </button>
      <button
        type="button"
        onClick={() => {
          onChange(9);
        }}
        className="text-3xl"
      >
        {rating >= 9 ? <span>★</span> : <span>☆</span>}
      </button>
      <button
        type="button"
        onClick={() => {
          onChange(10);
        }}
        className="text-3xl"
      >
        {rating >= 10 ? <span>★</span> : <span>☆</span>}
      </button>
    </div>
  );
}

export { Rating };
