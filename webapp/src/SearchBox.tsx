import { FilterQuery } from "./domain";

interface Props {
  query: FilterQuery;
  placeholder: string;
  onChange: (query: FilterQuery) => void;
}

function SearchBox({
  query,
  onChange: onFilterQueryChange,
  placeholder,
}: Props) {
  return (
    <div className="bp4-input-group bp4-large">
      <span className="bp4-icon bp4-icon-filter"></span>
      <input
        type="text"
        className="bp4-input bp4-large"
        value={query}
        onChange={(event: any) => onFilterQueryChange(event.target.value)}
        placeholder={placeholder}
        // placeholder="Filter inventory..."
      />
    </div>
  );
}

export default SearchBox;
