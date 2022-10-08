import { ReactComponent as SearchIcon } from '../../assets/images/search.svg';
import { ReactComponent as CancelIcon } from '../../assets/icons/close.svg';
import { FC } from 'react';
import './index.scss';

interface ISearchBox {
  handleEnter?: (e: React.KeyboardEvent) => void;
  handleFilter?: (value: string) => void;
  results?: number;
  value?: string;
}

const SearchBox: FC<ISearchBox> = ({ value, results, handleEnter, handleFilter }) => {
  return (
    <div className="searchbox">
      <SearchIcon className="search-icon" />
      <input
        title="Search"
        type="text"
        value={value}
        placeholder="Installation name"
        onChange={(e) => handleFilter && handleFilter(e.target.value)}
        onKeyDown={(e) => {
          if (e.code === 'Enter') e.preventDefault();
          if (handleEnter) handleEnter(e);
        }}
      />
      {value !== '' && (
        <button className="reset-btn" onClick={() => handleFilter && handleFilter('')}>
          <CancelIcon />
        </button>
      )}
      {/* {results && results > 0 && value !== '' && <p className="results">{results > 0 ? 's' : 'p'} Results</p>} */}
    </div>
  );
};

export default SearchBox;
