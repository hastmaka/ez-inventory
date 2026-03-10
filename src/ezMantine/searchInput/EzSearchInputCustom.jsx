import PropTypes from "prop-types";
import {IconSearch, IconX} from "@tabler/icons-react";
import {TextInput} from "@mantine/core";
import {useEffect, useRef} from "react";
import {useClickOutside} from "@mantine/hooks";
import {useEnterKeySubmit} from "@/util/hook/index.js";

export default function EzSearchInputCustom({state, clearable, ...rest}) {
    const inputRef = useRef(null);
    useClickOutside(() => inputRef.current.placeholder = 'Search...', null, [inputRef]);

    useEffect(() => {
        if (state.tag.searchingByTag) {
            inputRef.current.value = ''
        }
    }, [state.tag.searchingByTag, state.searchValue])

    const handleSearch = (e, ref) => {
        const value = e.key === 'Enter' ? ref.current.value : inputRef.current.value;
        const tempRef = e.key === 'Enter' ? ref : inputRef
        //empty input
        if(!value) {
            tempRef.current.placeholder = 'Enter some value first'
        } else {
            if(!(/^[a-zA-Z0-9]+$/.test(value))) {
                tempRef.current.value = ''
                return tempRef.current.placeholder = 'Only letters and numbers allow'
            }
            if(value.trim().length <= 3) {
                tempRef.current.value = ''
                return tempRef.current.placeholder = 'Min 3 characters to start a search'
            }
            state.handleSearch(value).then()
        }
    }

    const handleInputChange = (e) => {
        state.handleSearchInput(e.target.value)
        if(!e.target.value) {
            inputRef.current.placeholder = 'Search...'
            state.handleSearch().then()
        }
    }

    const handleInputClear = () => {
        state.handleSearchInput('')
        inputRef.current.value = ''
        inputRef.current.placeholder = 'Search...'
        state.handleSearch().then()
    }

    useEnterKeySubmit(inputRef, handleSearch);

    return (
        <TextInput
            ref={inputRef}
            className='input'
            size='md'
            radius='4px'
            value={state.searchValue}
            // leftSectionPointerEvents="none"
            leftSection={<IconSearch width='18px' onClick={handleSearch}/>}
            placeholder='Search ...'
            onChange={handleInputChange}
            {...rest}
            {...(clearable && state.searchValue && {
                rightSection: <IconX width='18px' onClick={handleInputClear}/>
            })}
        />
    )
}

EzSearchInputCustom.propTypes = {
    state: PropTypes.object.isRequired,
    clearable: PropTypes.bool,
}
