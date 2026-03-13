import {useState, useRef, useImperativeHandle, forwardRef} from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const MIN_SEARCH_LENGTH = 3;

interface SearchInputProps {
    placeholder?: string;
    onSearch: (value: string) => void;
    onClear: () => void;
}

export interface SearchInputHandle {
    reset: () => void;
}

export const SearchInput = forwardRef<SearchInputHandle, SearchInputProps>(
    ({placeholder = 'Search products...', onSearch, onClear}, ref) => {
        const inputRef = useRef<TextInput>(null);
        const [text, setText] = useState('');
        const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);

        useImperativeHandle(ref, () => ({
            reset: () => {
                setText('');
                setCurrentPlaceholder(placeholder);
            },
        }));

        const handleSubmit = () => {
            const normalized = text.trim().replace(/\s+/g, ' ');

            if (!normalized) {
                setText('');
                setCurrentPlaceholder('Enter some value first');
                return;
            }

            if (!/^[a-zA-Z0-9 ]+$/.test(normalized)) {
                setText('');
                setCurrentPlaceholder('Only letters, numbers, and spaces');
                return;
            }

            if (normalized.length <= MIN_SEARCH_LENGTH) {
                setText('');
                setCurrentPlaceholder(`Min ${MIN_SEARCH_LENGTH} characters`);
                return;
            }

            setText(normalized);
            onSearch(normalized);
        };

        const handleClear = () => {
            setText('');
            setCurrentPlaceholder(placeholder);
            onClear();
        };

        return (
            <View style={styles.wrapper}>
                <TouchableOpacity
                    style={styles.iconLeft}
                    onPress={handleSubmit}
                    activeOpacity={0.6}
                >
                    <Ionicons name="search" size={20} color="#868e96"/>
                </TouchableOpacity>

                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder={currentPlaceholder}
                    placeholderTextColor="#868e96"
                    onSubmitEditing={handleSubmit}
                    returnKeyType="search"
                    autoCorrect={false}
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={styles.iconRight}
                    onPress={handleClear}
                    activeOpacity={0.6}
                >
                    <Ionicons name="close-circle" size={20} color="#868e96"/>
                </TouchableOpacity>
            </View>
        );
    },
);

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#25262b',
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#373a40',
    },
    iconLeft: {
        paddingLeft: 12,
        paddingRight: 4,
        paddingVertical: 12,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    iconRight: {
        paddingRight: 12,
        paddingLeft: 4,
        paddingVertical: 12,
    },
});
