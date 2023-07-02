import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  applySearch,
  setSearchState,
  singleSearch,
} from '../../store/searchSlice';
import Button from '../button';
import Input from '../input_form/input';
import Image from 'next/image';

export default function SearchWidget() {
  const [expandSearch, setExpandSearch] = useState(false);
  const inputAdditionalStyle =
    'bg-searchbg text-black text-[14.5px] py-0 w-full';
  // search function when expand = false will directly go to the slice
  // implement search to store after apply filter
  const dispatch = useDispatch();
  const searches = useSelector(state => state.search.value);
  const [searchValues, setSearchValues] = useState(searches);
  const handleChange = e => {
    const {name, value} = e.target;
    setSearchValues(prev => ({
      ...prev,
      [name]: value,
    }));
    console.log(name, value);
  };

  const applyFilter = e => {
    e.preventDefault();
    dispatch(setSearchState(true));
    dispatch(applySearch(searchValues));
  };

  const singleSearchChange = e => {
    dispatch(singleSearch(e.target.value));
  };

  useEffect(() => {
    if (expandSearch) setSearchValues(searches);
    else {
      if (searches.searchAll === '') {
        dispatch(setSearchState(false));
      }
      dispatch(
        applySearch({
          searchAll: searches.searchAll,
          dataType: 'Select an Item',
          dataClass: 'Select an Item',
          subDataClassification: 'Select an Item',
          type: 'Select an Item',
          workingArea: 'Select an Item',
          AFE: '',
        }),
      );
    }
  }, [expandSearch]);

  // if the search state is true redirect to home
  const searchState = useSelector(state => state.search.search);
  const router = useRouter();
  useEffect(() => {
    if (searchState) router.push('/');
  }, [searchState]);

  return (
    <div className="w-full h-auto px-5 pt-1 text-[14.5px]">
      {!expandSearch ? (
        <div className="flex flex-row items-center relative justify-between">
          <Image
            alt="icon"
            src="/icons/magnify.svg"
            width={30}
            height={30}
            className="w-[.9rem] h-[22px] absolute"
          />
          <Input
            type="string"
            name={'searchAll'}
            placeholder={'Search all'}
            value={searches.searchAll}
            additional_styles="flex-1"
            onChange={singleSearchChange}
            additional_styles_input="bg-transparent text-black text-[14.5px] indent-5 flex-1"
          />
          <div
            className="select-none cursor-pointer flex items-center text-[11px] text-[#939393] bg-transparent hover:bg-gray-200 px-2 py-1 transition-all rounded-md"
            title="Expand"
            onClick={() => setExpandSearch(true)}>
            <p>Expand</p>
            <Image
              alt="icon"
              src="/icons/chevron-down.svg"
              width={30}
              height={30}
              className="w-[.9rem] h-[22px] fill-[#939393]"
            />
          </div>
        </div>
      ) : (
        <form
          className="relative flex flex-col gap-y-2 pb-2 w-full"
          onSubmit={applyFilter}>
          <div className="flex flex-row items-center relative w-full">
            <Image
              alt="icon"
              src="/icons/magnify.svg"
              width={30}
              height={30}
              className="w-[.9rem] h-[22px] absolute left-2"
            />
            <Input
              type="string"
              name={'searchAll'}
              placeholder={'Search all'}
              additional_styles="w-full"
              onChange={handleChange}
              value={searchValues.searchAll}
              additional_styles_input="bg-searchbg text-black text-[14.5px] indent-5"
            />
          </div>
          <div className="flex flex-row items-center justify-between gap-x-1 w-full">
            <Input
              label="Data type"
              label_loc="above"
              type="dropdown"
              name={'dataType'}
              dropdown_items={['Select an Item', 'a', 'b', 'c']}
              additional_styles="w-[49%]"
              additional_styles_label="w-full"
              value={searchValues.dataType}
              additional_styles_input={inputAdditionalStyle}
              onChange={handleChange}
            />
            <Input
              label="Data class"
              label_loc="above"
              type="dropdown"
              name={'dataClass'}
              dropdown_items={['Select an Item', 'd', 'e', 'f']}
              additional_styles="w-[49%]"
              additional_styles_label="w-full"
              value={searchValues.dataClass}
              additional_styles_input={inputAdditionalStyle}
              onChange={handleChange}
            />
          </div>
          <Input
            label="Sub-data classification"
            label_loc="above"
            type="dropdown"
            name={'subDataClassification'}
            dropdown_items={['Select an Item', 'a', 'b', '???']}
            value={searchValues.subDataClassification}
            additional_styles="w-full"
            additional_styles_label="w-full"
            additional_styles_input={inputAdditionalStyle}
            onChange={handleChange}
          />
          <div className="flex flex-row items-center gap-x-1 justify-between">
            <Input
              label="Type"
              label_loc="above"
              type="dropdown"
              name={'type'}
              dropdown_items={['Select an Item', 'a', 'b', 'c']}
              value={searchValues.type}
              additional_styles="w-[49%]"
              additional_styles_label="w-full"
              additional_styles_input={inputAdditionalStyle}
              onChange={handleChange}
            />
            <Input
              label="Working area"
              label_loc="above"
              type="dropdown"
              name={'workingArea'}
              dropdown_items={[
                'Select an Item',
                'jakarta',
                'bandung',
                'somewhere',
                'not set',
              ]}
              value={searchValues.workingArea}
              additional_styles="w-[49%]"
              additional_styles_label="w-full"
              additional_styles_input={inputAdditionalStyle}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <Input
              label="AFE"
              label_loc="above"
              placeholder="0"
              type="number"
              name={'AFE'}
              value={searchValues.AFE}
              additional_styles="w-full"
              additional_styles_label="w-full"
              additional_styles_input={inputAdditionalStyle}
              onChange={handleChange}
            />
            <div className="absolute top-0 left-[30px] text-[13px] text-[#a3a3a3]">
              (Input 0 to search all)
            </div>
          </div>
          <div className="flex flex-row items-center justify-center mt-2">
            <Button
              path=""
              type="submit"
              button_description="Apply filters"
              onClick={applyFilter}
              additional_styles="py-1 w-40 justify-center bg-searchbg"
            />
          </div>
          <div
            title="Collapse"
            className="absolute bottom-0 right-0 px-1.5 py-1 cursor-pointer hover:bg-gray-200 rounded-md transition-all">
            <Image
              alt="icon"
              src="/icons/chevron-double-up.svg"
              width={30}
              height={30}
              className="w-[.9rem] h-[22px] fill-[#939393]"
              onClick={() => setExpandSearch(false)}
            />
          </div>
        </form>
      )}
      <div className="border-b border-b-[#dddddd]" />
    </div>
  );
}
