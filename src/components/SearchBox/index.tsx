import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';
import { ReactComponent as CancelIcon } from '../../assets/icons/close.svg';
import { FC } from 'react';
import './index.scss';
import { T } from '../../context/TranslationContext';

interface ISearchBox {
  handleEnter?: (e: React.KeyboardEvent) => void;
  handleFilter?: (value: string) => void;
  results?: number;
  placeholder?: string;
  value?: string;
}

const SearchBox: FC<ISearchBox> = ({ value, results = 0, handleEnter, handleFilter, placeholder }) => {
  return (
    <div className="searchbox">
      <SearchIcon className="search-icon" />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
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
      {results > 0 && (
        <p className="results">
          <T placeholders={[results]}>%1$s results</T>
        </p>
      )}
      {results === 0 && <div style={{ width: '8px' }}></div>}
    </div>
  );
};

export default SearchBox;
