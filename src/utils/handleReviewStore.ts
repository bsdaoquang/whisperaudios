import { Alert } from 'react-native';
import InAppReview from 'react-native-in-app-review';
const handleReviewStore = () => {
  const res = InAppReview.isAvailable();

  if (res) {

    InAppReview.RequestInAppReview().then((hasFlowFinishedSuccessfully) => {
    }).catch(() => {
      console.log('Không thể gửi đánh giá');
    });

  } else {
    console.log('Không thể đánh giá trong ứng dụng');
  }
};

export default handleReviewStore;
