import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { fetchApi } from '../api/fetchApi';

interface SelectOption {
  label: string;
  value: number | string;
}

interface Iterator {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  label: string;
  apiUrl: string;
  iterator: Iterator;
  value: SelectOption | null;
  onChange: (option: SelectOption | null) => void;
  searchable?: boolean;
  required?: boolean;
  hasError?: boolean;
}

export function SelectDropdown({
  label,
  apiUrl,
  iterator,
  value,
  onChange,
  // searchable = true,
  required = false,
  hasError = false,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  // const [search, setSearch] = useState('');

  const loadOptions = useCallback(async () => {
    if (hasFetched) return;
    setIsLoading(true);
    try {
      const response = await fetchApi(apiUrl);
      if (response?.data) {
        const mapped = response.data.map((item: Record<string, unknown>) => ({
          label: String(item[iterator.label] ?? ''),
          value: item[iterator.value],
        }));
        setOptions(mapped);
      }
      setHasFetched(true);
    } catch (error) {
      console.error(`Failed to load options for ${label}:`, error);
    }
    setIsLoading(false);
  }, [apiUrl, iterator, hasFetched, label]);

  const handleOpen = () => {
    setIsOpen(true);
    // setSearch('');
    if (!hasFetched) {
      loadOptions();
    }
  };

  const handleSelect = (option: SelectOption) => {
    onChange(option);
    setIsOpen(false);
  };

  // const filteredOptions = search
  //   ? options.filter((o) =>
  //       o.label.toLowerCase().includes(search.toLowerCase()),
  //     )
  //   : options;

  const borderColor = hasError ? '#e03131' : value ? '#228be6' : '#373a40';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.trigger, { borderColor }]}
        onPress={handleOpen}
      >
        <Text style={value ? styles.triggerText : styles.placeholder}>
          {value?.label ?? `Select ${label}`}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            {/*{searchable && (*/}
            {/*  <TextInput*/}
            {/*    style={styles.searchInput}*/}
            {/*    placeholder="Search..."*/}
            {/*    placeholderTextColor="#868e96"*/}
            {/*    value={search}*/}
            {/*    onChangeText={setSearch}*/}
            {/*    autoFocus*/}
            {/*  />*/}
            {/*)}*/}
            {isLoading ? (
              <ActivityIndicator
                color="#228be6"
                style={styles.loader}
              />
            ) : (
              <FlatList
                data={options}
                keyExtractor={(item) => String(item.value)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      value?.value === item.value && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value?.value === item.value && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No options found</Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    color: '#c1c2c5',
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  required: {
    color: '#e03131',
  },
  trigger: {
    backgroundColor: '#25262b',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triggerText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
  },
  placeholder: {
    color: '#868e96',
    fontSize: 15,
    flex: 1,
  },
  chevron: {
    color: '#868e96',
    fontSize: 14,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1a1b1e',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#25262b',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  closeBtn: {
    color: '#868e96',
    fontSize: 20,
    padding: 4,
  },
  searchInput: {
    backgroundColor: '#25262b',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    margin: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#373a40',
  },
  loader: {
    padding: 40,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#25262b',
  },
  optionSelected: {
    backgroundColor: '#1c3a5c',
  },
  optionText: {
    color: '#c1c2c5',
    fontSize: 15,
  },
  optionTextSelected: {
    color: '#228be6',
    fontWeight: '600',
  },
  emptyText: {
    color: '#868e96',
    textAlign: 'center',
    padding: 24,
    fontSize: 15,
  },
});
