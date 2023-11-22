import {AddSquare, ArrowDown2} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {FlatList, Modal, View} from 'react-native';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
import {DropdownItem} from '../models/DropdownItem';
import {RowComponent} from './RowComponent';
import TextComponent from './TextComponent';
import TitleComponent from './TitleComponent';
import ButtonIcon from './ButtonIcon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {globalStyles} from '../styles/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {InputCompoment} from './InputComponent';
import {i18n} from '../languages/i18n';
import LinkComponent from './LinkComponent';
import {replaceName} from '../utils/replaceName';
import SpaceComponent from './SpaceComponent';

interface Props {
  selected: string | string[];
  items: DropdownItem[];
  onSeleted: (val: string | string[]) => void;
  multible?: boolean;
  title?: string;
  placeholder?: string;
  onAddNew?: () => void;
}

const DropdownPicker = (props: Props) => {
  const {selected, items, onSeleted, title, placeholder, onAddNew, multible} =
    props;

  const [isVisibleModalListData, setIsVisibleModalListData] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [result, setResult] = useState<DropdownItem[]>([]);
  const [itemSelected, setitemSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!searchKey) {
      setResult([]);
    } else {
      const data = items.filter(element =>
        replaceName(element.label).includes(replaceName(searchKey)),
      );

      setResult(data);
    }
  }, [searchKey]);

  const getItemSelectedValue = (id: string) => {
    const item = items.find(element => element.value === id);
    return item?.label ?? '';
  };

  const renderText = () => {
    if (multible) {
      return (
        <RowComponent
          styles={{
            flex: 1,
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}>
          {itemSelected.length > 0 ? (
            itemSelected.map((item, index) => (
              <RowComponent
                onPress={() => handleSelectedItem(item)}
                key={`item.${index}`}
                styles={{
                  marginRight: 8,
                  padding: 4,
                  backgroundColor: appColors.white,
                  borderRadius: 8,
                  marginBottom: 4,
                }}>
                <TextComponent text={getItemSelectedValue(item)} flex={0} />
                <SpaceComponent width={4} />
                <AntDesign name="close" size={14} />
              </RowComponent>
            ))
          ) : (
            <TextComponent
              text={placeholder ?? title ?? ''}
              color={appColors.gray7}
            />
          )}
        </RowComponent>
      );
    } else {
      return (
        <TextComponent
          color={selected ? appColors.text : appColors.gray7}
          text={
            selected
              ? getItemSelectedValue(selected as string)
              : placeholder
              ? placeholder
              : title
              ? title
              : ''
          }
          flex={1}
        />
      );
    }
  };

  const handleSelectedItem = (item: string) => {
    const items = [...itemSelected];
    const index = items.findIndex(element => element === item);

    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(item);
    }

    setitemSelected(items);
  };

  return (
    <View style={{marginBottom: 16}}>
      <RowComponent>
        {title && (
          <TitleComponent flex={1} text={title} font={fontFamilies.medium} />
        )}
        {onAddNew && (
          <RowComponent
            onPress={onAddNew}
            styles={{
              paddingLeft: 12,
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <TextComponent text={i18n.t('addNew')} color={appColors.primary} />
            <SpaceComponent width={4} />
            <AddSquare size={16} color={appColors.primary} variant="Bold" />
          </RowComponent>
        )}
      </RowComponent>
      <RowComponent
        onPress={() => setIsVisibleModalListData(true)}
        styles={{
          backgroundColor: multible ? appColors.light : appColors.gray2,
          paddingHorizontal: multible ? 0 : 8,
          paddingVertical: multible ? 0 : 15,
          borderRadius: 8,
          marginTop: 6,
        }}>
        {renderText()}
        <ArrowDown2 size={18} color={appColors.text} />
      </RowComponent>
      <Modal
        visible={isVisibleModalListData}
        animationType="slide"
        transparent
        statusBarTranslucent
        style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: appColors.white,
            padding: 20,
            paddingTop: 32,
          }}>
          <RowComponent>
            <View style={{flex: 1, marginRight: 12}}>
              <InputCompoment
                value={searchKey}
                onChange={val => setSearchKey(val)}
                clear
                color={appColors.gray0}
                placeholder={i18n.t('search')}
                styles={{marginBottom: 0}}
              />
            </View>
            <LinkComponent
              text={i18n.t('close')}
              onPress={() => setIsVisibleModalListData(false)}
            />
          </RowComponent>

          <FlatList
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            data={searchKey ? result : items}
            ListEmptyComponent={
              <View>
                <TextComponent
                  styles={{paddingTop: 18}}
                  text="Không tìm thấy dữ liệu bạn cần"
                />

                {onAddNew && (
                  <RowComponent
                    onPress={onAddNew}
                    styles={{
                      marginTop: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AddSquare
                      color={appColors.link}
                      size={20}
                      variant="Bold"
                    />
                    <SpaceComponent width={4} />
                    <TextComponent
                      text={i18n.t('addNew')}
                      flex={0}
                      color={appColors.link}
                    />
                  </RowComponent>
                )}
              </View>
            }
            renderItem={({item}) => (
              <RowComponent
                styles={{marginVertical: 10}}
                onPress={
                  multible
                    ? () => handleSelectedItem(item.value)
                    : () => {
                        onSeleted(item.value);
                        setIsVisibleModalListData(false);
                      }
                }>
                <TextComponent text={item.label} flex={1} />
                {((multible && itemSelected.includes(item.value)) ||
                  selected === item.value) && (
                  <Ionicons
                    name="checkmark-circle-outline"
                    color={appColors.primary}
                    size={18}
                  />
                )}
              </RowComponent>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default DropdownPicker;
