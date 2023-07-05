import {useEffect, useRef, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import Arrow from '../../public/icons/arrow_notrail.svg';

interface InputProps extends React.ComponentProps<'input'> {
  label: string;
  label_loc?: string;
  dropdown_items?: string[];
  additional_styles_label?: string;
  additional_styles_input?: string;
  additional_styles_input_dropdown?: string;
  additional_styles_menu_container?: string;
  additional_styles?: string;
  withSearch?: boolean;
  setSelectedItem?: any;
}

const Input: React.FunctionComponent<InputProps> = ({
  label = 'none',
  label_loc = 'none',
  type,
  dropdown_items = [],
  additional_styles_label = '',
  additional_styles_input = '',
  additional_styles_input_dropdown = '',
  additional_styles_menu_container = '',
  additional_styles = '',
  setSelectedItem,
  withSearch,
  ...inputProps
}) => {
  const [selected, setSelected] = useState('');
  const [clicked, setclicked] = useState(false);
  const [currentlyFocused, setCurrentlyFocused] = useState<Element>();
  const [doSearch, setDoSearch] = useState<Element>();
  const selectorRef = useRef();
  const handleUnfocus = (e: {preventDefault: () => void}) => {
    e.preventDefault();

    // to close the dropdown items when the dropdown menu is clicked again
    if (document.activeElement === currentlyFocused) {
      (document.activeElement as HTMLElement).blur();
      setCurrentlyFocused(null);
      setDoSearch(null);
    } else {
      setCurrentlyFocused(document.activeElement);
    }
  };

  const [SearchData, setSearchData] = useState([]);
  const onSearch = (e: {target: {value: string}}) => {
    const name = e.target.value.toLowerCase().split('').join('.*');
    let temp = dropdown_items as any;
    temp = temp.filter((item: string) => {
      return new RegExp(name).test(item.toLowerCase());
    });

    setSearchData(temp);
  };

  useEffect(() => {
    // directly using the setState function is prevented for performance sake
    // (to prevent re-render, which is very expensive in resource in this case)
    if (setSelectedItem) {
      setSelectedItem[0] = [selected];
    }
    // forcefully trigger onChange event to make onChange on parent component works
    if (selected) {
      console.log('reached');
      const selector = selectorRef.current as any;
      const lastValue = selector.value;
      selector.value = selected;
      const event = new Event('input', {bubbles: true});
      const tracker = selector._valueTracker;

      if (tracker) {
        tracker.setValue(lastValue);
      }
      selector.dispatchEvent(event);
    }
  }, [selected, clicked]);

  return (
    <div
      className={twMerge(
        `${
          label_loc.toLowerCase() === 'beside'
            ? 'flex items-center space-x-2'
            : label_loc.toLowerCase() === 'above'
            ? 'flex flex-col items-start'
            : ''
        }`,
        additional_styles,
      )}>
      <label
        className={twMerge(
          `${
            label.toLowerCase() !== 'none' ? 'block' : 'hidden'
          } w-[45%]  border-black`,
          additional_styles_label,
        )}>
        {label}
      </label>
      {type.toLowerCase() !== 'dropdown' ? (
        <input
          type={type}
          className={twMerge(
            `rounded-md bg-gray-200 placeholder:text-gray-500
                         outline-none px-2 py-1.5 w-full hover:bg-gray-300
                         focus:bg-gray-300 focus:outline-2 focus:outline-gray-400
                         transition-all`,
            additional_styles_input,
          )}
          {...inputProps}
        />
      ) : (
        <div
          tabIndex={0}
          className="group relative select-none w-full"
          onClick={handleUnfocus}
          onBlur={() => {
            setCurrentlyFocused(null);
            setDoSearch(null);
          }}>
          <div
            className={twMerge(
              `flex justify-between items-center rounded-md
                      bg-gray-200 placeholder:text-gray-500
                        outline-none px-2 py-1.5 w-full
                      hover:bg-gray-300 focus:bg-gray-300 focus:outline-2
                      focus:outline-gray-400 transition-all`,
              additional_styles_input,
            )}>
            <input
              type="text"
              ref={selectorRef}
              id="selected_item"
              onClick={e => {
                e.preventDefault();
                (e as any).target.parentElement.parentElement.focus();
                handleUnfocus;
              }}
              className={twMerge(
                'truncate w-[90%] bg-transparent outline-none cursor-default select-none placeholder:text-gray-500',
                additional_styles_input_dropdown,
              )}
              value={selected || 'Select an item'}
              readOnly
              {...inputProps}
            />
            <Arrow className="w-2.5 rotate-90" />
          </div>
          <div
            className={twMerge(
              `${
                doSearch ? 'block' : 'hidden'
              } group-focus:block active:block z-50 absolute bg-gray-200 shadow-lg drop-shadow-lg mt-1 overflow-x-hidden overflow-y-auto left-0 rounded-md w-full min-h-[3px]`,
              additional_styles_menu_container,
            )}>
            {withSearch && dropdown_items.length > 0 && (
              <input
                className="sticky top-0 bg-inherit border border-b-gray-400/[.5] outline-none py-1 px-2 placeholder:italic w-full"
                placeholder="Search"
                type="text"
                onClick={e => {
                  e.preventDefault();
                  setDoSearch((e as any).target);
                }}
                onChange={onSearch}
              />
            )}
            <ul className="list-none max-h-[230px]">
              {SearchData.length > 0
                ? SearchData.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="hover:bg-gray-300 py-1 px-2 transition-all"
                        onClick={() => {
                          setclicked(!clicked);
                          setSelected(item);
                          (document.activeElement as HTMLElement).blur();
                        }}>
                        {item}
                      </li>
                    );
                  })
                : dropdown_items.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="hover:bg-gray-300 py-1 px-2 transition-all"
                        onClick={() => {
                          setclicked(!clicked);
                          setSelected(item);
                          (document.activeElement as HTMLElement).blur();
                        }}>
                        {item}
                      </li>
                    );
                  })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Input;
