import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Container from '../../components/Container';
import {RowComponent} from '../../components/RowComponent';
import TitleComponent from '../../components/TitleComponent';
import {i18n} from '../../languages/i18n';
import {appInfos} from '../../constants/appInfos';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import TextComponent from '../../components/TextComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UploadScreen = ({navigation}: any) => {
  const menuUpload = [
    {
      key: 'audio',
      title: 'Audio',
      subTitle: 'Tạo audio mới',
      icon: (
        <Image
          source={require('../../assets/images/icons8-audio-book-100.png')}
          style={styles.img}
        />
      ),
      onPress: () => navigation.navigate('CreateAudio'),
    },
    {
      key: 'chap',
      title: 'Chương',
      subTitle: 'Tải lên chương mới cho audio của bạn',
      icon: (
        <MaterialIcons name="audio-file" size={42} color={appColors.primary} />
      ),
      onPress: () => navigation.navigate('AddNewChapter'),
    },
    {
      key: 'live',
      title: 'Phát trực tiếp',
      subTitle: 'Radio online, giao lưu trực tiếp với fan của bạn',
      icon: (
        <MaterialIcons
          name="multitrack-audio"
          size={42}
          color={appColors.primary}
        />
      ),
      onPress: () => console.log(''),
    },
    {
      key: 'record',
      title: 'Ghi âm',
      subTitle: 'Tạo bản ghi âm của bạn, chia sẻ khi bạn muốn',
      icon: <Ionicons name="recording" size={32} color={appColors.primary} />,
      onPress: () => navigation.navigate('Recording'),
    },
  ];

  return (
    <Container title={i18n.t('createAndUpload')}>
      <FlatList
        style={{
          flex: 1,
        }}
        data={menuUpload}
        renderItem={({item}) => (
          <RowComponent
            onPress={item.onPress}
            styles={[
              globalStyles.shadow,
              globalStyles.center,
              styles.buttonAdd,
              {
                alignItems: 'flex-start',
              },
            ]}>
            <View
              style={[
                globalStyles.center,
                {
                  width: 42,
                },
              ]}>
              {item.icon}
            </View>
            <View
              style={{
                flex: 1,
                marginLeft: 12,
              }}>
              <TitleComponent text={item.title} />
              <TextComponent
                text={item.subTitle}
                size={12}
                color={appColors.text2}
              />
            </View>
          </RowComponent>
        )}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
  },
  buttonAdd: {
    marginHorizontal: 16,
    backgroundColor: appColors.white,
    borderRadius: 8,
    marginVertical: 12,
    padding: 8,
    // marginHorizontal: 8,
    // marginVertical: 16,
    // padding: 10,
  },
});

export default UploadScreen;
