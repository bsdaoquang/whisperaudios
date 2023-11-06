import React, {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, View, useColorScheme} from 'react-native';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonIcon from '../../../components/ButtonIcon';
import {RowComponent} from '../../../components/RowComponent';
import TextComponent from '../../../components/TextComponent';
import {appColors} from '../../../constants/appColors';
import {fontFamilies} from '../../../constants/fontFamilies';
import {Chap} from '../../../models/Chapter';
import {showToast} from '../../../utils/showToast';

interface Props {
  item: Chap;
  index: number;
  onSelectChap: (index: number) => void;
  activeChap?: number;
}
const AudioItem = (props: Props) => {
  const {item, index, onSelectChap, activeChap} = props;
  const theme = useColorScheme();

  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadingJobId, setDownloadingJobId] = useState<number>();

  useEffect(() => {
    getFileDownloaded();
  }, []);

  const getFileDownloaded = async () => {
    // get a list of files and directories in the main bundle
    RNFS.readDir(RNFS.DocumentDirectoryPath + item.downloadFilename) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(result => {
        console.log('GOT RESULT', result);

        // stat the first file
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then(statResult => {
        if (statResult[0].isFile()) {
          // if we have a file, read it
          return RNFS.readFile(statResult[1], 'utf8');
        }

        return 'no file';
      })
      .then(contents => {
        // log the file contents
        console.log(contents);
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  };

  const handleDownloadFile = async (item: Chap) => {
    const writeGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (!writeGranted) {
      console.log('Read and write permissions have not been granted');
      return;
    } else if (downloadingJobId) {
      Alert.alert('Lỗi', 'Xin lỗi bạn chỉ có thể download 1 file mỗi lần');
    } else {
      const url = item.downloadUrl;
      const filePath = RNFS.DocumentDirectoryPath + item.downloadFilename;
      console.log(filePath);
      setDownloading(true);

      RNFS.downloadFile({
        fromUrl: url,
        toFile: filePath,
        background: true, // Enable downloading in the background (iOS only)
        discretionary: true, // Allow the OS to control the timing and speed (iOS only)
        progress: res => {
          // Handle download progress updates if needed
          const progress = (res.bytesWritten / res.contentLength) * 100;
          setProgress(progress);
          setDownloadingJobId(res.jobId);
        },
      })
        .promise.then(response => {
          console.log('File downloaded!', response);
          showToast('Downloaded');
          setDownloading(false);
          setDownloadingJobId(undefined);
        })
        .catch(err => {
          console.log('Download error:', err);
          setDownloading(false);
          showToast('Download stoped');
          setDownloadingJobId(undefined);
        });
    }
  };

  return (
    <RowComponent
      key={`item${index}`}
      onPress={activeChap !== index ? () => onSelectChap(index) : undefined}
      styles={{
        marginBottom: 16,
        justifyContent: 'space-between',
      }}>
      <View style={{flex: 1}}>
        <TextComponent
          text={item.title}
          flex={1}
          color={
            activeChap === index
              ? appColors.primary
              : theme === 'dark'
              ? appColors.white
              : appColors.text
          }
          font={fontFamilies.medium}
        />
        {activeChap === index && (
          <TextComponent
            size={12}
            color={appColors.gray}
            text={`Playing`}
            flex={1}
          />
        )}

        {downloading && (
          <RowComponent
            styles={{alignItems: 'center', justifyContent: 'center'}}>
            <TextComponent
              text="Downloading"
              size={12}
              color={appColors.gray}
            />
            <View
              style={{
                flex: 1,
                marginHorizontal: 8,
                height: 4,
                backgroundColor: appColors.gray,
              }}>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 8,
                  width: `${progress}%`,
                  height: 4,
                  backgroundColor: appColors.primary,
                }}
              />
            </View>
            <TextComponent
              styles={{width: 40}}
              text={`${progress.toFixed(2)}%`}
              size={12}
              color={appColors.gray}
            />
            {downloadingJobId && (
              <ButtonIcon
                onPress={async () => await RNFS.stopDownload(downloadingJobId)}
                icon={<Ionicons name="stop" size={18} color={appColors.gray} />}
              />
            )}
          </RowComponent>
        )}
      </View>
      {!downloading && (
        <ButtonIcon
          icon={
            <Ionicons
              name="cloud-download-outline"
              size={18}
              color={appColors.gray}
            />
          }
          onPress={() => handleDownloadFile(item)}
        />
      )}
    </RowComponent>
  );
};

export default AudioItem;
