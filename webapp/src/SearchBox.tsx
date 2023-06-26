import { FilterQuery } from "./domain";

export const NO_FILTER_QUERY = "";

interface Props {
  query: FilterQuery;
  placeholder: string;
  onChange: (query: FilterQuery) => void;
  clearSearch: () => void;
}

function SearchBox({
  query,
  onChange: onFilterQueryChange,
  clearSearch,
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
      {query !== NO_FILTER_QUERY && (
        <button
          className="bp4-button bp4-minimal bp4-intent-warning bp4-icon-cross"
          onClick={() => clearSearch()}
        />
      )}
    </div>
  );
}

export default SearchBox;
