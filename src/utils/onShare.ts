import {Share} from 'react-native';
import {appInfos} from '../constants/appInfos';

export const onShare = async (title?: string, desc?: string) => {
  //share
  try {
    const result = await Share.share({
      message: `${
        title ? title : 'Thư viện sách nói - Truyện Audio miễn phí'
      }\n\n${
        desc ??
        'Không yêu cầu đăng ký thành viên, không thu phí cho mọi lượt nghe'
      }\n\nMiễn phí trên: Whisper - Thư viện sách nói, App nghe truyện audio miễn phí với hàng ngàn truyện Audio thuộc nhiều thể loại: Ngôn Tình, Kiếm Hiệp, Tiên Hiệp, Trinh Thám, Ma-Kinh Dị...\n\nLink: ${
        appInfos.androidUrl
      }`,
    });

    if (result.action === Share.sharedAction) {
      //người dùng chia sẻ
      if (result.activityType) {
        console.log('activityType');
      } else {
        // updateCountValue('countShare', id, 1);
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('Hủy bỏ share');
    }
  } catch (error) {
    console.log(error);
  }
};
